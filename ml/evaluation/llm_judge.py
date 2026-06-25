"""
LLM-as-judge harness for evaluating fine-tuned Llama FWA-narrative quality.

Plan
----
- Sample 200 borderline providers from the held-out set.
- Generate audit narratives with the fine-tuned LoRA adapter.
- Pass each (provider_features, top_8_shap, narrative) triplet to a judge model
  (Claude Sonnet 4 or GPT-4o) with a structured rubric:
    - factual grounding (does the narrative cite the provider's real feature values?)
    - signal selection (does it surface the highest-magnitude SHAP drivers?)
    - calibration (does the stated confidence match the model's uncertainty?)
    - actionability (is the recommended SIU action well-justified and specific?)
- Score 1–5 per axis, average across axes ("faithfulness").
- Block deployment if mean score < 3.5 or any individual axis < 3.0.

The same rubric drives `benchmark_rationale_models.py`, which scores the
candidate models head-to-head.
"""


def main() -> None:
    raise NotImplementedError("LLM-judge evaluation scheduled for the next session.")


if __name__ == "__main__":
    main()
