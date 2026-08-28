"""
FastAPI Server for SIH26186 AI-Assisted Personnel Welfare Platform
"""

import os
import sys
import json
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Add parent directory to sys.path to import ml modules
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from ml.ml_pipeline import pipeline_manager, RISK_TIERS, RISK_COLORS, MODEL_VERSION

app = FastAPI(
    title="SIH26186 AI-Assisted Welfare Platform",
    description="Multi-layered decision support system for early fatigue & wellness risk identification. Early support, not punishment.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    print("[Server Startup] Initializing Welfare Risk Profile Manager...")
    if not pipeline_manager.is_initialized:
        dataset_path = os.path.join(parent_dir, "ml", "Wellness Dataset - Dr.Fatma M. Talaat.xlsx")
        pipeline_manager.initialize(dataset_path)


@app.get("/api/overview")
def get_overview():
    """Returns unit-level welfare posture, risk distribution, KPI averages, and priority watchlist."""
    return pipeline_manager.get_unit_overview()


@app.get("/api/personnel")
def get_personnel(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    tier: Optional[str] = None,
    search: Optional[str] = None
):
    """Returns paginated list of personnel with risk tier, trend, and priority."""
    return pipeline_manager.get_all_personnel_summary(page=page, limit=limit, filter_tier=tier, search=search)


@app.get("/api/personnel/{personnel_id}")
def get_personnel_profile(personnel_id: str):
    """Returns detailed 3-layer Welfare Risk Profile for an individual personnel."""
    profile = pipeline_manager.get_personnel_profile(personnel_id)
    if not profile:
        raise HTTPException(status_code=404, detail=f"Personnel record '{personnel_id}' not found.")
    # Add any logged actions for this personnel
    personnel_actions = [a for a in LOGGED_ACTIONS if a["personnel_id"] == personnel_id]
    profile["logged_actions"] = personnel_actions
    return profile


@app.post("/api/assess")
def assess_custom_input(input_data: AssessmentInput):
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


@app.get("/api/temporal/{personnel_id}")
def get_temporal_timeline(personnel_id: str, days: int = Query(30, ge=7, le=90)):
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


@app.get("/api/model/metrics")
def get_model_metrics():
    """Returns Level 2 ML model metrics, versioning, confusion matrix, and feature importances."""
    return pipeline_manager.ml_model.metrics


@app.get("/api/actions")
def get_actions(personnel_id: Optional[str] = None):
    """Returns logged supportive welfare actions."""
    if personnel_id:
        return [a for a in LOGGED_ACTIONS if a["personnel_id"] == personnel_id]
    return LOGGED_ACTIONS


@app.post("/api/actions/log")
def log_action(action: ActionLogInput):
    """Logs an authorized supportive welfare intervention."""
    new_act = {
        "action_id": f"ACT-{len(LOGGED_ACTIONS) + 101}",
        "personnel_id": action.personnel_id,
        "action_title": action.action_title,
        "category": action.category,
        "supervisor_notes": action.supervisor_notes,
        "priority": action.priority,
        "status": "ACTIVE",
        "timestamp": "2026-08-28T16:30:00"
    }
    LOGGED_ACTIONS.insert(0, new_act)
    return {"status": "success", "action": new_act}


# Serve Frontend Static files
frontend_dir = os.path.join(parent_dir, "frontend")
if os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

    @app.get("/")
    def serve_frontend_index():
        return FileResponse(os.path.join(frontend_dir, "index.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
