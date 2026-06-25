"""
Train the production LightGBM provider-FWA scorer on the Healthcare Provider
Fraud Detection dataset (CMS / Kaggle).

Plan
----
1. Load the four raw tables from `ml/data/raw/`:
     - Train-*.csv             (Provider, PotentialFraud — the provider-level label)
     - Train_Beneficiarydata   (demographics, 11 chronic-condition flags, DOD)
     - Train_Inpatientdata     (claims, AdmissionDt/DischargeDt, DiagnosisGroupCode)
     - Train_Outpatientdata    (claims)
   Concatenate inpatient + outpatient claims, join beneficiary attributes on
   BeneID, then aggregate everything to the Provider level.
2. Provider-level feature engineering (the model scores a *provider*, not a claim):
   - Volume/value: n_claims, total_reimbursed, mean/std claim amount,
     reimbursed_per_beneficiary, claims_per_beneficiary, deductible_paid_ratio.
   - Mix: inpatient_ratio, mean_inpatient_los_days (DischargeDt - AdmissionDt).
   - Provider network: unique attending/operating/other physicians,
     claims_per_attending_physician (physician reuse).
   - Coding: unique diagnosis/procedure codes, top_diagnosis_concentration,
     mean_n_diagnoses_per_claim.
   - Beneficiary panel: mean_age, pct_deceased_beneficiaries (DOD present),
     mean_chronic_conditions, renal/dialysis share.
   - Categorical: modal provider state, claim-volume tier (quintile).
3. Stratified 5-fold CV (fraud prevalence ~9%); scale_pos_weight tuned for the
   imbalance. Early stopping on the holdout fold.
4. Hyperparameter search via Optuna (50 trials): num_leaves, learning_rate,
   feature_fraction, bagging_fraction, min_child_samples, scale_pos_weight.
5. Refit on full train with best params.
6. Generate TreeExplainer SHAP values on the held-out providers; serialize
   per-provider top-8 contributions for fixture loading.
7. Log artifacts to MLflow:
   - Model file (`model.txt`), feature-importance gain, SHAP summary plot,
     confusion matrix at the operating threshold, ROC + PR curves.
8. Export `eval_metrics.json` (consumed by `backend/app/fixtures/`).

Target: ROC-AUC ≥ 0.93 at the provider level, p95 inference latency < 5ms.
"""

from pathlib import Path


def main(data_dir: Path = Path("data/raw"), output_dir: Path = Path("artifacts")) -> None:
    raise NotImplementedError(
        "LightGBM training pipeline scheduled for the next session. "
        "See module docstring for the planned approach."
    )


if __name__ == "__main__":
    main()
