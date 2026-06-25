"""
Benchmark the FWA-narrative model against alternatives and emit
`llm_comparison.json` for the API.

Compares three candidates on the borderline-provider escalation task:
  - Llama 3.1 8B (QLoRA)  — the fine-tuned production model, self-hosted vLLM
  - Qwen 2.5 7B           — open-weight alternative, self-hosted vLLM
  - GPT-4o-mini           — hosted-API reference point

Plan
----
1. Reuse the 200-provider judged set from `llm_judge.py`. For each candidate,
   generate a narrative per provider from the identical (features + top-8 SHAP)
   prompt.
2. Faithfulness: score every narrative with the LLM-as-judge rubric
   (factual grounding, signal selection, calibration, actionability; 1–5).
   Report the overall mean plus per-axis means.
3. Latency: measure p50 / p95 wall-clock per generation under the production
   serving config (vLLM for the open models, API for GPT-4o-mini).
4. Cost: compute USD per 1,000 decisions from measured token usage —
   amortized GPU-hour cost for the self-hosted models, list price for the API.
5. Compliance note: flag candidates that route PHI to a third party. Selection
   weights faithfulness and unit cost, with in-VPC inference a hard requirement
   for production SIU use.
6. Write `backend/app/fixtures/llm_comparison.json` and log all runs to MLflow
   under experiment "fraudsentinel/llm-benchmarks".

Expected winner: the fine-tuned Llama 3.1 8B — top faithfulness, lowest unit
cost at scale, and no PHI egress.
"""

from pathlib import Path


def main(output_path: Path = Path("../backend/app/fixtures/llm_comparison.json")) -> None:
    raise NotImplementedError(
        "Rationale-model benchmark scheduled for the LLM session. See module "
        "docstring for the evaluation plan."
    )


if __name__ == "__main__":
    main()
