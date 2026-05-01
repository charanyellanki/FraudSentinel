from pydantic import BaseModel, Field


class ConfusionMatrix(BaseModel):
    tp: int
    fp: int
    tn: int
    fn: int


class CurvePoint(BaseModel):
    x: float
    y: float


class EvalMetrics(BaseModel):
    """
    Placeholder evaluation results. Replace with real MLflow-logged outputs
    after model training is complete.
    """

    roc_auc: float
    pr_auc: float
    precision_at_recall_50: float = Field(..., alias="precision@recall=0.5")
    precision_at_recall_80: float = Field(..., alias="precision@recall=0.8")
    f1: float
    fnr: float = Field(..., description="False negative rate")
    fpr: float = Field(..., description="False positive rate at operating threshold")
    threshold: float
    confusion_matrix: ConfusionMatrix
    roc_curve: list[CurvePoint]
    pr_curve: list[CurvePoint]
    fnr_by_merchant: dict[str, float] = Field(
        ..., description="FNR broken down by ProductCD merchant category"
    )

    model_config = {"populate_by_name": True}


class ModelEntry(BaseModel):
    name: str
    roc_auc: float
    pr_auc: float
    f1: float
    train_time_s: float
    inference_p50_ms: float
    inference_p95_ms: float
    notes: str


class ModelComparison(BaseModel):
    """
    Placeholder benchmark results. Replace after real training runs.
    """

    models: list[ModelEntry]
    winner: str
    evaluation_date: str


class DriftFeature(BaseModel):
    feature: str
    psi: float
    ks_pvalue: float
    status: str  # "stable" | "warning" | "drift"


class DriftWindow(BaseModel):
    window_label: str
    reference_start: str
    reference_end: str
    comparison_start: str
    comparison_end: str
    features: list[DriftFeature]
    overall_psi: float


class DriftReport(BaseModel):
    """
    Placeholder drift report. Replace with real PSI/KS outputs from drift.py.
    """

    windows: list[DriftWindow]
    generated_at: str
