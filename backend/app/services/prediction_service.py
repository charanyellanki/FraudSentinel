import json
import logging
import time
from functools import lru_cache

from app.config import settings
from app.schemas.prediction import (
    PredictionResponse,
    RationaleResponse,
    RoutingDecision,
    ShapExplanation,
)
from app.schemas.transaction import DemoTransactionSummary

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def _load_transactions() -> dict:
    path = settings.demo_transactions_path
    with path.open() as f:
        data = json.load(f)
    return {tx["TransactionID"]: tx for tx in data["transactions"]}


@lru_cache(maxsize=1)
def _load_rationales() -> dict:
    path = settings.rationales_path
    with path.open() as f:
        return json.load(f)


def list_demo_transactions() -> list[DemoTransactionSummary]:
    tx_map = _load_transactions()
    summaries = []
    for tx in tx_map.values():
        summaries.append(
            DemoTransactionSummary(
                transaction_id=tx["TransactionID"],
                amount=tx["TransactionAmt"],
                product_code=tx["ProductCD"],
                card_type=tx["card_type"],
                card_network=tx["card_network"],
                p_emaildomain=tx["P_emaildomain"],
                device_type=tx["device_type"],
                fraud_probability=tx["fraud_probability"],
                predicted_label=tx["predicted_label"],
            )
        )
    return summaries


def predict(transaction_id: str) -> PredictionResponse:
    tx_map = _load_transactions()
    if transaction_id not in tx_map:
        return None  # caller raises 404

    start = time.perf_counter()
    tx = tx_map[transaction_id]
    p = tx["fraud_probability"]

    low = settings.router_low_threshold
    high = settings.router_high_threshold

    if p < low:
        decision = "approve"
        routing_path = "direct"
        routing_reason = f"Probability {p:.3f} below low threshold {low} — routed directly."
    elif p > high:
        decision = "decline"
        routing_path = "direct"
        routing_reason = f"Probability {p:.3f} above high threshold {high} — routed directly."
    else:
        decision = "review"
        routing_path = "llm_escalated"
        routing_reason = (
            f"Probability {p:.3f} within uncertainty band [{low}, {high}] — escalated to LLM."
        )

    rationale_data = _load_rationales().get(transaction_id)
    rationale = RationaleResponse(**rationale_data) if rationale_data else None

    # Confidence: distance from the nearest threshold, rescaled to [0, 1].
    if p < low:
        confidence = min(1.0, (low - p) / low)
    elif p > high:
        confidence = min(1.0, (p - high) / (1.0 - high))
    else:
        mid = (low + high) / 2
        confidence = 1.0 - abs(p - mid) / ((high - low) / 2)

    shap_raw = tx["shap"]
    shap = ShapExplanation(
        base_value=shap_raw["base_value"],
        contributions=shap_raw["contributions"],
    )

    latency_ms = (time.perf_counter() - start) * 1000

    return PredictionResponse(
        transaction_id=transaction_id,
        fraud_probability=p,
        decision=decision,
        confidence=round(confidence, 4),
        routing=RoutingDecision(
            path=routing_path,
            reason=routing_reason,
            probability=p,
            low_threshold=low,
            high_threshold=high,
        ),
        shap=shap,
        rationale=rationale,
        latency_ms=round(latency_ms, 2),
    )
