import logging

from fastapi import APIRouter

from app.schemas.metrics import DriftReport
from app.services import drift_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/drift", response_model=DriftReport)
def get_drift():
    """Return PSI/KS drift report across 4 time windows for the top 20 features."""
    return drift_service.get_drift_report()
