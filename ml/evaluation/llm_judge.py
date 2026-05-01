"""
LLM-as-judge harness for evaluating the fine-tuned Llama rationale quality.

Plan
----
- Sample 200 borderline transactions from the held-out test set.
- Generate rationales with the fine-tuned LoRA adapter.
- Pass each (transaction_features, top_8_shap, rationale) triplet to a
  judge model (Claude Sonnet or GPT-4o) with a structured rubric:
    - factual grounding (does the rationale reference real feature values?)
    - signal selection (does it surface the highest-magnitude SHAP features?)
    - calibration (does the confidence match the model's uncertainty?)
    - actionability (is the recommended action well-justified?)
- Score 1–5 per axis, average across axes.
- Block deployment if mean score < 3.5 or any individual axis < 3.0.
"""


def main() -> None:
    raise NotImplementedError("LLM-judge evaluation scheduled for the next session.")


if __name__ == "__main__":
    main()
