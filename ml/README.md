# ml/

Training, evaluation, and synthetic-narrative generation code for the
FraudSentinel models. This directory is **scaffolding only** in the current
release — every script is a stub that raises `NotImplementedError`. The
docstrings describe the planned approach for each component.

## Layout

| Path | Purpose |
| --- | --- |
| `data/` | Healthcare Provider Fraud raw CSVs + processed provider-level parquet (gitignored). |
| `notebooks/` | Exploratory notebooks (gitignored). |
| `training/train_lightgbm.py` | Production provider-FWA tabular model. |
| `training/train_xgboost.py` | Benchmark baseline. |
| `training/train_catboost.py` | Benchmark baseline. |
| `training/train_lora.py` | QLoRA fine-tune of Llama 3.1 8B for SIU audit narratives. |
| `training/compare_models.py` | Cross-model tabular evaluation runner. |
| `evaluation/metrics.py` | ROC-AUC, PR-AUC, P@R, F1, confusion matrix. |
| `evaluation/fairness.py` | FNR parity by provider claim-volume tier. |
| `evaluation/drift.py` | PSI + KS test over time windows. |
| `evaluation/llm_judge.py` | LLM-as-judge for narrative quality. |
| `evaluation/benchmark_rationale_models.py` | Llama 3.1 8B vs Qwen 2.5 7B vs GPT-4o-mini → `llm_comparison.json`. |
| `synthetic_sft/generate_rationales.py` | Generate the SFT dataset that fine-tunes Llama. |

## Dataset

[Healthcare Provider Fraud Detection Analysis](https://www.kaggle.com/datasets/rohitrox/healthcare-provider-fraud-detection-analysis)
(CMS-derived, hosted on Kaggle). Four tables — provider labels, beneficiary
demographics + chronic conditions, inpatient claims, outpatient claims — joined
and **aggregated to the provider level**. The label `PotentialFraud` is assigned
per provider (~9% prevalence).

## Running order (planned)

1. `notebooks/01_eda.ipynb` — explore the four tables, design the provider-level
   feature aggregation.
2. `training/train_lightgbm.py` + benchmarks → `compare_models.py` produces
   `model_comparison.json` consumed by the API.
3. `evaluation/{metrics,fairness,drift}.py` produce `eval_metrics.json` and
   `drift_report.json`.
4. `synthetic_sft/generate_rationales.py` builds the SFT dataset for LoRA.
5. `training/train_lora.py` fine-tunes Llama 3.1 8B on that dataset.
6. `evaluation/llm_judge.py` validates narrative quality before deployment;
   `evaluation/benchmark_rationale_models.py` scores Llama vs Qwen vs
   GPT-4o-mini and produces `llm_comparison.json`.

All experiments tracked in MLflow (`mlruns/` is gitignored).
