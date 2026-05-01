# ml/

Training, evaluation, and synthetic-rationale generation code for the
FraudSentinel models. This directory is **scaffolding only** in the current
release — every script is a stub that raises `NotImplementedError`. The
docstrings describe the planned approach for each component.

## Layout

| Path | Purpose |
| --- | --- |
| `data/` | IEEE-CIS raw + processed parquet files (gitignored). |
| `notebooks/` | Exploratory notebooks (gitignored). |
| `training/train_lightgbm.py` | Production tabular model. |
| `training/train_xgboost.py` | Benchmark baseline. |
| `training/train_catboost.py` | Benchmark baseline. |
| `training/train_lora.py` | QLoRA fine-tune of Llama 3.1 8B for rationales. |
| `training/compare_models.py` | Cross-model evaluation runner. |
| `evaluation/metrics.py` | ROC-AUC, PR-AUC, P@R, F1, confusion matrix. |
| `evaluation/fairness.py` | FNR parity by ProductCD. |
| `evaluation/drift.py` | PSI + KS test over time windows. |
| `evaluation/llm_judge.py` | LLM-as-judge for rationale quality. |
| `synthetic_sft/generate_rationales.py` | Generate the SFT dataset that fine-tunes Llama. |

## Running order (planned)

1. `notebooks/01_eda.ipynb` — explore IEEE-CIS, design feature engineering.
2. `training/train_lightgbm.py` + benchmarks → `compare_models.py` produces
   `model_comparison.json` consumed by the API.
3. `evaluation/{metrics,fairness,drift}.py` produce `eval_metrics.json` and
   `drift_report.json`.
4. `synthetic_sft/generate_rationales.py` builds the SFT dataset for LoRA.
5. `training/train_lora.py` fine-tunes Llama 3.1 8B on that dataset.
6. `evaluation/llm_judge.py` validates rationale quality before deployment.

All experiments tracked in MLflow (`mlruns/` is gitignored).
