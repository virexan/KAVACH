"""
FastAPI Server for SIH26186 AI-Assisted Personnel Welfare Platform
"""

import os
import sys
import json
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, Query, Depends, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta

JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def _require_jwt_secret() -> str:
    """Fail closed when a deployment has not configured a strong signing key."""
    if not JWT_SECRET or len(JWT_SECRET) < 32:
        raise RuntimeError("JWT_SECRET must be configured with at least 32 characters")
    return JWT_SECRET

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, _require_jwt_secret(), algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, _require_jwt_secret(), algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")


def require_roles(*allowed_roles: str):
    """Authorize only explicitly allowed roles; unknown roles fail closed."""
    def dependency(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user.get("role") not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return current_user
    return dependency

class LoginInput(BaseModel):
    username: str
    password: str

# Add parent directory to sys.path to import ml modules
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from ml.ml_pipeline import pipeline_manager, RISK_TIERS, RISK_COLORS, MODEL_VERSION
from ml.feature_api.schemas import FeatureVectorResponse, ErrorResponse, HealthResponse
from ml.feature_api.service import generate_features_for_personnel
from ml.feature_engineering.pipeline import PersonnelNotFoundError

app = FastAPI(
    title="SIH26186 AI-Assisted Welfare Platform",
    description="Multi-layered decision support system for early fatigue & wellness risk identification. Early support, not punishment.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:5173", "http://localhost:8080", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/auth/login")
def login(data: LoginInput):
    # A real deployment must delegate authentication to an identity provider.
    # Demo credentials are deliberately disabled unless explicitly opted in.
    if os.getenv("DEMO_AUTH_ENABLED", "false").lower() != "true":
        raise HTTPException(status_code=503, detail="Authentication provider is not configured")

    demo_users = {
        "PERS001": "PERSONNEL",
        "OFF001": "WELFARE_OFFICER",
        "CMD001": "COMMANDER",
        "ADM001": "ADMIN",
    }
    role = demo_users.get(data.username.upper())
    if data.password != "demo1234" or role is None:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    token = create_access_token({"sub": data.username.upper(), "role": role})
    return {"access_token": token, "token_type": "bearer", "user": {"id": data.username.upper(), "role": role}}


@app.post("/api/v1/auth/refresh")
def refresh_access_token(current_user: dict = Depends(get_current_user)):
    """Rotate an authenticated session token without trusting client claims."""
    token = create_access_token({"sub": current_user["sub"], "role": current_user["role"]})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/api/v1/auth/me")
def get_current_identity(current_user: dict = Depends(get_current_user)):
    return {"id": current_user["sub"], "role": current_user["role"]}


# In-memory storage for logged welfare actions
LOGGED_ACTIONS: List[Dict[str, Any]] = [
    {
        "action_id": "ACT-101",
        "personnel_id": "PERS-0003",
        "action_title": "48-Hour Recuperative Rest Rotation",
        "category": "Deployment & Rest",
        "supervisor_notes": "Continuous deployment reached 110 days. Granted 2-day stand-down rest cycle.",
        "status": "ACTIVE",
        "timestamp": "2026-08-28T14:30:00"
    },
    {
        "action_id": "ACT-102",
        "personnel_id": "PERS-0005",
        "action_title": "Shift Re-allocation & Sleep Hygiene Guidance",
        "category": "Duty & Workload",
        "supervisor_notes": "High duty hours paired with 5.5h sleep. Swapped night shifts with peer rotation.",
        "status": "IN_PROGRESS",
        "timestamp": "2026-08-27T09:15:00"
    }
]


# Pydantic schema for live assessment
class AssessmentInput(BaseModel):
    duty_hours_daily: float = Field(8.0, ge=4.0, le=20.0)
    avg_weekly_duty_hours: Optional[float] = None
    deployment_days: int = Field(30, ge=0, le=365)
    consecutive_shifts: int = Field(5, ge=0, le=60)
    leave_deficit_days: int = Field(4, ge=0, le=90)
    workload_level: int = Field(5, ge=1, le=10)
    workload_surge_pct: float = Field(0.0, ge=-50.0, le=150.0)
    sleep_hours: float = Field(7.0, ge=3.0, le=12.0)
    stress_level: int = Field(5, ge=1, le=10)
    heart_rate: int = Field(72, ge=45, le=140)
    systolic_bp: float = Field(120.0, ge=80.0, le=200.0)
    diastolic_bp: float = Field(80.0, ge=50.0, le=120.0)
    mood_code: int = Field(1, ge=0, le=2, description="0=Sad, 1=Neutral, 2=Happy")
    social_score: float = Field(3.0, ge=1.0, le=5.0)
    mental_health_act: float = Field(1.0, ge=0.0, le=3.0)
    water_liters: float = Field(2.0, ge=0.5, le=5.0)
    daily_steps: int = Field(8000, ge=500, le=30000)
    physical_activity_min: int = Field(30, ge=0, le=180)
    diet_quality: float = Field(0.8, ge=0.0, le=1.0)
    nutrition_calories: int = Field(2200, ge=1000, le=5000)
    env_stress: float = Field(0.0, ge=0.0, le=2.0)
    lifestyle_risk: float = Field(0.0, ge=0.0, le=4.0)
    bmi_code: int = Field(0, ge=0, le=3)


class ActionLogInput(BaseModel):
    personnel_id: str
    action_title: str
    category: str
    supervisor_notes: str
    priority: str = "HIGH"


@app.on_event("startup")
def startup_event():
    _require_jwt_secret()
    print("[Server Startup] Initializing Welfare Risk Profile Manager...")
    if not pipeline_manager.is_initialized:
        dataset_path = os.path.join(parent_dir, "ml", "data", "raw", "SIH26186_Complete_Dataset_10Tables.xlsx")
        pipeline_manager.initialize(dataset_path)


@app.get("/api/v1/overview")
def get_overview(current_user: dict = Depends(require_roles("WELFARE_OFFICER", "COMMANDER", "ADMIN"))):
    """Returns unit-level welfare posture, risk distribution, KPI averages, and priority watchlist."""
    return pipeline_manager.get_unit_overview(role=current_user["role"])


@app.get("/api/v1/personnel")
def get_personnel(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    tier: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(require_roles("WELFARE_OFFICER", "ADMIN")),
):
    """Returns paginated list of personnel with risk tier, trend, and priority."""
    return pipeline_manager.get_all_personnel_summary(page=page, limit=limit, filter_tier=tier, search=search)

@app.get("/api/v1/personnel/{personnel_id}")
def get_personnel_profile(personnel_id: str, current_user: dict = Depends(require_roles("WELFARE_OFFICER", "ADMIN"))):
    """Returns detailed 3-layer Welfare Risk Profile for an individual personnel."""
    profile = pipeline_manager.get_personnel_profile(personnel_id)
    if not profile:
        raise HTTPException(status_code=404, detail=f"Personnel record '{personnel_id}' not found.")
    # Add any logged actions for this personnel
    personnel_actions = [a for a in LOGGED_ACTIONS if a["personnel_id"] == personnel_id]
    profile["logged_actions"] = personnel_actions
    return profile


@app.post("/api/v1/assess")
def assess_custom_input(input_data: AssessmentInput, current_user: dict = Depends(require_roles("WELFARE_OFFICER", "ADMIN"))):
    """Live assessment & What-If risk simulator endpoint."""
    data_dict = input_data.dict()

    # Compute dependent features if omitted
    if data_dict.get("avg_weekly_duty_hours") is None:
        data_dict["avg_weekly_duty_hours"] = data_dict["duty_hours_daily"] * 5.4

    data_dict["pulse_pressure"] = data_dict["systolic_bp"] - data_dict["diastolic_bp"]
    data_dict["mean_arterial_bp"] = data_dict["diastolic_bp"] + (data_dict["pulse_pressure"] / 3.0)
    data_dict["sleep_deficit"] = max(0.0, 8.0 - data_dict["sleep_hours"])
    data_dict["sleep_to_workload_ratio"] = data_dict["sleep_hours"] / max(data_dict["duty_hours_daily"], 1.0)
    data_dict["personnel_id"] = "PERS-SIMULATED"

    profile = pipeline_manager.generate_complete_profile(data_dict)
    return profile


@app.get("/api/v1/temporal/{personnel_id}")
def get_temporal_timeline(personnel_id: str, days: int = Query(30, ge=7, le=90), current_user: dict = Depends(require_roles("WELFARE_OFFICER", "ADMIN"))):
    """Returns longitudinal multi-day temporal trajectory for a personnel."""
    profile = pipeline_manager.get_personnel_profile(personnel_id)
    if not profile:
        raise HTTPException(status_code=404, detail=f"Personnel record '{personnel_id}' not found.")
    timeline = pipeline_manager.temporal_engine.generate_timeline(profile, days=days)
    traj_eval = pipeline_manager.temporal_engine.evaluate_trajectory(timeline)
    return {
        "personnel_id": personnel_id,
        "days": days,
        "timeline": timeline,
        "trajectory_evaluation": traj_eval
    }


@app.get("/api/v1/model/metrics")
def get_model_metrics(current_user: dict = Depends(require_roles("ADMIN"))):
    """Returns Level 2 ML model metrics, versioning, confusion matrix, and feature importances."""
    return pipeline_manager.ml_model.metrics


@app.get("/api/v1/actions")
def get_actions(personnel_id: Optional[str] = None, current_user: dict = Depends(require_roles("WELFARE_OFFICER", "ADMIN"))):
    """Returns logged supportive welfare actions."""
    if personnel_id:
        return [a for a in LOGGED_ACTIONS if a["personnel_id"] == personnel_id]
    return LOGGED_ACTIONS


@app.post("/api/v1/actions/log")
def log_action(action: ActionLogInput, current_user: dict = Depends(require_roles("WELFARE_OFFICER", "ADMIN"))):
    """Logs an authorized supportive welfare intervention."""
    new_act = {
        "action_id": f"ACT-{len(LOGGED_ACTIONS) + 101}",
        "personnel_id": action.personnel_id,
        "action_title": action.action_title,
        "category": action.category,
        "supervisor_notes": action.supervisor_notes,
        "priority": action.priority,
        "author_id": current_user.get("sub"),
        "status": "ACTIVE",
        "timestamp": "2026-08-28T16:30:00"
    }
    LOGGED_ACTIONS.insert(0, new_act)
    return {"status": "success", "action": new_act}

# --- Feature Engineering Endpoints ---

@app.get("/features/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")

@app.post(
    "/features/generate/{personnel_id}",
    response_model=FeatureVectorResponse,
    responses={404: {"model": ErrorResponse}},
)
def generate_features(personnel_id: int, current_user: dict = Depends(require_roles("WELFARE_OFFICER", "ADMIN"))) -> FeatureVectorResponse:
    """
    Generates the current, consent-aware engineered feature vector for one
    personnel record. Intended to be called by the Risk Engine service
    just before running inference.
    """
    try:
        payload = generate_features_for_personnel(personnel_id)
    except PersonnelNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal error generating features")

    return FeatureVectorResponse(**payload)


# Serve Frontend Static files
frontend_dir = os.path.join(parent_dir, "frontend")
if os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

    @app.get("/")
    def serve_frontend_index():
        return FileResponse(os.path.join(frontend_dir, "C:/Users/KIIT/KAVACH/index.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
