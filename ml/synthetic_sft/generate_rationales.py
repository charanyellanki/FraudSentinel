"""
Generate the supervised fine-tuning dataset that teaches Llama 3.1 8B to
produce structured fraud rationales.

Plan
----
1. Sample 5,000 transactions from the training set (stratified across
   {legit/borderline/fraud} bands, oversampling borderline).
2. For each transaction, compute LightGBM TreeExplainer top-8 SHAP
   contributions.
3. Render a prompt: transaction features + SHAP table + instruction to
   produce a JSON object matching the `RationaleResponse` schema.
4. Generate the target completion using a strong instruction-following model
   (Claude Sonnet 4 or GPT-4o) with few-shot examples of high-quality
   analyst rationales.
5. Quality filter: drop completions that fail JSON validation, that don't
   reference at least 3 of the top-8 SHAP features by name, or that
   disagree with the recommended action implied by the LightGBM probability.
6. Write to `output/rationales.jsonl` for `train_lora.py`.

This is the "data engine" — the quality of these rationales sets the ceiling
for what the fine-tuned Llama can produce.
"""

from pathlib import Path


def main(output_path: Path = Path("output/rationales.jsonl"), n_samples: int = 5000) -> None:
    raise NotImplementedError("SFT dataset generation scheduled for the LLM session.")


if __name__ == "__main__":
    main()
