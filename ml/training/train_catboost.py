"""
Train a CatBoost benchmark on the provider-aggregated FWA feature set.

Plan
----
- Native categorical handling (no manual encoding for provider state or the
  claim-volume tier) — CatBoost's main differentiator vs LightGBM/XGBoost.
- Optuna search over: depth, learning_rate, l2_leaf_reg, bagging_temperature,
  auto_class_weights for the ~9% fraud prevalence.
- 5-fold stratified CV with early stopping.
- Logged alongside other benchmarks for `compare_models.py`.
"""

from pathlib import Path


def main(data_dir: Path = Path("data/raw"), output_dir: Path = Path("artifacts")) -> None:
    raise NotImplementedError("CatBoost benchmark scheduled for the next session.")


if __name__ == "__main__":
    main()
