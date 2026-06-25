"""
Compute headline evaluation metrics for the production provider-FWA model.

Outputs `eval_metrics.json` consumed by the API. Includes:
- ROC-AUC, PR-AUC (PR-AUC is the headline metric given ~9% fraud prevalence)
- Precision @ recall = 0.5 and 0.8
- F1, FNR, FPR at the operating threshold
- Full confusion matrix (provider counts)
- 20-point sampled ROC + PR curves (for frontend Recharts display)
"""


def main() -> None:
    raise NotImplementedError("Evaluation metrics computation scheduled for the next session.")


if __name__ == "__main__":
    main()
