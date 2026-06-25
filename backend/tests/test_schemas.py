import pytest
from pydantic import ValidationError

from app.schemas.prediction import (
    PredictionResponse,
    RoutingDecision,
    ShapContribution,
    ShapExplanation,
)
from app.schemas.provider import ProviderSummary


def test_shap_explanation_validates():
    s = ShapExplanation(
        base_value=-2.30,
        contributions=[
            ShapContribution(
                feature="reimbursed_per_beneficiary", value=14200.0, contribution=0.42
            ),
        ],
    )
    assert s.base_value == -2.30
    assert len(s.contributions) == 1


def test_prediction_response_requires_routing_decision():
    with pytest.raises(ValidationError):
        PredictionResponse(
            provider_id="PRV51001",
            fraud_probability=0.5,
            decision="review",
            confidence=0.7,
            shap=ShapExplanation(base_value=-2.30, contributions=[]),
            latency_ms=1.0,
        )  # missing routing


def test_provider_summary_rejects_invalid_label():
    with pytest.raises(ValidationError):
        ProviderSummary(
            provider_id="PRV51001",
            state="CA",
            total_claims=500,
            total_reimbursed=250000.0,
            unique_beneficiaries=300,
            avg_claim_amount=500.0,
            inpatient_ratio=0.1,
            volume_tier="Q1 (lowest)",
            fraud_probability=0.1,
            predicted_label="not_a_real_label",
        )


def test_routing_decision_path_enum():
    rd = RoutingDecision(
        path="direct",
        reason="ok",
        probability=0.1,
        low_threshold=0.35,
        high_threshold=0.65,
    )
    assert rd.path == "direct"
    with pytest.raises(ValidationError):
        RoutingDecision(
            path="something_else",
            reason="ok",
            probability=0.1,
            low_threshold=0.35,
            high_threshold=0.65,
        )
