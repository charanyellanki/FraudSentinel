"""
Population stability monitoring for the provider-FWA feature set.

Plan
----
For each feature in the top-20 importance list (reimbursed_per_beneficiary,
claims_per_beneficiary, inpatient_ratio, coding-concentration features, …):
- Bin reference-window distribution into 10 quantile buckets.
- Compute PSI(reference, comparison) per bucket; sum.
- Compute KS test p-value on the raw distributions.
- Status: stable (PSI < 0.10), warning (0.10 ≤ PSI < 0.20), drift (PSI ≥ 0.20).

Run on a rolling quarterly comparison window of newly-submitted claims,
anchored to the training reference window. Write `drift_report.json` consumed
by the API.

Triggers retraining when overall PSI exceeds 0.20 in two consecutive windows —
billing-pattern shifts (e.g. new CPT codes, reimbursement-policy changes) are
the main driver of provider-FWA model decay.
"""


def main() -> None:
    raise NotImplementedError("Drift monitoring scheduled for the next session.")


if __name__ == "__main__":
    main()
