"""
Run all four tabular benchmarks and emit `model_comparison.json` for the API.

Plan
----
- Sequentially invoke train_lightgbm, train_xgboost, train_catboost, plus a
  scikit-learn LogisticRegression baseline — all on the provider-level feature
  set with identical preprocessing.
- Aggregate metrics: roc_auc, pr_auc, f1, train_time_s, inference_p50_ms,
  inference_p95_ms (measured via 1000-provider timed loop).
- Pick the winner by ROC-AUC and inference p95 < 5ms.
- Write `backend/app/fixtures/model_comparison.json` (overwriting the
  placeholder) and log all runs under MLflow experiment "benchmarks".
"""

from pathlib import Path


def main(output_path: Path = Path("../backend/app/fixtures/model_comparison.json")) -> None:
    raise NotImplementedError("Benchmark comparison scheduled for the next session.")


if __name__ == "__main__":
    main()
