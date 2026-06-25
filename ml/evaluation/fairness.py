"""
False-negative-rate parity check across provider claim-volume tiers.

Plan
----
- Bucket providers into volume quintiles (Q1 lowest … Q5 highest) by n_claims.
- Compute FNR for each tier on the held-out provider set at the production
  operating threshold.
- Flag any tier where FNR exceeds (overall_FNR + 0.05) as a deployment blocker:
  missed FWA should not concentrate in low-volume providers (easily overlooked)
  or high-volume providers (high recovery impact).
- Write per-tier numbers into `eval_metrics.json:fnr_by_volume_tier`.

Future extensions: parity by provider state, by inpatient/outpatient mix,
by beneficiary chronic-condition burden.
"""


def main() -> None:
    raise NotImplementedError("Fairness audit scheduled for the next session.")


if __name__ == "__main__":
    main()
