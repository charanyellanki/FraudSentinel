# Architecture

> Placeholder. Expanded once model training is complete and the real serving
> path is wired up.

## Components

- **Tabular scorer** — LightGBM trained on IEEE-CIS. Inference latency p50 ~1.2ms.
- **Confidence router** — fixed thresholds at p ∈ [0.35, 0.65]; transactions
  inside the band escalate to the LLM. Thresholds will be tuned via a
  cost-vs-escalation sweep once the production model is trained.
- **LLM rationale** — Llama 3.1 8B Instruct + LoRA adapter, trained on a 5K
  synthetic SFT set generated from SHAP-grounded prompts.
- **Eval harness** — precision@recall, ROC-AUC, FNR parity by ProductCD,
  PSI/KS drift, LLM-as-judge for rationale quality.

## Request flow

```
Transaction
   │
   ▼
LightGBM ─── p ∈ [0, 0.35) ──► Decision: approve
   │
   ├─── p ∈ (0.65, 1] ────────► Decision: decline
   │
   └─── p ∈ [0.35, 0.65] ──► Llama 3.1 8B + LoRA ──► Decision: review
```

See `frontend/src/components/ArchitectureDiagram.tsx` for the rendered SVG.
