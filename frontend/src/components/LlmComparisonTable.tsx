import type { LlmComparison } from "@/lib/types";

import { Badge } from "./ui/Badge";

export function LlmComparisonTable({ comparison }: { comparison: LlmComparison }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50/60">
          <tr className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            <th className="px-5 py-3">Rationale model</th>
            <th className="px-5 py-3 text-right">Faithfulness</th>
            <th className="px-5 py-3 text-right">p50 / p95 (ms)</th>
            <th className="px-5 py-3 text-right">$ / 1K</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {comparison.models.map((m) => {
            const isWinner = m.name === comparison.winner;
            return (
              <tr key={m.name} className={isWinner ? "bg-accent-50/40" : ""}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-900">{m.name}</span>
                    {isWinner && <Badge tone="info">deployed</Badge>}
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-500">{m.notes}</div>
                  <div className="mt-1 text-[10px] font-mono text-zinc-400">{m.deployment}</div>
                </td>
                <td className="px-5 py-3 text-right font-mono text-sm tabular-nums text-zinc-900">
                  {m.faithfulness.toFixed(2)}
                  <span className="text-[10px] text-zinc-400"> / 5</span>
                </td>
                <td className="px-5 py-3 text-right font-mono text-sm tabular-nums text-zinc-700">
                  {m.p50_latency_ms.toFixed(0)} / {m.p95_latency_ms.toFixed(0)}
                </td>
                <td className="px-5 py-3 text-right font-mono text-sm tabular-nums text-zinc-700">
                  ${m.cost_per_1k_usd.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="border-t border-zinc-100 px-5 py-3 text-[11px] text-zinc-500">
        Faithfulness scored by {comparison.judge_model} over {comparison.n_samples} borderline cases ·{" "}
        {comparison.rubric_scale}
      </div>
    </div>
  );
}
