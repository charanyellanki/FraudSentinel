import logging

from fastapi import APIRouter, HTTPException

from app.schemas.prediction import PredictionResponse, PredictRequest
from app.schemas.provider import ProviderSummary
from app.services import prediction_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/demo-providers", response_model=list[ProviderSummary])
def get_demo_providers():
    """Return the full list of 50 demo providers for the picker UI."""
    return prediction_service.list_demo_providers()


@router.post("/predict", response_model=PredictionResponse)
def predict(request: PredictRequest):
    """
    Return a provider-level FWA prediction for a demo provider.
    Serves from cached fixtures — real model inference in a future release.
    """
    result = prediction_service.predict(request.provider_id)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Provider '{request.provider_id}' not found")
    return result
