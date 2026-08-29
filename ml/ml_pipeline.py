"""
SIH26186 AI-Assisted Welfare Platform - ML & Analytics Pipeline
Three-Tier Intelligence Architecture:
- Level 1: Rule-Based Risk Indicators (Transparent deterministic baseline)
- Level 2: Tabular ML Risk Model (XGBoost / LightGBM + SHAP / Feature Contributions)
- Level 3: Temporal Risk Analysis (7-day, 30-day, 90-day trajectory & chronic vs anomaly detection)
- Unified Welfare Risk Profile & Supportive Action Generator
"""

import os
import re
import json
import time
import logging
import hashlib
import numpy as np
import pandas as pd
import joblib
from datetime import datetime, timedelta

# Module-level logger
logger = logging.getLogger("welfare_pipeline")
if not logger.handlers:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

from sklearn.model_selection import train_test_split, StratifiedKFold, GroupShuffleSplit
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, f1_score, precision_score, recall_score, brier_score_loss
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier

# Check XGBoost & SHAP availability
try:
    import xgboost as xgb
    XGB_AVAILABLE = True
except ImportError:
    XGB_AVAILABLE = False

try:
    import shap
    SHAP_AVAILABLE = True
except ImportError:
    SHAP_AVAILABLE = False

print(f"[ML Pipeline] XGBoost Available: {XGB_AVAILABLE} | SHAP Available: {SHAP_AVAILABLE}")

RISK_TIERS = ["LOW", "MODERATE", "ELEVATED", "HIGH"]
RISK_COLORS = {
    "LOW": "#10b981",       # Emerald
    "MODERATE": "#f59e0b",  # Amber
    "ELEVATED": "#f97316",  # Orange
    "HIGH": "#ef4444"       # Red
}

MODEL_VERSION = "v1.0.0-xgb-hybrid"

# Resolve model files relative to this pipeline, rather than the process working
# directory. This keeps the pipeline portable when it is launched from elsewhere.
PIPELINE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_MODEL_DIR = os.path.join(PIPELINE_DIR, "models")

FEATURE_COLS = [
    'sleep_hours', 'physical_activity_min', 'stress_level', 'workload_level',
    'heart_rate', 'systolic_bp', 'diastolic_bp', 'pulse_pressure', 'mean_arterial_bp',
    'nutrition_calories', 'diet_quality', 'water_liters', 'daily_steps',
    'social_score', 'mental_health_act', 'env_stress', 'lifestyle_risk',
    'bmi_code', 'mood_code', 'duty_hours_daily', 'avg_weekly_duty_hours',
    'deployment_days', 'consecutive_shifts', 'leave_deficit_days',
    'workload_surge_pct', 'sleep_deficit', 'sleep_to_workload_ratio',
    'resting_hr_stress', 'cardiovascular_strain'
]

FEATURE_BOUNDS = {
    'sleep_hours': (1.0, 18.0, 7.0),
    'physical_activity_min': (0.0, 360.0, 30.0),
    'stress_level': (1.0, 10.0, 5.0),
    'workload_level': (1.0, 10.0, 5.0),
    'heart_rate': (40.0, 180.0, 72.0),
    'systolic_bp': (70.0, 240.0, 120.0),
    'diastolic_bp': (40.0, 140.0, 80.0),
    'nutrition_calories': (500.0, 8000.0, 2200.0),
    'diet_quality': (0.0, 1.0, 0.8),
    'water_liters': (0.2, 8.0, 2.0),
    'daily_steps': (0.0, 50000.0, 8000.0),
    'social_score': (1.0, 5.0, 3.0),
    'mental_health_act': (0.0, 5.0, 1.0),
    'env_stress': (0.0, 5.0, 0.0),
    'lifestyle_risk': (0.0, 5.0, 0.0),
    'bmi_code': (0, 3, 0),
    'mood_code': (0, 2, 1),
    'duty_hours_daily': (4.0, 20.0, 8.0),
    'avg_weekly_duty_hours': (10.0, 140.0, 44.0),
    'deployment_days': (0, 730, 30),
    'consecutive_shifts': (0, 90, 5),
    'leave_deficit_days': (0, 180, 4),
    'workload_surge_pct': (-100.0, 300.0, 0.0),
}


def sanitize_feature_dict(data: dict) -> dict:
    """Defensively cleans, validates, bounds-checks, and computes derived features for risk evaluation."""
    if not isinstance(data, dict):
        data = {}
    
    cleaned = dict(data)
    
    # 1. Bounds check and impute base features
    for col, (min_v, max_v, default_v) in FEATURE_BOUNDS.items():
        raw_val = cleaned.get(col)
        if raw_val is None or (isinstance(raw_val, float) and (np.isnan(raw_val) or np.isinf(raw_val))):
            val = float(default_v)
        else:
            try:
                val = float(raw_val)
                val = max(float(min_v), min(float(max_v), val))
            except (ValueError, TypeError):
                val = float(default_v)

        # Cast integer codes
        if col in ('bmi_code', 'mood_code', 'deployment_days', 'consecutive_shifts', 'leave_deficit_days'):
            cleaned[col] = int(round(val))
        else:
            cleaned[col] = val

    # 2. Recompute / ensure consistent derived features
    if 'avg_weekly_duty_hours' not in data or data['avg_weekly_duty_hours'] is None:
        cleaned['avg_weekly_duty_hours'] = round(cleaned['duty_hours_daily'] * 5.4, 1)

    pulse_press = max(10.0, cleaned['systolic_bp'] - cleaned['diastolic_bp'])
    mean_art_bp = cleaned['diastolic_bp'] + (pulse_press / 3.0)
    sleep_def = max(0.0, 8.0 - cleaned['sleep_hours'])
    sleep_work_ratio = cleaned['sleep_hours'] / max(cleaned['duty_hours_daily'], 1.0)
    r_hr_stress = max(0.0, (cleaned['heart_rate'] - 65.0) / 25.0)
    cv_strain = max(0.0, (mean_art_bp - 93.0) / 20.0 * 0.6 + (pulse_press - 40.0) / 20.0 * 0.4)

    cleaned['pulse_pressure'] = round(pulse_press, 1)
    cleaned['mean_arterial_bp'] = round(mean_art_bp, 1)
    cleaned['sleep_deficit'] = round(sleep_def, 2)
    cleaned['sleep_to_workload_ratio'] = round(sleep_work_ratio, 2)
    cleaned['resting_hr_stress'] = round(r_hr_stress, 3)
    cleaned['cardiovascular_strain'] = round(cv_strain, 3)

    # 3. Sanitize identifier string against injection / XSS
    raw_pid = data.get('personnel_id', 'PERS-SIM')
    cleaned_pid = re.sub(r'[^a-zA-Z0-9_\-\.]', '', str(raw_pid).strip())[:64]
    cleaned['personnel_id'] = cleaned_pid if cleaned_pid else 'PERS-UNKNOWN'

    return cleaned


class WelfareDataProcessor:
    """Parses raw Excel dataset and performs feature engineering coupling wellness and organizational signals."""

    @staticmethod
    def parse_raw_dataset(excel_path="Wellness Dataset - Dr.Fatma M. Talaat.xlsx"):
        if not os.path.exists(excel_path):
            raise FileNotFoundError(f"Dataset file not found at: {excel_path}")

        df_raw = pd.read_excel(excel_path)
        records = []

        for idx, row in df_raw.iterrows():
            # 1. Biometrics & Sleep
            sleep_hrs = float(row['Duration of Sleep (hours)'])
            physical_act = float(row['Level of Physical Activity (minutes per day)'])
            stress_lvl = float(row['Level of Stress (scale: 1–10)'])
            workload_lvl = float(row['Level of Workload (scale: 1–10)'])
            heart_rate = float(row['Heart Rate (bpm)'])

            # 2. Blood pressure
            bp_str = str(row['Systolic and Diastolic Blood Pressure']).strip()
            bp_match = re.search(r'(\d+)\s*/\s*(\d+)', bp_str)
            if bp_match:
                systolic = float(bp_match.group(1))
                diastolic = float(bp_match.group(2))
            else:
                systolic = 120.0
                diastolic = 80.0

            # 3. Nutrition intake & diet quality
            nutr_str = str(row['Nutrition Intake (calories, breakdown of nutrients, etc.)']).lower()
            cal_match = re.search(r'(\d+)', nutr_str)
            calories = float(cal_match.group(1)) if cal_match else 2200.0
            
            if 'balanced' in nutr_str or 'healthy' in nutr_str:
                diet_quality = 1.0
            elif 'high in carbs' in nutr_str or 'high in fat' in nutr_str:
                diet_quality = 0.5
            elif 'low in protein' in nutr_str or 'low in calories' in nutr_str:
                diet_quality = 0.3
            else: # unhealthy
                diet_quality = 0.1

            # 4. Additional indicators: water & steps
            add_str = str(row['Additional health indicators (e.g., water levels, steps)']).lower()
            water_match = re.search(r'([\d\.]+)\s*liter', add_str)
            water_liters = float(water_match.group(1)) if water_match else 2.0
            steps_match = re.search(r'([\d,]+)\s*step', add_str)
            steps = float(steps_match.group(1).replace(',', '')) if steps_match else 8000.0

            # 5. Social interaction score (1 to 5)
            soc_str = str(row['Quality or frequency of social interactions']).lower()
            if 'very good' in soc_str or 'daily' in soc_str:
                social_score = 5.0
            elif 'good' in soc_str or 'frequent' in soc_str:
                social_score = 4.0
            elif 'moderate' in soc_str or 'occasional' in soc_str:
                social_score = 3.0
            elif 'low' in soc_str or 'infrequent' in soc_str:
                social_score = 2.0
            else:
                social_score = 1.0

            # 6. Mental health activity engagement (0 to 3)
            mh_str = str(row.get('Activities for Mental Health (such as therapy sessions or meditation)', '')).lower()
            if 'meditation' in mh_str:
                mental_health_act = 3.0
            elif 'yoga' in mh_str:
                mental_health_act = 2.0
            elif 'therapy' in mh_str:
                mental_health_act = 2.0
            else:
                mental_health_act = 0.0

            # 7. Environmental stressors (0 to 2)
            env_str = str(row['Environmental Aspects (such as weather and air quality)']).lower()
            if 'sunny' in env_str or 'good' in env_str:
                env_stress = 0.0
            elif 'cloudy' in env_str or 'moderate' in env_str:
                env_stress = 1.0
            else:
                env_stress = 2.0

            # 8. Lifestyle risks (0 to 4)
            life_str = str(row['Lifestyle Decisions (such as drinking and smoking)']).lower()
            if 'no alcohol, no smoking' in life_str:
                lifestyle_risk = 0.0
            elif 'occasional alcohol, no smoking' in life_str:
                lifestyle_risk = 1.0
            elif 'daily alcohol, no smoking' in life_str:
                lifestyle_risk = 2.0
            elif 'occasional smoking' in life_str:
                lifestyle_risk = 3.0
            else: # heavy smoking
                lifestyle_risk = 4.0

            # 9. BMI Category code
            bmi_str = str(row['BMI Category']).lower()
            if 'normal' in bmi_str:
                bmi_code = 0
            elif 'overweight' in bmi_str:
                bmi_code = 1
            elif 'underweight' in bmi_str:
                bmi_code = 2
            else: # obese
                bmi_code = 3

            # 10. Mood Output code
            mood_str = str(row['Mood Output']).lower()
            if 'happy' in mood_str:
                mood_code = 2
            elif 'neutral' in mood_str:
                mood_code = 1
            else: # sad
                mood_code = 0

            # 11. Organizational Signals (Domain Coupling based on Occupational Welfare)
            np.random.seed(idx + 101)
            duty_hours = float(np.clip(workload_lvl * 1.2 + np.random.normal(1.5, 0.4), 6.0, 16.0))
            weekly_duty = float(duty_hours * 5.4 + np.random.normal(2.0, 1.0))
            deployment_days = int(np.clip(stress_lvl * 18 + workload_lvl * 10 + np.random.normal(15, 8), 5, 240))
            consecutive_shifts = int(np.clip(workload_lvl * 1.1 + (10 - sleep_hrs) * 0.8 + np.random.normal(1.0, 0.6), 1, 28))
            leave_deficit = int(np.clip(deployment_days / 10 + stress_lvl * 1.2 + np.random.normal(2, 1.2), 0, 45))
            workload_surge_pct = float(np.clip((workload_lvl - 5) * 12 + np.random.normal(5, 6), -25, 75))

            # 12. Composite physiological & fatigue terms
            pulse_pressure = float(systolic - diastolic)
            map_bp = float(diastolic + (pulse_pressure / 3.0))
            sleep_deficit = float(max(0.0, 8.0 - sleep_hrs))
            sleep_to_workload = float(sleep_hrs / max(duty_hours, 1.0))

            # 13. Physiological stress indicators
            # Resting HR stress: deviation from healthy baseline (65 bpm)
            resting_hr_stress = float(max(0.0, (heart_rate - 65.0) / 25.0))
            # Cardiovascular strain: elevated MAP (>93) and wide pulse pressure (>40)
            cv_strain = float(
                max(0.0, (map_bp - 93.0) / 20.0) * 0.6 +
                max(0.0, (pulse_pressure - 40.0) / 20.0) * 0.4
            )

            # Multi-Tier Ground Truth Risk Tier (Occupational Strain Index)
            # Rebalanced: reduced self-report stress, elevated physiological signals
            # Low: 0, Moderate: 1, Elevated: 2, High: 3
            risk_score_raw = (
                (duty_hours / 14.0) * 16.0 +
                (deployment_days / 180.0) * 14.0 +
                (consecutive_shifts / 14.0) * 10.0 +
                (leave_deficit / 30.0) * 7.0 +
                (stress_lvl / 10.0) * 10.0 +
                ((2 - mood_code) / 2.0) * 6.0 +
                (sleep_deficit / 3.0) * 14.0 +
                resting_hr_stress * 12.0 +
                min(cv_strain, 1.0) * 8.0 +
                (lifestyle_risk / 4.0) * 5.0 +
                ((5.0 - social_score) / 4.0) * 4.0 -
                (mental_health_act / 3.0) * 6.0
            )

            if risk_score_raw < 40.0:
                risk_tier = 0
            elif risk_score_raw < 60.0:
                risk_tier = 1
            elif risk_score_raw < 85.0:
                risk_tier = 2
            else:
                risk_tier = 3

            records.append({
                'personnel_id': f"PERS-{idx+1:04d}",
                'sleep_hours': round(sleep_hrs, 2),
                'physical_activity_min': int(physical_act),
                'stress_level': int(stress_lvl),
                'workload_level': int(workload_lvl),
                'heart_rate': int(heart_rate),
                'systolic_bp': round(systolic, 1),
                'diastolic_bp': round(diastolic, 1),
                'pulse_pressure': round(pulse_pressure, 1),
                'mean_arterial_bp': round(map_bp, 1),
                'nutrition_calories': int(calories),
                'diet_quality': round(diet_quality, 2),
                'water_liters': round(water_liters, 2),
                'daily_steps': int(steps),
                'social_score': round(social_score, 1),
                'mental_health_act': round(mental_health_act, 1),
                'env_stress': round(env_stress, 1),
                'lifestyle_risk': round(lifestyle_risk, 1),
                'bmi_code': int(bmi_code),
                'mood_code': int(mood_code),
                'duty_hours_daily': round(duty_hours, 1),
                'avg_weekly_duty_hours': round(weekly_duty, 1),
                'deployment_days': int(deployment_days),
                'consecutive_shifts': int(consecutive_shifts),
                'leave_deficit_days': int(leave_deficit),
                'workload_surge_pct': round(workload_surge_pct, 1),
                'sleep_deficit': round(sleep_deficit, 2),
                'sleep_to_workload_ratio': round(sleep_to_workload, 2),
                'resting_hr_stress': round(resting_hr_stress, 3),
                'cardiovascular_strain': round(cv_strain, 3),
                'risk_tier': int(risk_tier)
            })

        return pd.DataFrame(records)


class Level1RuleEngine:
    """Level 1: Deterministic Rule-Based Risk Indicators (Hardened Baseline Engine)."""

    SEVERITY_WEIGHTS = {
        "CRITICAL": 25,
        "HIGH": 18,
        "MODERATE": 12,
        "MEDIUM": 10,
        "LOW": 5,
    }

    FACTOR_MAX_CAP = {
        "Workload": 35,
        "Deployment": 30,
        "Sleep trend": 30,
        "Self-report": 25,
        "Leave deviation": 25,
        "Physiological": 30,
        "Compound Risk": 40,
    }
    DEFAULT_FACTOR_CAP = 30

    RULES = [
        {
            "id": "RULE_DUTY_HOURS",
            "name": "High Duty Hours Threshold",
            "severity": "HIGH",
            "condition": lambda p: p.get('duty_hours_daily', 0) > 12.0 or p.get('avg_weekly_duty_hours', 0) > 70.0,
            "description": "Daily duty exceeds 12 hours or average weekly duty exceeds 70 hours.",
            "factor": "Workload"
        },
        {
            "id": "RULE_PROLONGED_DEPLOYMENT",
            "name": "Prolonged Field Deployment",
            "severity": "HIGH",
            "condition": lambda p: p.get('deployment_days', 0) > 90,
            "description": "Continuous field deployment duration exceeds 90 days without base rotation.",
            "factor": "Deployment"
        },
        {
            "id": "RULE_WORKLOAD_SURGE",
            "name": "Sharp Workload Surge",
            "severity": "MODERATE",
            "condition": lambda p: p.get('workload_surge_pct', 0) > 30.0 or p.get('workload_level', 0) >= 8,
            "description": "Recent workload tempo increased by over 30% above 30-day baseline.",
            "factor": "Workload"
        },
        {
            "id": "RULE_SLEEP_DETERIORATION",
            "name": "Severe Sleep Deterioration",
            "severity": "HIGH",
            "condition": lambda p: p.get('sleep_hours', 8.0) < 5.5 or p.get('sleep_deficit', 0) >= 2.5,
            "description": "Sleep duration below 5.5 hours/night with cumulative sleep debt >= 2.5 hours.",
            "factor": "Sleep trend"
        },
        {
            "id": "RULE_DECLINING_WELLNESS",
            "name": "Declining Self-Reported Wellness",
            "severity": "HIGH",
            "condition": lambda p: p.get('stress_level', 0) >= 8 or (p.get('mood_code', 2) == 0 and p.get('social_score', 3) <= 2.0),
            "description": "Self-reported stress level >= 8/10 or persistent low mood with social isolation.",
            "factor": "Self-report"
        },
        {
            "id": "RULE_LEAVE_DEFICIT",
            "name": "Elevated Leave Deficit",
            "severity": "MODERATE",
            "condition": lambda p: p.get('leave_deficit_days', 0) >= 15 or p.get('consecutive_shifts', 0) >= 14,
            "description": "Over 15 days of overdue leave or >= 14 consecutive duty shifts without rest.",
            "factor": "Leave deviation"
        },
        {
            "id": "RULE_VITAL_SIGNS_ALERT",
            "name": "Elevated Physiological Vital Signs",
            "severity": "MODERATE",
            "condition": lambda p: p.get('heart_rate', 72) > 85 or p.get('systolic_bp', 120) > 140 or p.get('mean_arterial_bp', 93) > 105,
            "description": "Resting heart rate exceeds 85 bpm, systolic BP exceeds 140 mmHg, or mean arterial pressure exceeds 105 mmHg — indicates potential autonomic or cardiovascular strain.",
            "factor": "Physiological"
        },
        {
            "id": "RULE_MULTI_RISK_CO_OCCURRENCE",
            "name": "Multi-Risk Co-Occurrence Multiplier",
            "severity": "CRITICAL",
            "condition": lambda p: (
                (p.get('duty_hours_daily', 0) > 11.0 or p.get('workload_level', 0) >= 8) and
                (p.get('sleep_hours', 8.0) < 6.0) and
                (p.get('deployment_days', 0) > 60 or p.get('consecutive_shifts', 0) >= 10)
            ),
            "description": "Simultaneous co-occurrence of high duty hours, acute sleep deficit, and extended field deployment.",
            "factor": "Compound Risk"
        }
    ]

    @classmethod
    def evaluate(cls, personnel_data: dict) -> dict:
        """Evaluates Level 1 deterministic rules with strict severity weighting and error tracking."""
        sanitized = sanitize_feature_dict(personnel_data) if isinstance(personnel_data, dict) else {}
        triggered = []
        passed = []
        failed = []
        factor_scores = {}
        factor_hits = {}

        for rule in cls.RULES:
            rule_id = rule.get("id", "UNKNOWN_RULE")
            severity = str(rule.get("severity", "MEDIUM")).upper()
            factor = rule.get("factor", "General")

            if severity not in cls.SEVERITY_WEIGHTS:
                logger.warning("Unrecognized severity '%s' for rule '%s'; defaulting to LOW weight", severity, rule_id)
                base_weight = cls.SEVERITY_WEIGHTS["LOW"]
            else:
                base_weight = cls.SEVERITY_WEIGHTS[severity]

            try:
                condition_fn = rule.get("condition")
                if not callable(condition_fn):
                    raise TypeError(f"Condition for rule '{rule_id}' is not callable")

                is_triggered = bool(condition_fn(sanitized))

                rule_summary = {
                    "id": rule_id,
                    "name": rule.get("name", rule_id),
                    "severity": severity,
                    "description": rule.get("description", ""),
                    "factor": factor,
                    "weight": base_weight
                }

                if is_triggered:
                    triggered.append(rule_summary)
                    factor_hits[factor] = factor_hits.get(factor, 0) + 1
                    factor_scores[factor] = factor_scores.get(factor, 0) + base_weight
                else:
                    passed.append(rule_id)

            except Exception as exc:
                logger.exception("Level 1 Rule evaluation failed for rule ID '%s'", rule_id)
                failed.append({
                    "id": rule_id,
                    "name": rule.get("name", rule_id),
                    "severity": severity,
                    "factor": factor,
                    "status": "FAILED",
                    "error_code": "ERR_RULE_EVALUATION_FAULT"
                })

        # Apply factor capping to prevent collinear runaway from single factor
        rule_score = 0
        for factor, raw_score in factor_scores.items():
            cap = cls.FACTOR_MAX_CAP.get(factor, cls.DEFAULT_FACTOR_CAP)
            rule_score += min(raw_score, cap)

        # Fail-closed security rule: If critical or high rules crashed, reject safe baseline calculation
        if any(f["severity"] in ("CRITICAL", "HIGH") for f in failed):
            evaluation_integrity = "DEGRADED"
            baseline_tier = "EVALUATION_FAILED"
            status_indicator = "DATA_CORRUPT_ACTION_REQUIRED"
        elif failed:
            evaluation_integrity = "WARNING"
            status_indicator = "PARTIAL_EVALUATION"
            if rule_score == 0:
                baseline_tier = "LOW"
            elif rule_score < 30:
                baseline_tier = "MODERATE"
            elif rule_score < 50:
                baseline_tier = "ELEVATED"
            else:
                baseline_tier = "HIGH"
        else:
            evaluation_integrity = "HEALTHY"
            status_indicator = "COMPLETE"
            if rule_score == 0:
                baseline_tier = "LOW"
            elif rule_score < 30:
                baseline_tier = "MODERATE"
            elif rule_score < 50:
                baseline_tier = "ELEVATED"
            else:
                baseline_tier = "HIGH"

        capped_factors = {
            factor: min(raw_s, cls.FACTOR_MAX_CAP.get(factor, cls.DEFAULT_FACTOR_CAP))
            for factor, raw_s in factor_scores.items()
        }

        return {
            "baseline_tier": baseline_tier,
            "status_indicator": status_indicator,
            "rule_score": round(rule_score, 1) if baseline_tier != "EVALUATION_FAILED" else None,
            "raw_unfiltered_score": round(sum(factor_scores.values()), 1),
            "total_rules_evaluated": len(cls.RULES),
            "total_rules_triggered": len(triggered),
            "total_rules_passed": len(passed),
            "total_rules_failed": len(failed),
            "triggered_rules": triggered,
            "failed_rules": failed,
            "factor_hits": factor_hits,
            "factor_scores": factor_scores,
            "capped_factor_scores": capped_factors,
            "evaluation_integrity": evaluation_integrity
        }


class Level2MLRiskModel:
    """Level 2: Tabular ML Risk Model (XGBoost / LightGBM with SHAP explainability)."""

    FEATURE_FACTOR_MAP = {
        # Workload
        'duty_hours_daily': 'Workload',
        'avg_weekly_duty_hours': 'Workload',
        'workload_level': 'Workload',
        'workload_surge_pct': 'Workload',
        'sleep_to_workload_ratio': 'Workload',
        # Deployment
        'deployment_days': 'Deployment',
        'consecutive_shifts': 'Deployment',
        # Sleep trend
        'sleep_hours': 'Sleep trend',
        'sleep_deficit': 'Sleep trend',
        # Leave deviation
        'leave_deficit_days': 'Leave deviation',
        # Self-report
        'stress_level': 'Self-report',
        'mood_code': 'Self-report',
        'social_score': 'Self-report',
        'mental_health_act': 'Self-report',
        'env_stress': 'Self-report',
        'lifestyle_risk': 'Self-report',
        # Physiological
        'heart_rate': 'Physiological',
        'systolic_bp': 'Physiological',
        'diastolic_bp': 'Physiological',
        'pulse_pressure': 'Physiological',
        'mean_arterial_bp': 'Physiological',
        'resting_hr_stress': 'Physiological',
        'cardiovascular_strain': 'Physiological',
        'nutrition_calories': 'Physiological',
        'diet_quality': 'Physiological',
        'water_liters': 'Physiological',
        'daily_steps': 'Physiological',
        'physical_activity_min': 'Physiological',
        'bmi_code': 'Physiological'
    }

    def __init__(self, model_version=MODEL_VERSION):
        self.model_version = model_version
        self.model = None
        self.explainer = None
        self.scaler = None
        self.metrics = {}
        self.feature_importances_ = {}
        self.is_fitted = False

    def train_and_evaluate(self, df: pd.DataFrame, save_dir=DEFAULT_MODEL_DIR):
        os.makedirs(save_dir, exist_ok=True)
        X = df[FEATURE_COLS]
        y = df['risk_tier']

        # Train / Val / Test (70 / 15 / 15) using GroupShuffleSplit on personnel_id
        gss = GroupShuffleSplit(n_splits=1, test_size=0.15, random_state=42)
        train_val_idx, test_idx = next(gss.split(X, y, groups=df['personnel_id']))
        X_train_val, y_train_val = X.iloc[train_val_idx], y.iloc[train_val_idx]
        X_test, y_test = X.iloc[test_idx], y.iloc[test_idx]
        groups_train_val = df['personnel_id'].iloc[train_val_idx]

        gss_val = GroupShuffleSplit(n_splits=1, test_size=0.1765, random_state=42)
        train_idx, val_idx = next(gss_val.split(X_train_val, y_train_val, groups=groups_train_val))
        X_train, y_train = X_train_val.iloc[train_idx], y_train_val.iloc[train_idx]
        X_val, y_val = X_train_val.iloc[val_idx], y_train_val.iloc[val_idx]

        print(f"[Level 2 ML] Split sizes: Train={X_train.shape[0]}, Val={X_val.shape[0]}, Test={X_test.shape[0]}")

        # Instantiate XGBoost or Gradient Boosting
        if XGB_AVAILABLE:
            clf = xgb.XGBClassifier(
                n_estimators=120,
                max_depth=4,
                learning_rate=0.07,
                subsample=0.85,
                colsample_bytree=0.85,
                random_state=42,
                eval_metric='mlogloss'
            )
            clf.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
            self.model_type = "XGBoost Classifier"
        else:
            clf = HistGradientBoostingClassifier(
                max_iter=120,
                max_depth=5,
                learning_rate=0.07,
                random_state=42
            )
            clf.fit(X_train, y_train)
            self.model_type = "HistGradientBoosting Classifier"

        self.model = clf
        self.is_fitted = True

        # Initialize SHAP TreeExplainer if available
        if SHAP_AVAILABLE:
            try:
                self.explainer = shap.TreeExplainer(self.model)
                print("[Level 2 ML] SHAP TreeExplainer initialized successfully.")
            except Exception as exc:
                logger.warning(f"Could not initialize SHAP TreeExplainer: {exc}")
                self.explainer = None

        # Test set predictions
        y_test_pred = clf.predict(X_test)
        y_test_prob = clf.predict_proba(X_test)

        # Train set predictions
        y_train_pred = clf.predict(X_train)
        y_train_prob = clf.predict_proba(X_train)

        all_class_labels = list(range(len(RISK_TIERS)))

        # Test Metrics computation
        test_f1_macro = float(f1_score(y_test, y_test_pred, average='macro'))
        test_f1_weighted = float(f1_score(y_test, y_test_pred, average='weighted'))
        test_prec_macro = float(precision_score(y_test, y_test_pred, average='macro'))
        test_rec_macro = float(recall_score(y_test, y_test_pred, average='macro'))
        
        try:
            y_test_dummies = pd.get_dummies(y_test).values
            test_roc_auc_val = float(roc_auc_score(y_test_dummies, y_test_prob, multi_class='ovr', average='macro'))
        except Exception:
            test_roc_auc_val = float('nan')

        test_cm = confusion_matrix(y_test, y_test_pred, labels=all_class_labels).tolist()
        test_report = classification_report(y_test, y_test_pred, labels=all_class_labels, target_names=RISK_TIERS, output_dict=True, zero_division=0)

        # Train Metrics computation
        train_f1_macro = float(f1_score(y_train, y_train_pred, average='macro'))
        train_f1_weighted = float(f1_score(y_train, y_train_pred, average='weighted'))
        train_prec_macro = float(precision_score(y_train, y_train_pred, average='macro'))
        train_rec_macro = float(recall_score(y_train, y_train_pred, average='macro'))
        
        try:
            y_train_dummies = pd.get_dummies(y_train).values
            train_roc_auc_val = float(roc_auc_score(y_train_dummies, y_train_prob, multi_class='ovr', average='macro'))
        except Exception:
            train_roc_auc_val = float('nan')

        train_cm = confusion_matrix(y_train, y_train_pred, labels=all_class_labels).tolist()
        train_report = classification_report(y_train, y_train_pred, labels=all_class_labels, target_names=RISK_TIERS, output_dict=True, zero_division=0)

        # Feature importances
        if hasattr(clf, 'feature_importances_'):
            importances = clf.feature_importances_
        else:
            rf_aux = RandomForestClassifier(n_estimators=50, random_state=42).fit(X_train, y_train)
            importances = rf_aux.feature_importances_

        feat_imp_dict = {col: float(imp) for col, imp in zip(FEATURE_COLS, importances)}
        self.feature_importances_ = dict(sorted(feat_imp_dict.items(), key=lambda item: item[1], reverse=True))

        self.metrics = {
            "model_version": self.model_version,
            "model_type": self.model_type,
            "trained_at": datetime.now().isoformat(),
            "train_samples": int(X_train.shape[0]),
            "val_samples": int(X_val.shape[0]),
            "test_samples": int(X_test.shape[0]),
            "test_metrics": {
                "macro_f1": round(test_f1_macro, 4),
                "weighted_f1": round(test_f1_weighted, 4),
                "macro_precision": round(test_prec_macro, 4),
                "macro_recall": round(test_rec_macro, 4),
                "roc_auc_ovr": round(test_roc_auc_val, 4),
                "confusion_matrix": test_cm,
                "classification_report": test_report
            },
            "train_metrics": {
                "macro_f1": round(train_f1_macro, 4),
                "weighted_f1": round(train_f1_weighted, 4),
                "macro_precision": round(train_prec_macro, 4),
                "macro_recall": round(train_rec_macro, 4),
                "roc_auc_ovr": round(train_roc_auc_val, 4),
                "confusion_matrix": train_cm,
                "classification_report": train_report
            },
            "top_features": list(self.feature_importances_.items())[:12]
        }

        # Save artifacts securely to local target dir
        model_path = os.path.join(save_dir, "welfare_ml_model.joblib")
        meta_path = os.path.join(save_dir, "model_metadata.json")
        joblib.dump(self.model, model_path)
        with open(meta_path, "w") as f:
            json.dump(self.metrics, f, indent=2)

        print(f"[Level 2 ML] Model trained & saved to {model_path}. Macro F1 (Test): {test_f1_macro:.4f}")
        return self.metrics

    def predict_risk(self, feature_dict: dict) -> dict:
        """Generates probability distribution, predicted tier, confidence, and SHAP contributing factors."""
        if not self.is_fitted:
            raise RuntimeError("Model must be trained or loaded before predicting.")

        # Sanitize and bounds-check all incoming features
        sanitized = sanitize_feature_dict(feature_dict)

        # Build feature vector
        feat_vector = []
        for col in FEATURE_COLS:
            val = sanitized.get(col, 0.0)
            feat_vector.append(float(val))

        X_input = pd.DataFrame([feat_vector], columns=FEATURE_COLS)
        probs = self.model.predict_proba(X_input)[0]
        pred_class_idx = int(np.argmax(probs))
        pred_tier = RISK_TIERS[pred_class_idx]
        confidence_pct = round(float(probs[pred_class_idx]) * 100, 1)

        # Factor contributions estimation with real SHAP or robust decomposition
        factor_contributions = self._compute_factor_contributions(sanitized, probs, X_input=X_input, pred_class_idx=pred_class_idx)

        return {
            "predicted_tier": pred_tier,
            "risk_tier_index": pred_class_idx,
            "confidence_pct": confidence_pct,
            "tier_probabilities": {
                RISK_TIERS[i]: round(float(probs[i]), 4) for i in range(len(RISK_TIERS))
            },
            "contributing_factors": factor_contributions,
            "model_version": self.model_version
        }

    def _compute_factor_contributions(self, p: dict, probs: np.ndarray, X_input: pd.DataFrame = None, pred_class_idx: int = 1) -> dict:
        """Decomposes risk drivers into 6 core factors using real SHAP when available, with deterministic fallback."""
        attribution_method = "Rule_Factor_Decomposition_Proxy"
        shap_factor_scores = {
            "Workload": 0.0,
            "Deployment": 0.0,
            "Sleep trend": 0.0,
            "Leave deviation": 0.0,
            "Self-report": 0.0,
            "Physiological": 0.0
        }

        use_shap = False
        if self.explainer is not None and X_input is not None:
            try:
                shap_vals = self.explainer.shap_values(X_input)
                if isinstance(shap_vals, list):
                    # Multi-class output (list of arrays per class)
                    class_shap = shap_vals[pred_class_idx][0]
                elif hasattr(shap_vals, 'shape') and len(shap_vals.shape) == 3:
                    class_shap = shap_vals[0, :, pred_class_idx]
                elif hasattr(shap_vals, 'values'):
                    # shap.Explanation object
                    exp_vals = shap_vals.values
                    class_shap = exp_vals[0, :, pred_class_idx] if len(exp_vals.shape) == 3 else exp_vals[0]
                else:
                    class_shap = shap_vals[0]

                for feat_name, s_val in zip(FEATURE_COLS, class_shap):
                    factor_grp = self.FEATURE_FACTOR_MAP.get(feat_name, 'Physiological')
                    shap_factor_scores[factor_grp] += max(0.0, float(s_val))

                if sum(shap_factor_scores.values()) > 1e-5:
                    attribution_method = "SHAP_TreeExplainer"
                    use_shap = True
            except Exception as exc:
                logger.debug(f"SHAP explainer calculation fallback: {exc}")
                use_shap = False

        if not use_shap:
            # Fallback deterministic factor calculation
            workload_score = (
                (p.get('duty_hours_daily', 8.0) / 14.0) * 0.4 +
                (p.get('workload_level', 5.0) / 10.0) * 0.3 +
                (max(0, p.get('workload_surge_pct', 0.0)) / 50.0) * 0.3
            )
            deployment_score = (
                (min(p.get('deployment_days', 0), 180) / 180.0) * 0.6 +
                (min(p.get('consecutive_shifts', 0), 21) / 21.0) * 0.4
            )
            sleep_hrs = p.get('sleep_hours', 7.0)
            sleep_score = max(0.0, (8.0 - sleep_hrs) / 3.0)
            leave_score = (
                (min(p.get('leave_deficit_days', 0), 30) / 30.0) * 0.6 +
                (1.0 if p.get('consecutive_shifts', 0) > 12 else 0.2) * 0.4
            )
            stress_lvl = p.get('stress_level', 5.0)
            mood_code = p.get('mood_code', 1)
            soc_score = p.get('social_score', 3.0)
            self_report_score = (
                (stress_lvl / 10.0) * 0.35 +
                ((2 - mood_code) / 2.0) * 0.35 +
                ((5.0 - soc_score) / 4.0) * 0.30
            )
            hr = p.get('heart_rate', 72)
            map_bp = p.get('mean_arterial_bp', 93.0)
            pp = p.get('pulse_pressure', 40.0)
            phys_act = p.get('physical_activity_min', 30)
            physiological_score = (
                max(0.0, (hr - 65.0) / 25.0) * 0.45 +
                max(0.0, (map_bp - 93.0) / 20.0 * 0.6 + (pp - 40.0) / 20.0 * 0.4) * 0.30 +
                max(0.0, (30.0 - min(phys_act, 30)) / 30.0) * 0.25
            )
            shap_factor_scores = {
                "Workload": workload_score,
                "Deployment": deployment_score,
                "Sleep trend": sleep_score,
                "Leave deviation": leave_score,
                "Self-report": self_report_score,
                "Physiological": physiological_score
            }

        def score_to_label(s):
            if s >= 0.65:
                return "High"
            elif s >= 0.35:
                return "Moderate"
            else:
                return "Low"

        # Percentage distribution across 6 factors
        raw_sum = sum(shap_factor_scores.values()) + 1e-6
        pct_breakdown = {
            f: round((score / raw_sum) * 100, 1)
            for f, score in shap_factor_scores.items()
        }

        return {
            "attribution_method": attribution_method,
            "Workload": score_to_label(shap_factor_scores["Workload"]),
            "Deployment": score_to_label(shap_factor_scores["Deployment"]),
            "Sleep trend": score_to_label(shap_factor_scores["Sleep trend"]),
            "Leave deviation": score_to_label(shap_factor_scores["Leave deviation"]),
            "Self-report": score_to_label(shap_factor_scores["Self-report"]),
            "Physiological": score_to_label(shap_factor_scores["Physiological"]),
            "factor_scores": {
                f: round(float(s), 3) for f, s in shap_factor_scores.items()
            },
            "percentage_impact": pct_breakdown
        }


class Level3TemporalEngine:
    """Level 3: Temporal Risk Analysis (7-day, 30-day, 90-day trajectory evaluation)."""

    @staticmethod
    def generate_timeline(personnel_data: dict, days=30) -> list:
        """Simulates or extracts historical temporal trajectory for personnel over N days with isolated RNG."""
        sanitized = sanitize_feature_dict(personnel_data) if isinstance(personnel_data, dict) else {}
        current_risk_idx = sanitized.get('risk_tier', 1)
        stress_lvl = sanitized.get('stress_level', 5.0)
        duty_hrs = sanitized.get('duty_hours_daily', 8.0)
        sleep_hrs = sanitized.get('sleep_hours', 7.0)
        hr_base = sanitized.get('heart_rate', 72.0)
        personnel_id = str(personnel_data.get('personnel_id', 'PERS-SIM'))

        # Thread-safe deterministic RNG instance seeded specifically per personnel & day window
        hash_seed = int(hashlib.sha256(f"{personnel_id}:{days}".encode()).hexdigest()[:8], 16)
        rng = np.random.default_rng(hash_seed)

        # Baseline trend determination
        if current_risk_idx >= 2:
            trend_type = "deteriorating"
        elif current_risk_idx == 1:
            trend_type = "stable"
        else:
            trend_type = "improving"

        timeline = []
        start_date = datetime.now() - timedelta(days=days)

        for d in range(days + 1):
            cur_date = start_date + timedelta(days=d)
            progress = d / float(days)

            if trend_type == "deteriorating":
                t_stress = np.clip(3.0 + progress * (stress_lvl - 3.0) + rng.normal(0, 0.4), 1.0, 10.0)
                t_duty = np.clip(7.5 + progress * (duty_hrs - 7.5) + rng.normal(0, 0.3), 6.0, 16.0)
                t_sleep = np.clip(7.8 - progress * (7.8 - sleep_hrs) + rng.normal(0, 0.25), 4.5, 8.5)
                t_hr = np.clip(68.0 + progress * (hr_base - 68.0) + rng.normal(0, 1.5), 58.0, 95.0)
            elif trend_type == "improving":
                t_stress = np.clip(6.0 - progress * (6.0 - stress_lvl) + rng.normal(0, 0.4), 1.0, 10.0)
                t_duty = np.clip(11.0 - progress * (11.0 - duty_hrs) + rng.normal(0, 0.3), 6.0, 16.0)
                t_sleep = np.clip(6.0 + progress * (sleep_hrs - 6.0) + rng.normal(0, 0.25), 4.5, 8.5)
                t_hr = np.clip(80.0 - progress * (80.0 - hr_base) + rng.normal(0, 1.5), 58.0, 95.0)
            else: # Stable
                t_stress = np.clip(stress_lvl + rng.normal(0, 0.5), 1.0, 10.0)
                t_duty = np.clip(duty_hrs + rng.normal(0, 0.4), 6.0, 16.0)
                t_sleep = np.clip(sleep_hrs + rng.normal(0, 0.3), 4.5, 8.5)
                t_hr = np.clip(hr_base + rng.normal(0, 1.5), 58.0, 95.0)

            # Instantaneous day risk (rebalanced: stress reduced, HR added)
            t_hr_stress = max(0.0, (t_hr - 65.0) / 25.0)
            day_score = (
                (t_duty / 14.0) * 25.0 +
                (t_stress / 10.0) * 25.0 +
                ((8.0 - t_sleep) / 3.0) * 30.0 +
                t_hr_stress * 20.0
            )
            if day_score < 35:
                day_tier = "LOW"
            elif day_score < 55:
                day_tier = "MODERATE"
            elif day_score < 75:
                day_tier = "ELEVATED"
            else:
                day_tier = "HIGH"

            timeline.append({
                "day_index": d,
                "date": cur_date.strftime("%b %d"),
                "duty_hours": round(float(t_duty), 1),
                "sleep_hours": round(float(t_sleep), 1),
                "stress_level": round(float(t_stress), 1),
                "heart_rate": round(float(t_hr), 1),
                "risk_tier": day_tier,
                "risk_score": round(float(day_score), 1)
            })

        return timeline

    @staticmethod
    def evaluate_trajectory(timeline: list) -> dict:
        """Evaluates trend slope, sustained deterioration vs acute anomaly, and follow-up priority."""
        if not timeline:
            return {
                "trend_label": "→ Stable",
                "trajectory_slope": "stable",
                "sustained_deterioration": False,
                "follow_up_priority": "STANDARD",
                "delta_7d_sleep": 0.0,
                "delta_7d_duty": 0.0
            }

        scores = [entry["risk_score"] for entry in timeline]
        n = len(scores)

        # Engine-level invariant guard: reject degenerate trend comparisons when n < 7
        if n < 7:
            avg_s = float(np.mean(scores)) if scores else 0.0
            return {
                "trend_label": "→ Insufficient History",
                "trajectory_slope": "insufficient_data",
                "sustained_deterioration": False,
                "is_transient_anomaly": False,
                "follow_up_priority": "BASELINE_COLLECTION",
                "recent_7d_risk_avg": round(avg_s, 1),
                "baseline_30d_risk_avg": round(avg_s, 1),
                "delta_7d_sleep": 0.0,
                "delta_7d_duty": 0.0,
                "high_risk_days_last_7": sum(1 for e in timeline if e.get("risk_tier") in ["ELEVATED", "HIGH"]),
                "note": f"Timeline has {n} point(s) (<7 required for slope differentiation)."
            }

        # 7-day vs 30-day slope
        recent_7d_avg = np.mean(scores[-7:])
        baseline_30d_avg = np.mean(scores)
        slope_diff = recent_7d_avg - baseline_30d_avg

        # Recent 7d deltas
        recent_sleep = np.mean([e["sleep_hours"] for e in timeline[-7:]])
        prev_sleep = np.mean([e["sleep_hours"] for e in timeline[:7]]) if n >= 14 else recent_sleep
        delta_sleep = round(recent_sleep - prev_sleep, 1)

        recent_duty = np.mean([e["duty_hours"] for e in timeline[-7:]])
        prev_duty = np.mean([e["duty_hours"] for e in timeline[:7]]) if n >= 14 else recent_duty
        delta_duty = round(recent_duty - prev_duty, 1)

        # Check sustained elevation
        recent_tiers = [e["risk_tier"] for e in timeline[-7:]]
        high_risk_days = sum(1 for t in recent_tiers if t in ["ELEVATED", "HIGH"])
        sustained = high_risk_days >= 4

        # Disentangle 1-day anomaly
        is_transient_anomaly = (
            recent_tiers[-1] in ["ELEVATED", "HIGH"] and
            high_risk_days == 1 and
            baseline_30d_avg < 45.0
        )

        if slope_diff > 4.5:
            trend_label = "↑ Increasing"
            trend_type = "deteriorating"
        elif slope_diff < -4.5:
            trend_label = "↓ Improving"
            trend_type = "improving"
        else:
            trend_label = "→ Stable"
            trend_type = "stable"

        current_tier = timeline[-1]["risk_tier"]
        if current_tier == "HIGH" or (current_tier == "ELEVATED" and sustained):
            priority = "URGENT_SUPPORT"
        elif current_tier == "ELEVATED" or (current_tier == "MODERATE" and trend_type == "deteriorating"):
            priority = "PRIORITY_CHECKIN"
        elif current_tier == "MODERATE":
            priority = "ROUTINE_MONITORING"
        else:
            priority = "STANDARD"

        return {
            "trend_label": trend_label,
            "trajectory_slope": trend_type,
            "sustained_deterioration": sustained,
            "is_transient_anomaly": is_transient_anomaly,
            "follow_up_priority": priority,
            "recent_7d_risk_avg": round(float(recent_7d_avg), 1),
            "baseline_30d_risk_avg": round(float(baseline_30d_avg), 1),
            "delta_7d_sleep": delta_sleep,
            "delta_7d_duty": delta_duty,
            "high_risk_days_last_7": high_risk_days
        }


class SupportiveActionEngine:
    """Generates personalized, non-punitive supportive welfare recommendations."""

    @staticmethod
    def get_recommendations(profile: dict) -> list:
        factors = profile.get("contributing_factors", {})
        risk_tier = profile.get("overall_risk", "LOW")

        actions = []

        # 1. Workload Support
        if factors.get("Workload") in ["High", "Moderate"] or profile.get("duty_hours_daily", 0) > 11.0:
            actions.append({
                "category": "Duty & Workload",
                "title": "Shift Re-allocation & Workload Relief",
                "description": "Adjust operational duties to limit single-shift duty to <10 hours; initiate rotational peer duty coverage for 72 hours.",
                "priority": "HIGH" if risk_tier in ["ELEVATED", "HIGH"] else "MEDIUM",
                "icon": "clock"
            })

        # 2. Deployment & Rest Rotation
        if factors.get("Deployment") == "High" or profile.get("deployment_days", 0) > 75:
            actions.append({
                "category": "Deployment & Rest",
                "title": "Recuperation Rotation Scheduling",
                "description": f"Personnel has reached {profile.get('deployment_days', 90)} continuous field deployment days. Schedule 48-72h base camp stand-down or rest cycle.",
                "priority": "HIGH",
                "icon": "shield"
            })

        # 3. Sleep & Fatigue Recovery
        if factors.get("Sleep trend") in ["High", "Moderate"] or profile.get("sleep_hours", 8) < 6.0:
            actions.append({
                "category": "Sleep & Fatigue",
                "title": "Circadian Rest & Sleep Hygiene Support",
                "description": "Ensure a mandatory uninterrupted 8-hour sleep window between operational cycles. Provide quiet rest zone access and voluntary sleep hygiene guidance.",
                "priority": "HIGH" if profile.get("sleep_hours", 8) < 5.5 else "MEDIUM",
                "icon": "moon"
            })

        # 4. Leave Facilitation
        if factors.get("Leave deviation") in ["High", "Moderate"] or profile.get("leave_deficit_days", 0) > 12:
            actions.append({
                "category": "Leave Management",
                "title": "Fast-Track Accumulated Leave Approval",
                "description": f"Facilitate approval for accumulated overdue leave ({profile.get('leave_deficit_days', 15)} days pending) in upcoming roster cycle.",
                "priority": "MEDIUM",
                "icon": "calendar"
            })

        # 5. Wellness & Peer Support
        if factors.get("Self-report") in ["High", "Moderate"] or profile.get("stress_level", 0) >= 7:
            actions.append({
                "category": "Wellness & Counseling",
                "title": "Voluntary Peer Support & Wellbeing Outreach",
                "description": "Offer an informal, confidential check-in with the Unit Welfare Officer or peer counselor. Non-mandatory voluntary wellness counseling.",
                "priority": "HIGH" if risk_tier == "HIGH" else "MEDIUM",
                "icon": "heart"
            })

        if not actions:
            actions.append({
                "category": "Routine Maintenance",
                "title": "Maintain Baseline Operational Rhythm",
                "description": "Personnel demonstrates stable physiological and organizational balance. Continue standard duty rotation and voluntary wellness surveys.",
                "priority": "LOW",
                "icon": "check-circle"
            })

        return actions


class WelfareRiskProfileManager:
    """Unified Welfare Risk Profile Generator combining Level 1, 2, and 3 with enterprise RBAC and fail-closed safety."""

    def __init__(self):
        self.processor = WelfareDataProcessor()
        self.rule_engine = Level1RuleEngine()
        self.ml_model = Level2MLRiskModel()
        self.temporal_engine = Level3TemporalEngine()
        self.action_engine = SupportiveActionEngine()
        self.personnel_df = None
        self.is_initialized = False

    def initialize(self, excel_path="Wellness Dataset - Dr.Fatma M. Talaat.xlsx"):
        """Explicit startup lifecycle initialization to prevent request-time training DoS."""
        print("[Profile Manager] Initializing dataset and ML model...")
        self.personnel_df = self.processor.parse_raw_dataset(excel_path)

        # Load model instead of retraining on startup if it exists
        model_path = os.path.join(DEFAULT_MODEL_DIR, "welfare_ml_model.joblib")
        meta_path = os.path.join(DEFAULT_MODEL_DIR, "model_metadata.json")
        if os.path.exists(model_path) and os.path.exists(meta_path):
            print(f"[Profile Manager] Loading existing model from {model_path}...")
            # Ideally verify model hash/signature here to prevent supply-chain attacks
            self.ml_model.model = joblib.load(model_path)
            with open(meta_path, "r") as f:
                self.ml_model.metrics = json.load(f)
            self.ml_model.is_fitted = True

            # Initialize SHAP explainer
            if SHAP_AVAILABLE:
                try:
                    self.ml_model.explainer = shap.TreeExplainer(self.ml_model.model)
                except Exception:
                    pass
        else:
            self.ml_model.train_and_evaluate(self.personnel_df)

        self.is_initialized = True
        print(f"[Profile Manager] Initialized successfully with {len(self.personnel_df)} personnel profiles.")

    @staticmethod
    def scope_profile_by_role(profile: dict, role: str = "WELFARE_OFFICER") -> dict:
        """Applies Principle of Least Privilege (RBAC) to redact sensitive health/clinical data according to caller role."""
        if not isinstance(profile, dict):
            return profile

        role_norm = str(role).strip().upper()

        # 1. WELFARE_OFFICER / CLINICIAN / ADMIN: Complete clinical & operational welfare profile
        if role_norm in ("WELFARE_OFFICER", "CLINICIAN", "CHIEF_MEDICAL_OFFICER", "ADMIN"):
            scoped = dict(profile)
            scoped["access_scope"] = "FULL_CLINICAL_WELFARE"
            return scoped

        # 2. COMMANDER / SUPERVISOR / ROSTER_MANAGER: Operational risk & fatigue flags ONLY
        # Redacts raw blood pressure, heart rate, hydration, diet, and granular psychological indices
        if role_norm in ("SUPERVISOR", "COMMANDER", "ROSTER_MANAGER", "UNIT_LEAD"):
            scoped = {
                "personnel_id": profile.get("personnel_id"),
                "record_type": profile.get("record_type", "AUTHORITATIVE_CADRE_RECORD"),
                "overall_risk": profile.get("overall_risk"),
                "risk_color": profile.get("risk_color"),
                "trend": profile.get("trend"),
                "trend_type": profile.get("trend_type"),
                "confidence_pct": profile.get("confidence_pct"),
                "model_version": profile.get("model_version"),
                # Operational duty & deployment parameters
                "duty_hours_daily": profile.get("duty_hours_daily"),
                "avg_weekly_duty_hours": profile.get("avg_weekly_duty_hours"),
                "deployment_days": profile.get("deployment_days"),
                "consecutive_shifts": profile.get("consecutive_shifts"),
                "leave_deficit_days": profile.get("leave_deficit_days"),
                "workload_level": profile.get("workload_level"),
                "workload_surge_pct": profile.get("workload_surge_pct"),
                # Categorical wellness status (medical values redacted)
                "sleep_band": "Adequate (>=7h)" if profile.get("sleep_hours", 7) >= 7.0 else "Fatigue Warning (<7h)",
                "stress_band": "Elevated" if profile.get("stress_level", 5) >= 8 else ("Moderate" if profile.get("stress_level", 5) >= 5 else "Low"),
                "level1_rules": {
                    "baseline_tier": profile.get("level1_rules", {}).get("baseline_tier"),
                    "total_rules_triggered": profile.get("level1_rules", {}).get("total_rules_triggered"),
                    "evaluation_integrity": profile.get("level1_rules", {}).get("evaluation_integrity"),
                    "triggered_rules": [
                        {"id": r.get("id"), "name": r.get("name"), "factor": r.get("factor"), "severity": r.get("severity")}
                        for r in profile.get("level1_rules", {}).get("triggered_rules", [])
                    ]
                },
                "contributing_factors": {
                    "attribution_method": profile.get("contributing_factors", {}).get("attribution_method"),
                    "Workload": profile.get("contributing_factors", {}).get("Workload"),
                    "Deployment": profile.get("contributing_factors", {}).get("Deployment"),
                    "Leave deviation": profile.get("contributing_factors", {}).get("Leave deviation"),
                    "percentage_impact": profile.get("contributing_factors", {}).get("percentage_impact", {})
                },
                "recommendations": profile.get("recommendations", []),
                "access_scope": "OPERATIONAL_SUPERVISOR_REDACTED",
                "redacted_fields": ["heart_rate", "systolic_bp", "diastolic_bp", "diet_quality", "water_liters", "mood_code", "social_score", "mental_health_act", "pulse_pressure", "mean_arterial_bp"]
            }
            return scoped

        # 3. INDIVIDUAL_PERSONNEL (Self-View): Actionable wellness guidance and habit support
        scoped = {
            "personnel_id": profile.get("personnel_id"),
            "record_type": profile.get("record_type", "AUTHORITATIVE_CADRE_RECORD"),
            "wellness_tier": profile.get("overall_risk"),
            "trend": profile.get("trend"),
            "sleep_hours": profile.get("sleep_hours"),
            "daily_steps": profile.get("daily_steps"),
            "water_liters": profile.get("water_liters"),
            "recommendations": profile.get("recommendations", []),
            "access_scope": "INDIVIDUAL_SELF_VIEW",
            "redacted_fields": ["level1_rules", "level2_ml", "contributing_factors", "clinical_vitals"]
        }
        return scoped

    def get_personnel_profile(self, personnel_id: str, role: str = "WELFARE_OFFICER"):
        """Looks up a personnel profile strictly by string ID (prohibits numeric index enumeration)."""
        if not self.is_initialized:
            raise RuntimeError("WelfareRiskProfileManager is not initialized. Please call pipeline_manager.initialize() during startup.")

        if not isinstance(personnel_id, str) or not personnel_id.strip():
            logger.warning("Invalid personnel_id format rejected.")
            return None

        pid_clean = personnel_id.strip()
        row_match = self.personnel_df[self.personnel_df['personnel_id'].astype(str) == pid_clean]
        if row_match.empty:
            # Privacy-safe log: write truncated cryptographic hash rather than raw sensitive ID
            anon_hash = hashlib.sha256(pid_clean.encode()).hexdigest()[:8]
            logger.warning("Personnel profile lookup failed for sanitized ID hash '%s'", anon_hash)
            return None

        raw_row = row_match.iloc[0].to_dict()
        full_profile = self.generate_complete_profile(raw_row, is_simulation=False)
        return self.scope_profile_by_role(full_profile, role=role)

    def generate_complete_profile(self, data_dict: dict, is_simulation: bool = False, role: str = "WELFARE_OFFICER") -> dict:
        """Synthesizes Level 1, 2, and 3 intelligence with fail-closed integrity and record provenance."""
        if not self.is_initialized:
            raise RuntimeError("WelfareRiskProfileManager is not initialized. Please call pipeline_manager.initialize() during startup.")

        sanitized = sanitize_feature_dict(data_dict) if isinstance(data_dict, dict) else {}

        # 1. Level 1 Rule Evaluation
        l1_result = self.rule_engine.evaluate(sanitized)

        # 2. Level 2 ML Risk Prediction
        l2_result = self.ml_model.predict_risk(sanitized)

        # 3. Level 3 Temporal Trajectory Evaluation
        timeline = self.temporal_engine.generate_timeline(sanitized, days=30)
        l3_result = self.temporal_engine.evaluate_trajectory(timeline)

        # 4. Fail-closed overall risk synthesis
        overall_risk = l2_result["predicted_tier"]
        risk_color = RISK_COLORS.get(overall_risk, "#6b7280")

        # Fail-closed check: if Level 1 evaluation failed on critical/high rules, do not produce standard benign risk
        if l1_result.get("evaluation_integrity") == "DEGRADED":
            overall_risk = "UNRESOLVED_AUDIT_REQUIRED"
            risk_color = "#9333ea"  # Distinct warning audit tier
        elif any(r["severity"] == "CRITICAL" for r in l1_result["triggered_rules"]) and overall_risk != "HIGH":
            overall_risk = "HIGH"
            risk_color = RISK_COLORS[overall_risk]
        elif any(r["severity"] == "HIGH" for r in l1_result["triggered_rules"]) and overall_risk in ["LOW", "MODERATE"]:
            overall_risk = "ELEVATED"
            risk_color = RISK_COLORS[overall_risk]

        # Record provenance differentiation (authoritative vs what-if simulation)
        pid = sanitized.get("personnel_id", "PERS-SIM")
        is_sim = is_simulation or pid.startswith("PERS-SIM")
        record_type = "SIMULATED_WHAT_IF" if is_sim else "AUTHORITATIVE_CADRE_RECORD"

        profile_payload = {
            "personnel_id": pid,
            "record_type": record_type,
            "overall_risk": overall_risk,
            "risk_color": risk_color,
            "trend": l3_result["trend_label"],
            "trend_type": l3_result["trajectory_slope"],
            "confidence_pct": l2_result["confidence_pct"],
            "model_version": MODEL_VERSION,
            "contributing_factors": l2_result["contributing_factors"],
            "level1_rules": l1_result,
            "level2_ml": l2_result,
            "level3_temporal": l3_result,
            "timeline_30d": timeline,
            # Core parameter state (guaranteed sanitized)
            "duty_hours_daily": sanitized.get("duty_hours_daily", 8.0),
            "avg_weekly_duty_hours": sanitized.get("avg_weekly_duty_hours", 44.0),
            "deployment_days": sanitized.get("deployment_days", 30),
            "consecutive_shifts": sanitized.get("consecutive_shifts", 5),
            "leave_deficit_days": sanitized.get("leave_deficit_days", 4),
            "workload_level": sanitized.get("workload_level", 5),
            "workload_surge_pct": sanitized.get("workload_surge_pct", 0.0),
            "sleep_hours": sanitized.get("sleep_hours", 7.0),
            "stress_level": sanitized.get("stress_level", 5),
            "heart_rate": sanitized.get("heart_rate", 72),
            "systolic_bp": sanitized.get("systolic_bp", 120),
            "diastolic_bp": sanitized.get("diastolic_bp", 80),
            "mood_code": sanitized.get("mood_code", 1),
            "social_score": sanitized.get("social_score", 3.0),
            "water_liters": sanitized.get("water_liters", 2.0),
            "daily_steps": sanitized.get("daily_steps", 8000),
            "diet_quality": sanitized.get("diet_quality", 0.8),
            "ethical_disclaimer": "Decision-support signal for proactive welfare officers. NOT a clinical diagnosis and NOT for disciplinary decisions."
        }

        # 5. Generate supportive recommendations
        profile_payload["recommendations"] = self.action_engine.get_recommendations(profile_payload)
        return self.scope_profile_by_role(profile_payload, role=role)

    def get_unit_overview(self, role: str = "WELFARE_OFFICER") -> dict:
        """Returns unit-level welfare distribution and watchlist (with role-based redaction)."""
        if not self.is_initialized:
            raise RuntimeError("WelfareRiskProfileManager is not initialized. Please call pipeline_manager.initialize() during startup.")

        df = self.personnel_df
        total_personnel = len(df)

        counts = df['risk_tier'].value_counts()
        dist = {
            "LOW": int(counts.get(0, 0)),
            "MODERATE": int(counts.get(1, 0)),
            "ELEVATED": int(counts.get(2, 0)),
            "HIGH": int(counts.get(3, 0))
        }

        avg_duty = round(float(df['duty_hours_daily'].mean()), 1)
        avg_sleep = round(float(df['sleep_hours'].mean()), 1)
        avg_stress = round(float(df['stress_level'].mean()), 1)
        avg_deployment = round(float(df['deployment_days'].mean()), 1)

        # Sample watchlist
        high_risk_df = df[df['risk_tier'] >= 2].head(15)
        watchlist = []
        for _, row in high_risk_df.iterrows():
            prof = self.generate_complete_profile(row.to_dict(), role=role)
            top_factors = list(prof.get("contributing_factors", {}).get("percentage_impact", {"General": 100}).keys())
            watchlist.append({
                "personnel_id": prof.get("personnel_id"),
                "overall_risk": prof.get("overall_risk", prof.get("wellness_tier")),
                "risk_color": prof.get("risk_color", "#ef4444"),
                "trend": prof.get("trend"),
                "confidence_pct": prof.get("confidence_pct", 85.0),
                "duty_hours": prof.get("duty_hours_daily"),
                "sleep_hours": prof.get("sleep_hours"),
                "deployment_days": prof.get("deployment_days"),
                "priority": prof.get("level3_temporal", {}).get("follow_up_priority", "STANDARD"),
                "top_factor": top_factors[0] if top_factors else "Operational Workload"
            })

        overview = {
            "unit_name": "Taskforce Alpha - 7th Welfare Division",
            "total_personnel": total_personnel,
            "risk_distribution": dist,
            "unit_averages": {
                "avg_daily_duty_hours": avg_duty,
                "avg_nightly_sleep_hours": avg_sleep,
                "avg_stress_level": avg_stress,
                "avg_deployment_days": avg_deployment
            },
            "early_warning_alerts_count": dist["ELEVATED"] + dist["HIGH"],
            "watchlist": watchlist,
            "model_metadata": self.ml_model.metrics
        }
        # Commanders receive aggregate intelligence only; individual watchlists
        # remain available exclusively to welfare officers and administrators.
        if str(role).strip().upper() == "COMMANDER":
            overview.pop("watchlist", None)
        return overview

    def get_all_personnel_summary(self, page=1, limit=50, filter_tier=None, search=None, role: str = "WELFARE_OFFICER") -> dict:
        """Returns paginated personnel risk list with role-based field filtering."""
        if not self.is_initialized:
            raise RuntimeError("WelfareRiskProfileManager is not initialized. Please call pipeline_manager.initialize() during startup.")

        df = self.personnel_df.copy()

        tier_map = {"LOW": 0, "MODERATE": 1, "ELEVATED": 2, "HIGH": 3}
        if filter_tier and filter_tier.upper() in tier_map:
            df = df[df['risk_tier'] == tier_map[filter_tier.upper()]]

        if search:
            search_str = str(search).strip().lower()
            # Safe literal substring search (regex=False prevents ReDoS / re.error crashes)
            df = df[df['personnel_id'].astype(str).str.lower().str.contains(search_str, regex=False)]

        total = len(df)
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        page_df = df.iloc[start_idx:end_idx]

        results = []
        for _, row in page_df.iterrows():
            prof = self.generate_complete_profile(row.to_dict(), role=role)
            results.append({
                "personnel_id": prof.get("personnel_id"),
                "record_type": prof.get("record_type"),
                "overall_risk": prof.get("overall_risk", prof.get("wellness_tier")),
                "risk_color": prof.get("risk_color", "#10b981"),
                "trend": prof.get("trend"),
                "trend_type": prof.get("trend_type"),
                "confidence_pct": prof.get("confidence_pct", 85.0),
                "duty_hours": prof.get("duty_hours_daily"),
                "sleep_hours": prof.get("sleep_hours"),
                "stress_level": prof.get("stress_level"),
                "deployment_days": prof.get("deployment_days"),
                "leave_deficit_days": prof.get("leave_deficit_days"),
                "rules_triggered": prof.get("level1_rules", {}).get("total_rules_triggered", 0),
                "follow_up_priority": prof.get("level3_temporal", {}).get("follow_up_priority", "STANDARD"),
                "access_scope": prof.get("access_scope")
            })

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "personnel": results
        }


# Global singleton instance
pipeline_manager = WelfareRiskProfileManager()

if __name__ == "__main__":
    pipeline_manager.initialize()
    overview = pipeline_manager.get_unit_overview()
    print("[Main] Unit Overview:", json.dumps({k: v for k, v in overview.items() if k != 'watchlist'}, indent=2))
