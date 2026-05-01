"""
False-negative-rate parity check across merchant categories (ProductCD).

Plan
----
- Compute FNR for each ProductCD slice on the held-out test set at the
  production operating threshold.
- Flag any slice where FNR exceeds (overall_FNR + 0.05) as a deployment
  blocker.
- Write per-slice numbers into `eval_metrics.json:fnr_by_merchant`.

Future extensions: parity by card_network, by addr2 region, by amount decile.
"""


def main() -> None:
    raise NotImplementedError("Fairness audit scheduled for the next session.")


if __name__ == "__main__":
    main()
