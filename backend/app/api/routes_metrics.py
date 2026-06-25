import logging

from fastapi import APIRouter

from app.schemas.metrics import EvalMetrics, LlmComparison, ModelComparison
from app.services import metrics_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/metrics", response_model=EvalMetrics)
def get_metrics():
    """Return evaluation metrics for the LightGBM provider-FWA model."""
    return metrics_service.get_eval_metrics()


@router.get("/model-comparison", response_model=ModelComparison)
def get_model_comparison():
    """Return the tabular benchmark across LightGBM, XGBoost, CatBoost, and Logistic Regression."""
    return metrics_service.get_model_comparison()


@router.get("/llm-comparison", response_model=LlmComparison)
def get_llm_comparison():
    """Return the rationale-model benchmark: Llama 3.1 8B (QLoRA) vs Qwen 2.5 7B vs GPT-4o-mini."""
    return metrics_service.get_llm_comparison()
