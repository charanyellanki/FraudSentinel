import logging

from fastapi import APIRouter
from pydantic import BaseModel

from app.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    version: str
    fixtures: dict[str, bool]


@router.get("/health", response_model=HealthResponse)
def health():
    """Liveness check. Reports fixture file presence for Render healthcheck."""
    fixture_paths = {
        "demo_transactions": settings.demo_transactions_path,
        "rationales": settings.rationales_path,
        "eval_metrics": settings.eval_metrics_path,
        "model_comparison": settings.model_comparison_path,
        "drift_report": settings.drift_report_path,
    }
    return HealthResponse(
        status="ok",
        version=settings.app_version,
        fixtures={name: path.exists() for name, path in fixture_paths.items()},
    )
