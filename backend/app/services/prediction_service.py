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
from app.schemas.provider import ProviderSummary

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def _load_providers() -> dict:
    path = settings.demo_providers_path
    with path.open() as f:
        data = json.load(f)
    return {p["provider_id"]: p for p in data["providers"]}


@lru_cache(maxsize=1)
def _load_rationales() -> dict:
    path = settings.rationales_path
    with path.open() as f:
        return json.load(f)


def list_demo_providers() -> list[ProviderSummary]:
    provider_map = _load_providers()
    summaries = []
    for prov in provider_map.values():
        summaries.append(
            ProviderSummary(
                provider_id=prov["provider_id"],
                state=prov["state"],
                total_claims=prov["total_claims"],
                total_reimbursed=prov["total_reimbursed"],
                unique_beneficiaries=prov["unique_beneficiaries"],
                avg_claim_amount=prov["avg_claim_amount"],
                inpatient_ratio=prov["inpatient_ratio"],
                volume_tier=prov["volume_tier"],
                fraud_probability=prov["fraud_probability"],
                predicted_label=prov["predicted_label"],
            )
        )
    return summaries


def predict(provider_id: str) -> PredictionResponse | None:
    provider_map = _load_providers()
    if provider_id not in provider_map:
        return None  # caller raises 404

    start = time.perf_counter()
    prov = provider_map[provider_id]
    p = prov["fraud_probability"]

    low = settings.router_low_threshold
    high = settings.router_high_threshold

    if p < low:
        decision = "clear"
        routing_path = "direct"
        routing_reason = (
            f"Fraud likelihood {p:.3f} below low threshold {low} — auto-cleared, no SIU review."
        )
    elif p > high:
        decision = "investigate"
        routing_path = "direct"
        routing_reason = (
            f"Fraud likelihood {p:.3f} above high threshold {high} — "
            f"auto-referred for investigation/recovery."
        )
    else:
        decision = "review"
        routing_path = "siu_review"
        routing_reason = (
            f"Fraud likelihood {p:.3f} within uncertainty band [{low}, {high}] — "
            f"escalated to SIU with an LLM-generated audit narrative."
        )

    rationale_data = _load_rationales().get(provider_id)
    rationale = RationaleResponse(**rationale_data) if rationale_data else None

    # Confidence: distance from the nearest threshold, rescaled to [0, 1].
    if p < low:
        confidence = min(1.0, (low - p) / low)
    elif p > high:
        confidence = min(1.0, (p - high) / (1.0 - high))
    else:
        mid = (low + high) / 2
        confidence = 1.0 - abs(p - mid) / ((high - low) / 2)

    shap_raw = prov["shap"]
    shap = ShapExplanation(
        base_value=shap_raw["base_value"],
        contributions=shap_raw["contributions"],
    )

    latency_ms = (time.perf_counter() - start) * 1000

    return PredictionResponse(
        provider_id=provider_id,
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
