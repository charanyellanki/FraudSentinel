import type { ModelComparison } from "@/lib/types";
import { Badge } from "./ui/Badge";

export function ModelComparisonTable({ comparison }: { comparison: ModelComparison }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50/60">
          <tr className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            <th className="px-5 py-3">Model</th>
            <th className="px-5 py-3 text-right">ROC-AUC</th>
            <th className="px-5 py-3 text-right">PR-AUC</th>
            <th className="px-5 py-3 text-right">F1</th>
            <th className="px-5 py-3 text-right">Train (s)</th>
            <th className="px-5 py-3 text-right">p50 / p95 (ms)</th>
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
                    {isWinner && <Badge tone="info">winner</Badge>}
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-500">{m.notes}</div>
                </td>
                <td className="px-5 py-3 text-right font-mono text-sm tabular-nums text-zinc-900">
                  {m.roc_auc.toFixed(4)}
                </td>
                <td className="px-5 py-3 text-right font-mono text-sm tabular-nums text-zinc-700">
                  {m.pr_auc.toFixed(4)}
                </td>
                <td className="px-5 py-3 text-right font-mono text-sm tabular-nums text-zinc-700">
                  {m.f1.toFixed(4)}
                </td>
                <td className="px-5 py-3 text-right font-mono text-sm tabular-nums text-zinc-700">
                  {m.train_time_s.toFixed(1)}
                </td>
                <td className="px-5 py-3 text-right font-mono text-sm tabular-nums text-zinc-700">
                  {m.inference_p50_ms.toFixed(1)} / {m.inference_p95_ms.toFixed(1)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
