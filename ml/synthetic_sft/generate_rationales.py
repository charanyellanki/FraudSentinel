"""
Generate the supervised fine-tuning dataset that teaches Llama 3.1 8B to
produce structured FWA audit narratives for SIU review.

Plan
----
1. Sample 5,000 providers from the training set (stratified across
   {clean/borderline/fraud} bands, oversampling the borderline band that the
   router actually escalates).
2. For each provider, compute LightGBM TreeExplainer top-8 SHAP contributions
   over its claim-aggregate features.
3. Render a prompt: provider features + SHAP table + instruction to produce a
   JSON object matching the `RationaleResponse` schema (risk_level,
   key_signals, rationale, recommended_action ∈ {clear, review, investigate},
   confidence).
4. Generate the target completion using a strong instruction-following model
   (Claude Sonnet 4 or GPT-4o) with few-shot examples of high-quality SIU
   investigator write-ups grounded in CMS FWA typologies (upcoding, phantom
   billing, unbundling, medically-unnecessary services, deceased-beneficiary
   claims).
5. Quality filter: drop completions that fail JSON validation, that don't
   reference at least 3 of the top-8 SHAP features by name, or whose
   recommended_action disagrees with the LightGBM probability band.
6. Write to `output/rationales.jsonl` for `train_lora.py`.

This is the "data engine" — the quality of these narratives sets the ceiling
for what the fine-tuned Llama can produce.
"""

from pathlib import Path


def main(output_path: Path = Path("output/rationales.jsonl"), n_samples: int = 5000) -> None:
    raise NotImplementedError("SFT dataset generation scheduled for the LLM session.")


if __name__ == "__main__":
    main()
