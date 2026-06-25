from typing import Literal

from pydantic import BaseModel, Field

PredictedLabel = Literal["clean", "borderline", "fraud"]


class Provider(BaseModel):
    """
    Provider-level FWA record: claim-history features aggregated to a single
    Medicare provider. Engineered from the CMS / Kaggle Healthcare Provider
    Fraud Detection dataset (beneficiary + inpatient + outpatient claims joined
    on Provider). The label `PotentialFraud` is assigned at the provider level.
    """

    provider_id: str = Field(..., description="CMS provider identifier, e.g. PRV51001")
    state: str = Field(..., description="Modal provider state across its claims")

    # Volume / value
    total_claims: int = Field(..., ge=0)
    total_reimbursed: float = Field(..., ge=0, description="Sum of InscClaimAmtReimbursed")
    unique_beneficiaries: int = Field(..., ge=0)
    avg_claim_amount: float = Field(..., ge=0)
    inpatient_ratio: float = Field(..., ge=0, le=1)
    volume_tier: Literal["Q1 (lowest)", "Q2", "Q3", "Q4", "Q5 (highest)"]

    # Utilization / concentration features (subset of the full engineered set)
    reimbursed_per_beneficiary: float | None = None
    claims_per_beneficiary: float | None = None
    claims_per_attending_physician: float | None = None
    unique_diagnosis_codes: int | None = None
    unique_procedure_codes: int | None = None
    top_diagnosis_concentration: float | None = None
    mean_chronic_conditions: float | None = None
    pct_deceased_beneficiaries: float | None = None
    mean_inpatient_los_days: float | None = None
    deductible_paid_ratio: float | None = None


class ProviderSummary(BaseModel):
    """Lightweight record for the provider picker UI."""

    provider_id: str
    state: str
    total_claims: int
    total_reimbursed: float
    unique_beneficiaries: int
    avg_claim_amount: float
    inpatient_ratio: float
    volume_tier: str
    fraud_probability: float
    predicted_label: PredictedLabel
