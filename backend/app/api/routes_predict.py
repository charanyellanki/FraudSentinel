import logging

from fastapi import APIRouter, HTTPException

from app.schemas.prediction import PredictionResponse, PredictRequest
from app.schemas.transaction import DemoTransactionSummary
from app.services import prediction_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/demo-transactions", response_model=list[DemoTransactionSummary])
def get_demo_transactions():
    """Return the full list of 50 demo transactions for the picker UI."""
    return prediction_service.list_demo_transactions()


@router.post("/predict", response_model=PredictionResponse)
def predict(request: PredictRequest):
    """
    Return a fraud prediction for a demo transaction.
    Serves from cached fixtures — real model inference in a future release.
    """
    result = prediction_service.predict(request.transaction_id)
    if result is None:
        raise HTTPException(
            status_code=404, detail=f"Transaction '{request.transaction_id}' not found"
        )
    return result
