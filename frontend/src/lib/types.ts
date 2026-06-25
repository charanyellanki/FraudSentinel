// Mirrors backend Pydantic schemas. Keep in sync with backend/app/schemas/.

export type PredictedLabel = "clean" | "borderline" | "fraud";
export type Decision = "clear" | "review" | "investigate";
export type RiskLevel = "low" | "medium" | "high";
export type RoutingPath = "direct" | "siu_review";

export interface ProviderSummary {
  provider_id: string;
  state: string;
  total_claims: number;
  total_reimbursed: number;
  unique_beneficiaries: number;
  avg_claim_amount: number;
  inpatient_ratio: number;
  volume_tier: string;
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
  provider_id: string;
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
  fnr_by_volume_tier: Record<string, number>;
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

export interface LlmModelEntry {
  name: string;
  faithfulness: number;
  factual_grounding: number;
  signal_selection: number;
  actionability: number;
  p50_latency_ms: number;
  p95_latency_ms: number;
  cost_per_1k_usd: number;
  deployment: string;
  notes: string;
}

export interface LlmComparison {
  models: LlmModelEntry[];
  winner: string;
  judge_model: string;
  n_samples: number;
  rubric_scale: string;
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
