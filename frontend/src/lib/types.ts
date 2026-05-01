// Mirrors backend Pydantic schemas. Keep in sync with backend/app/schemas/.

export type PredictedLabel = "legit" | "borderline" | "fraud";
export type Decision = "approve" | "review" | "decline";
export type RiskLevel = "low" | "medium" | "high";
export type RoutingPath = "direct" | "llm_escalated";

export interface DemoTransactionSummary {
  transaction_id: string;
  amount: number;
  product_code: string;
  card_type: string;
  card_network: string;
  p_emaildomain: string;
  device_type: string;
  fraud_probability: number;
  predicted_label: PredictedLabel;
}

export interface ShapContribution {
  feature: string;
  value: number;
  contribution: number;
}

export interface ShapExplanation {
  base_value: number;
  contributions: ShapContribution[];
}

export interface RoutingDecision {
  path: RoutingPath;
  reason: string;
  probability: number;
  low_threshold: number;
  high_threshold: number;
}

export interface RationaleResponse {
  risk_level: RiskLevel;
  key_signals: string[];
  rationale: string;
  recommended_action: Decision;
  confidence: number;
  generated_by: string;
}

export interface PredictionResponse {
  transaction_id: string;
  fraud_probability: number;
  decision: Decision;
  confidence: number;
  routing: RoutingDecision;
  shap: ShapExplanation;
  rationale: RationaleResponse | null;
  model_version: string;
  latency_ms: number;
}

export interface CurvePoint {
  x: number;
  y: number;
}

export interface ConfusionMatrix {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
}

export interface EvalMetrics {
  roc_auc: number;
  pr_auc: number;
  "precision@recall=0.5": number;
  "precision@recall=0.8": number;
  f1: number;
  fnr: number;
  fpr: number;
  threshold: number;
  confusion_matrix: ConfusionMatrix;
  roc_curve: CurvePoint[];
  pr_curve: CurvePoint[];
  fnr_by_merchant: Record<string, number>;
}

export interface ModelEntry {
  name: string;
  roc_auc: number;
  pr_auc: number;
  f1: number;
  train_time_s: number;
  inference_p50_ms: number;
  inference_p95_ms: number;
  notes: string;
}

export interface ModelComparison {
  models: ModelEntry[];
  winner: string;
  evaluation_date: string;
}

export interface DriftFeature {
  feature: string;
  psi: number;
  ks_pvalue: number;
  status: string;
}

export interface DriftWindow {
  window_label: string;
  reference_start: string;
  reference_end: string;
  comparison_start: string;
  comparison_end: string;
  features: DriftFeature[];
  overall_psi: number;
}

export interface DriftReport {
  windows: DriftWindow[];
  generated_at: string;
}
