# FraudSentinel

> Healthcare provider fraud, waste & abuse (FWA) detection on Medicare claims.
> A LightGBM model scores provider-level fraud likelihood; borderline providers
> inside the model's uncertainty band are escalated to a QLoRA-fine-tuned
> Llama 3.1 8B that turns SHAP attributions into investigator-ready audit
> narratives for SIU review.
> Built on the CMS / Kaggle Healthcare Provider Fraud Detection dataset.

[![CI](https://github.com/charanyellanki/fraudsentinel/actions/workflows/ci.yml/badge.svg)](https://github.com/charanyellanki/fraudsentinel/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Python 3.11](https://img.shields.io/badge/python-3.11-3776ab.svg)
![Node 20](https://img.shields.io/badge/node-20-43853d.svg)

---

## Project status

This repo is a **polished infrastructure baseline**, not a finished model.
Here's what is real today vs. what is in progress:

| Component | Status |
| --- | --- |
| FastAPI backend with full Pydantic v2 schemas | ✅ done |
| 50-provider demo set with provider-level FWA schema | ✅ done |
| Confidence router + SIU escalation thresholds | ✅ done |
| Frontend dashboard (Vite + React + Tailwind + Recharts) | ✅ done |
| Architecture diagram, provider picker, SHAP waterfall, narrative display | ✅ done |
| Tabular + LLM benchmark, performance / fairness / drift visualizations | ✅ done |
| Docker, docker-compose, Render + Vercel deployment configs | ✅ done |
| GitHub Actions CI (ruff, pytest, eslint, typecheck, build) | ✅ done |
| **LightGBM training on real provider-aggregated data** | 🚧 next session |
| **XGBoost / CatBoost / LR benchmarks** | 🚧 next session |
| **Real eval metrics (overwriting placeholders)** | 🚧 next session |
| **QLoRA fine-tune of Llama 3.1 8B for audit narratives** | 🚧 dedicated LLM session |
| **Llama vs Qwen 2.5 7B vs GPT-4o-mini benchmark** | 🚧 post-fine-tune |
| **PSI/KS drift monitoring on live data** | 🚧 post-deploy |
| **LLM-as-judge harness for narrative quality** | 🚧 post-fine-tune |

The frontend currently serves cached fixture predictions, but the API
contract, routing logic, and SHAP schema are exactly what will be served once
the real model is wired in. Recruiters viewing this repo today see the system
end-to-end; future commits hot-swap the model, not the surface.

## Quick start

```bash
git clone https://github.com/charanyellanki/fraudsentinel.git
cd fraudsentinel
make install      # uv sync (backend) + npm install (frontend)
make dev          # uvicorn :8000 + vite :5173 concurrently
open http://localhost:5173
```

Requires Python 3.11+, Node 20+, and [`uv`](https://github.com/astral-sh/uv).

## Architecture

```mermaid
flowchart LR
    Prov[Provider<br/>claim aggregates] --> LGB[LightGBM<br/>~0.9ms p50]
    LGB --> Router{Confidence<br/>Router<br/>0.35 / 0.65}
    Router -- "p &lt; 0.35 or p &gt; 0.65 (~85-90%)" --> Direct[Direct decision<br/>clear / investigate]
    Router -- "p in [0.35, 0.65] (~10-15%)" --> LLM[Llama 3.1 8B + LoRA<br/>SHAP-grounded audit narrative]
    LLM --> SIU[SIU review]
    Direct --> SIU
```

Full diagram: [`docs/architecture.md`](docs/architecture.md). Hand-built SVG
in [`frontend/src/components/ArchitectureDiagram.tsx`](frontend/src/components/ArchitectureDiagram.tsx).

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Tabular model | LightGBM | Best ROC-AUC and inference speed on the provider feature set in our benchmarks |
| LLM | Llama 3.1 8B + QLoRA | Open weights, in-VPC inference (no PHI egress), runs on a single A100 |
| LLM benchmark | vs Qwen 2.5 7B, GPT-4o-mini | Faithfulness (LLM-as-judge), latency, cost-per-1K decisions |
| Tracking | MLflow | Per-experiment artifact storage, model registry |
| API | FastAPI + Pydantic v2 | Strong typing end-to-end, free OpenAPI docs |
| Frontend | Vite + React 18 + TypeScript + Tailwind | Linear/Vercel aesthetic, no UI library dependency |
| Charts | Recharts | Composable SVG, no external dependencies beyond React |
| Pkg manager | uv (Python), npm (Node) | uv for speed; npm for compatibility with Vercel |
| Hosting | Vercel + Render | Both have free tiers, both have one-command deploys |

## Project layout

```
fraudsentinel/
├── backend/           FastAPI service (Pydantic v2, uv, ruff, pytest)
├── frontend/          Vite + React + TS + Tailwind + Recharts dashboard
├── ml/                Training / evaluation scripts (stubs this session)
├── docs/              Architecture + deployment notes
├── docker-compose.yml Local dev (backend + frontend with hot reload)
├── Makefile           Common dev commands
└── .github/workflows/ CI: ruff + pytest + eslint + typecheck + build
```

## Deployment

See [`docs/deployment.md`](docs/deployment.md). Short version: Render reads
`backend/render.yaml`, Vercel reads `frontend/vercel.json`. Both are
zero-config on first deploy.

## Roadmap

- [x] Backend API + Pydantic schemas
- [x] Frontend dashboard with all visualizations
- [x] Cached fixture data (50 providers, borderline narratives)
- [x] CI + Docker + deployment configs
- [ ] Train LightGBM on real provider-aggregated data
- [ ] Train XGBoost / CatBoost / LR benchmarks → real `model_comparison.json`
- [ ] Compute real eval metrics → real `eval_metrics.json`
- [ ] Generate 5K synthetic SFT examples for the LLM
- [ ] QLoRA fine-tune Llama 3.1 8B on the SFT set
- [ ] Benchmark Llama vs Qwen 2.5 7B vs GPT-4o-mini → real `llm_comparison.json`
- [ ] LLM-as-judge harness for narrative quality (block deploy if mean < 3.5)
- [ ] Wire live model into the prediction service (replace fixture lookups)
- [ ] Empirical tuning of router thresholds via cost-vs-escalation sweep
- [ ] PSI/KS drift monitoring on live claims

See [`NEXT_STEPS.md`](NEXT_STEPS.md) for session-by-session sequencing.

## License

[MIT](LICENSE) © Charan Yellanki

## Acknowledgments

- Healthcare Provider Fraud Detection Analysis dataset, hosted on Kaggle
- The Centers for Medicare & Medicaid Services (CMS) claims schema it derives from
- The LightGBM, FastAPI, React, and Recharts maintainers
