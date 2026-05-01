import type { ShapExplanation } from "@/lib/types";

/**
 * SHAP waterfall in log-odds space. Bars are colored red (positive
 * contribution → pushes toward fraud) or green (negative → pushes toward legit).
 */
export function ShapWaterfall({ shap }: { shap: ShapExplanation }) {
  const sorted = [...shap.contributions].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  const max = Math.max(...sorted.map((c) => Math.abs(c.contribution)));

  const finalLogit = shap.base_value + sorted.reduce((acc, c) => acc + c.contribution, 0);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-100 px-5 py-4">
        <h3 className="text-sm font-semibold tracking-tight2 text-zinc-900">Top SHAP contributions</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Log-odds attributions from LightGBM TreeExplainer. Base value{" "}
          <span className="font-mono">{shap.base_value.toFixed(2)}</span> → final logit{" "}
          <span className="font-mono">{finalLogit.toFixed(2)}</span>.
        </p>
      </div>
      <div className="px-5 py-4">
        <ul className="space-y-2.5">
          {sorted.map((c) => {
            const positive = c.contribution > 0;
            const widthPct = (Math.abs(c.contribution) / max) * 50;
            return (
              <li key={c.feature} className="flex items-center gap-3">
                <div className="w-44 truncate font-mono text-[11px] text-zinc-700">{c.feature}</div>
                <div className="relative flex-1">
                  <div className="relative h-5 w-full bg-zinc-50">
                    <div className="absolute inset-y-0 left-1/2 w-px bg-zinc-300" />
                    <div
                      className={`absolute inset-y-0 ${
                        positive ? "left-1/2 bg-rose-400" : "right-1/2 bg-emerald-400"
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right font-mono text-[11px] text-zinc-700">
                  {positive ? "+" : ""}
                  {c.contribution.toFixed(3)}
                </div>
                <div className="hidden w-20 text-right font-mono text-[10px] text-zinc-400 sm:block">
                  v={typeof c.value === "number" ? c.value.toFixed(2) : c.value}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex items-center gap-4 text-[10px] text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-400" />
            pushes toward legit
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-rose-400" />
            pushes toward fraud
          </span>
        </div>
      </div>
    </div>
  );
}
