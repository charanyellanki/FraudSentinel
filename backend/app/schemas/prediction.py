from typing import Literal

from pydantic import BaseModel, Field


class ShapContribution(BaseModel):
    feature: str
    value: float = Field(..., description="Raw feature value for display")
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
    rationale: str = Field(..., description="2–5 sentence analyst-style narrative")
    recommended_action: Literal["approve", "review", "decline"]
    confidence: float = Field(..., ge=0.0, le=1.0)
    generated_by: str = Field(default="llama-3.1-8b-lora-v0.1")


class RoutingDecision(BaseModel):
    path: Literal["direct", "llm_escalated"]
    reason: str
    probability: float
    low_threshold: float
    high_threshold: float


class PredictionResponse(BaseModel):
    transaction_id: str
    fraud_probability: float = Field(..., ge=0.0, le=1.0)
    decision: Literal["approve", "review", "decline"]
    confidence: float = Field(..., ge=0.0, le=1.0)
    routing: RoutingDecision
    shap: ShapExplanation
    rationale: RationaleResponse | None = Field(
        None, description="Present only when LLM was called"
    )
    model_version: str = Field(default="lightgbm-v0.1-fixture")
    latency_ms: float


class PredictRequest(BaseModel):
    transaction_id: str
