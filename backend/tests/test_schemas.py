import pytest
from pydantic import ValidationError

from app.schemas.prediction import (
    PredictionResponse,
    RoutingDecision,
    ShapContribution,
    ShapExplanation,
)
from app.schemas.transaction import DemoTransactionSummary


def test_shap_explanation_validates():
    s = ShapExplanation(
        base_value=-2.14,
        contributions=[
            ShapContribution(feature="V12", value=1.0, contribution=-0.42),
        ],
    )
    assert s.base_value == -2.14
    assert len(s.contributions) == 1


def test_prediction_response_requires_routing_decision():
    with pytest.raises(ValidationError):
        PredictionResponse(
            transaction_id="T_001",
            fraud_probability=0.5,
            decision="review",
            confidence=0.7,
            shap=ShapExplanation(base_value=-2.14, contributions=[]),
            latency_ms=1.0,
        )  # missing routing


def test_demo_summary_rejects_invalid_label():
    with pytest.raises(ValidationError):
        DemoTransactionSummary(
            transaction_id="T_001",
            amount=10.0,
            product_code="W",
            card_type="debit",
            card_network="visa",
            p_emaildomain="gmail.com",
            device_type="desktop",
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
