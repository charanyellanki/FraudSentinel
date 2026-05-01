import logging

from fastapi import APIRouter

from app.schemas.metrics import EvalMetrics, ModelComparison
from app.services import metrics_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/metrics", response_model=EvalMetrics)
def get_metrics():
    """Return evaluation metrics for the LightGBM production model."""
    return metrics_service.get_eval_metrics()


@router.get("/model-comparison", response_model=ModelComparison)
def get_model_comparison():
    """Return benchmark comparison across LightGBM, XGBoost, CatBoost, and Logistic Regression."""
    return metrics_service.get_model_comparison()
