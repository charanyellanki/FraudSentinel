"""
Train an XGBoost benchmark on the provider-aggregated FWA feature set.

Plan
----
- Same provider-level feature pipeline as `train_lightgbm.py` (factored into a
  shared preprocessor in a future commit).
- Optuna search over: max_depth, eta, subsample, colsample_bytree,
  min_child_weight, scale_pos_weight (fraud prevalence ~9%).
- 5-fold stratified CV with early stopping.
- Logs to MLflow under experiment "fraudsentinel/benchmarks".
- Exports metrics consumed by `compare_models.py`.

Acts as the primary baseline LightGBM must beat to ship.
"""

from pathlib import Path


def main(data_dir: Path = Path("data/raw"), output_dir: Path = Path("artifacts")) -> None:
    raise NotImplementedError("XGBoost benchmark scheduled for the next session.")


if __name__ == "__main__":
    main()
