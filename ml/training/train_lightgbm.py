"""
Train the production LightGBM tabular fraud scorer on IEEE-CIS.

Plan
----
1. Load `train_transaction.csv` + `train_identity.csv` from `ml/data/raw/`,
   left-join on `TransactionID`.
2. Feature engineering pipeline:
   - Categorical: target encoding for high-cardinality (P_emaildomain,
     R_emaildomain, DeviceInfo); ordinal encoding for low-cardinality
     (ProductCD, card_type, card_network).
   - Numerical: missing-flag features for V-block, log1p on TransactionAmt
     and dist1.
   - Time: derive hour, weekday from TransactionDT (reference 2017-09-01).
3. Stratified 5-fold CV with early stopping on the holdout fold.
4. Hyperparameter search via Optuna (50 trials): num_leaves, learning_rate,
   feature_fraction, bagging_fraction, min_child_samples.
5. Refit on full train with best params.
6. Generate TreeExplainer SHAP values on the held-out test set; serialize
   per-transaction top-8 contributions for fixture loading.
7. Log artifacts to MLflow:
   - Model file (`model.txt`)
   - Feature importance gain
   - SHAP summary plot
   - Confusion matrix at the operating threshold
   - ROC + PR curves
8. Export `eval_metrics.json` (consumed by `backend/app/fixtures/`).

Target: ROC-AUC ≥ 0.94, p95 inference latency < 5ms.
"""

from pathlib import Path


def main(data_dir: Path = Path("data/raw"), output_dir: Path = Path("artifacts")) -> None:
    raise NotImplementedError(
        "LightGBM training pipeline scheduled for the next session. "
        "See module docstring for the planned approach."
    )


if __name__ == "__main__":
    main()
