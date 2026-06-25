import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function FairnessChart({ fnrByVolumeTier }: { fnrByVolumeTier: Record<string, number> }) {
  const data = Object.entries(fnrByVolumeTier).map(([tier, fnr]) => ({
    category: tier,
    fnr,
  }));
  const overall = data.reduce((acc, d) => acc + d.fnr, 0) / data.length;
  const maxDeviation = Math.max(...data.map((d) => Math.abs(d.fnr - overall)));

  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-100 px-5 py-4">
        <h3 className="text-sm font-semibold tracking-tight2 text-zinc-900">FNR parity across provider volume tiers</h3>
        <p className="mt-1 text-xs text-zinc-500">
          False-negative rate by provider claim-volume quintile. Mean {overall.toFixed(3)}, max deviation ±
          {maxDeviation.toFixed(3)}. Disparities &gt; 0.05 absolute should trigger an investigation — missed FWA
          should not concentrate in low-volume (easily overlooked) or high-volume (high-impact) providers.
        </p>
      </div>
      <div className="p-3">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="#f4f4f5" vertical={false} />
            <XAxis dataKey="category" tick={{ fontSize: 10, fill: "#71717a" }} stroke="#e4e4e7" interval={0} />
            <YAxis tick={{ fontSize: 11, fill: "#71717a" }} stroke="#e4e4e7" tickFormatter={(v) => v.toFixed(2)} />
            <Tooltip formatter={(v: number) => v.toFixed(4)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar dataKey="fnr" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => (
                <Cell
                  key={i}
                  fill={Math.abs(d.fnr - overall) > 0.05 ? "#f59e0b" : "#6366f1"}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
