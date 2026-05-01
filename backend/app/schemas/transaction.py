from typing import Literal

from pydantic import BaseModel, Field


class Transaction(BaseModel):
    """Full IEEE-CIS transaction record. V-features are a curated subset (V1–V20)."""

    TransactionID: str
    TransactionDT: int = Field(..., description="Seconds offset from dataset reference date")
    TransactionAmt: float = Field(..., gt=0)
    ProductCD: Literal["W", "C", "R", "H", "S"]
    card_type: Literal["credit", "debit"]
    card_network: Literal["visa", "mastercard", "discover", "american express"]
    addr1: int = Field(..., description="Billing zip area code")
    addr2: int = Field(..., description="Billing region code")
    dist1: float = Field(..., ge=0, description="Distance between billing and shipping zip")
    P_emaildomain: str = Field(..., description="Purchaser email domain")
    R_emaildomain: str = Field(..., description="Recipient email domain")
    device_type: Literal["mobile", "desktop"]
    device_info: str

    # Match flags (T/F). M4 is categorical (M0/M1/M2).
    M1: bool
    M2: bool
    M3: bool
    M4: Literal["M0", "M1", "M2"]
    M5: bool
    M6: bool
    M7: bool
    M8: bool
    M9: bool

    # Vesta engineered features (subset). V1–V11 are binary; V12–V20 are counts/floats.
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float


class DemoTransactionSummary(BaseModel):
    """Lightweight record for the transaction picker UI."""

    transaction_id: str
    amount: float
    product_code: str
    card_type: str
    card_network: str
    p_emaildomain: str
    device_type: str
    fraud_probability: float
    predicted_label: Literal["legit", "borderline", "fraud"]
