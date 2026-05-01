# NEXT_STEPS.md

Sessions that build on this infrastructure baseline, in suggested order.
Each row is one focused session; finish one before starting the next.

## Session 2 — Tabular training

**Goal:** real LightGBM model + benchmarks on IEEE-CIS, replacing fixture data.

- Download IEEE-CIS dataset to `ml/data/raw/` (Kaggle CLI).
- Implement `ml/training/train_lightgbm.py` per its docstring: feature
  pipeline, 5-fold CV, Optuna search, MLflow logging.
- Implement `ml/training/train_{xgboost,catboost}.py` benchmarks.
- Add a `train_lr.py` baseline (sklearn LogisticRegression).
- Run `ml/training/compare_models.py` → overwrite
  `backend/app/fixtures/model_comparison.json` with real numbers.
- Run `ml/evaluation/metrics.py` → overwrite `eval_metrics.json` with real
  ROC/PR curves.
- Run `ml/evaluation/fairness.py` → overwrite `fnr_by_merchant`.
- **Acceptance:** `model_comparison.json:winner == "LightGBM"` is empirically
  earned, not stipulated. ROC-AUC ≥ 0.94.

## Session 3 — Production prediction wiring

**Goal:** the API serves real LightGBM predictions, not cached fixtures.

- Save the trained LightGBM model to `backend/app/models/lightgbm-v0.1.txt`.
- Update `backend/app/services/prediction_service.py`: load the model on
  startup, run real inference + TreeExplainer SHAP per request.
- Keep `demo_transactions.json` as the input fixture (50 frozen examples)
  for stable demo behavior; remove `fraud_probability` and `shap` from it.
- Add tests that verify the served fraud_probability matches what the
  LightGBM model actually produces for fixture inputs.
- Empirically tune router thresholds via a cost-vs-escalation sweep over
  the held-out test set (target ~10–15% escalation rate). Update
  `config.py` with the chosen values.

## Session 4 — Synthetic SFT generation

**Goal:** 5K high-quality (transaction, SHAP, rationale) triplets ready for
fine-tuning.

- Implement `ml/synthetic_sft/generate_rationales.py` per its docstring.
- Use Claude Sonnet (or GPT-4o) to generate the completions with few-shot
  examples of high-quality analyst rationales.
- Quality filters: JSON-valid, references ≥3 of top-8 SHAP features by name,
  recommended_action consistent with the LightGBM probability band.
- Output `ml/synthetic_sft/output/rationales.jsonl`.

## Session 5 — QLoRA fine-tune

**Goal:** trained LoRA adapter for Llama 3.1 8B that produces analyst-quality
rationales.

- Implement `ml/training/train_lora.py` per its docstring.
- Train on rented A100 (or 2× RTX 4090).
- Push adapter to HuggingFace Hub.
- Run `ml/evaluation/llm_judge.py` to score 200 generations on the rubric;
  block deploy if mean < 3.5.

## Session 6 — Live LLM serving

**Goal:** the API actually invokes the LoRA-finetuned Llama for borderline
transactions, not just returns cached rationales.

- Set up a vLLM server on a separate Render instance (or a Modal endpoint).
- Update `prediction_service.py`: when routing escalates, call the vLLM
  endpoint with the transaction + SHAP context, parse the JSON response.
- Add timeout + fallback: if the LLM is unreachable in 2s, return a
  rule-based rationale and flag for human review.
- Cache invocations by `(transaction_id, model_version)` to keep the demo
  snappy.

## Session 7 — Drift monitoring

**Goal:** PSI/KS report from real production traffic, regenerated weekly.

- Implement `ml/evaluation/drift.py` per its docstring.
- Set up a scheduled job (Render cron) that re-runs drift on the rolling
  14-day window and writes `drift_report.json`.
- Optional: add a Slack webhook that posts when PSI exceeds 0.20.

## Session 8 — Polish + recruiter assets

**Goal:** the repo is ready to put on a resume.

- Generate a README screenshot of the architecture diagram.
- Generate a LinkedIn share image (1200×630) showcasing the dashboard.
- Record a 60-second Loom walkthrough.
- Add concrete inference cost numbers ($/million transactions) to the README.
- Write a blog post on the confidence-routing approach + post to relevant
  fintech communities.
