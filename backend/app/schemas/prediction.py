from typing import Literal

from pydantic import BaseModel, Field

Decision = Literal["clear", "review", "investigate"]


class ShapContribution(BaseModel):
    feature: str
    value: float = Field(..., description="Raw provider-level feature value for display")
    contribution: float = Field(..., description="SHAP contribution in log-odds space")


class ShapExplanation(BaseModel):
    base_value: float = Field(
        ..., description="Model base value in log-odds space (LightGBM TreeExplainer default)"
    )
    contributions: list[ShapContribution] = Field(
        ..., description="Top-8 contributors, sorted by |contribution| descending"
    )


class RationaleResponse(BaseModel):
    risk_level: Literal["low", "medium", "high"]
    key_signals: list[str] = Field(..., description="2–5 bullet-point signals driving the call")
    rationale: str = Field(..., description="2–5 sentence SIU investigator-style narrative")
    recommended_action: Decision
    confidence: float = Field(..., ge=0.0, le=1.0)
    generated_by: str = Field(default="llama-3.1-8b-lora-v0.1")


class RoutingDecision(BaseModel):
    path: Literal["direct", "siu_review"]
    reason: str
    probability: float
    low_threshold: float
    high_threshold: float


class PredictionResponse(BaseModel):
    provider_id: str
    fraud_probability: float = Field(..., ge=0.0, le=1.0)
    decision: Decision
    confidence: float = Field(..., ge=0.0, le=1.0)
    routing: RoutingDecision
    shap: ShapExplanation
    rationale: RationaleResponse | None = Field(
        None, description="Present only when the case was escalated to SIU review"
    )
    model_version: str = Field(default="lightgbm-fwa-v0.1-fixture")
    latency_ms: float


class PredictRequest(BaseModel):
    provider_id: str
