# Architecture

> Placeholder. Expanded once model training is complete and the real serving
> path is wired up.

## Components

- **Tabular scorer** — LightGBM trained on provider-aggregated claim features
  from the Healthcare Provider Fraud dataset. Inference latency p50 ~0.9ms.
- **Confidence router** — fixed thresholds at p ∈ [0.35, 0.65]; providers
  inside the band escalate to the LLM. Thresholds will be tuned via a
  cost-vs-escalation sweep once the production model is trained.
- **LLM audit narrative** — Llama 3.1 8B Instruct + LoRA adapter, trained on a
  5K synthetic SFT set generated from SHAP-grounded prompts. Benchmarked against
  Qwen 2.5 7B and GPT-4o-mini on faithfulness, latency, and cost. Served in-VPC
  via vLLM (no PHI egress).
- **Eval harness** — precision@recall, ROC-AUC, FNR parity by provider
  claim-volume tier, PSI/KS drift, LLM-as-judge for narrative quality.

## Request flow

```
Provider (claim aggregates)
   │
   ▼
LightGBM ─── p ∈ [0, 0.35) ──► Decision: clear (auto-cleared)
   │
   ├─── p ∈ (0.65, 1] ────────► Decision: investigate (auto-referred)
   │
   └─── p ∈ [0.35, 0.65] ──► Llama 3.1 8B + LoRA ──► Decision: review (SIU)
```

See `frontend/src/components/ArchitectureDiagram.tsx` for the rendered SVG.
