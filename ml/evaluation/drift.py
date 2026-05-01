"""
Population stability monitoring.

Plan
----
For each feature in the top-20 importance list:
- Bin reference-window distribution into 10 quantile buckets.
- Compute PSI(reference, comparison) per bucket; sum.
- Compute KS test p-value on the raw distributions.
- Status: stable (PSI < 0.10), warning (0.10 ≤ PSI < 0.20), drift (PSI ≥ 0.20).

Run on a rolling 14-day comparison window, anchored to the training
reference window. Write `drift_report.json` consumed by the API.

Triggers retraining when overall PSI exceeds 0.20 in two consecutive windows.
"""


def main() -> None:
    raise NotImplementedError("Drift monitoring scheduled for the next session.")


if __name__ == "__main__":
    main()
