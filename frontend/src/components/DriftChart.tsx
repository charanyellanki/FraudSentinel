import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { DriftReport } from "@/lib/types";
import { Badge, labelTone } from "./ui/Badge";

export function DriftChart({ drift }: { drift: DriftReport }) {
  const [selectedFeature, setSelectedFeature] = useState<string>("TransactionAmt");

  const overallSeries = useMemo(
    () =>
      drift.windows.map((w) => ({
        window: w.window_label,
        psi: w.overall_psi,
      })),
    [drift],
  );

  const featureNames = useMemo(
    () => Array.from(new Set(drift.windows.flatMap((w) => w.features.map((f) => f.feature)))),
    [drift],
  );

  const featureSeries = useMemo(
    () =>
      drift.windows.map((w) => {
        const feat = w.features.find((f) => f.feature === selectedFeature);
        return {
          window: w.window_label,
          psi: feat?.psi ?? 0,
          status: feat?.status ?? "stable",
        };
      }),
    [drift, selectedFeature],
  );

  const latestWindow = drift.windows[drift.windows.length - 1];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-zinc-200 bg-white lg:col-span-2">
        <div className="border-b border-zinc-100 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold tracking-tight2 text-zinc-900">Population Stability Index (PSI)</h3>
              <p className="mt-0.5 text-xs text-zinc-500">
                Overall vs <span className="font-medium">{selectedFeature}</span>. Threshold 0.10 = warning, 0.20 = drift.
              </p>
            </div>
            <select
              className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-100"
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value)}
            >
              {featureNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-3">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={featureSeries} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
              <CartesianGrid stroke="#f4f4f5" vertical={false} />
              <XAxis dataKey="window" tick={{ fontSize: 10, fill: "#71717a" }} stroke="#e4e4e7" />
              <YAxis tick={{ fontSize: 11, fill: "#71717a" }} stroke="#e4e4e7" tickFormatter={(v) => v.toFixed(2)} />
              <Tooltip formatter={(v: number) => v.toFixed(4)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <ReferenceLine y={0.1} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "warning", position: "right", fontSize: 10, fill: "#d97706" }} />
              <ReferenceLine y={0.2} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: "drift", position: "right", fontSize: 10, fill: "#e11d48" }} />
              <Line type="monotone" dataKey="psi" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: "#6366f1" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4">
          <h3 className="text-sm font-semibold tracking-tight2 text-zinc-900">Most recent window</h3>
          <p className="mt-0.5 text-xs text-zinc-500">{latestWindow.window_label}</p>
        </div>
        <div className="max-h-[260px] overflow-y-auto p-3">
          <ul className="space-y-1.5 text-xs">
            {[...latestWindow.features]
              .sort((a, b) => b.psi - a.psi)
              .slice(0, 12)
              .map((f) => (
                <li key={f.feature} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-zinc-50">
                  <span className="font-mono text-[11px] text-zinc-700">{f.feature}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] tabular-nums text-zinc-600">{f.psi.toFixed(3)}</span>
                    <Badge tone={labelTone(f.status)}>{f.status}</Badge>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white lg:col-span-3">
        <div className="border-b border-zinc-100 px-5 py-4">
          <h3 className="text-sm font-semibold tracking-tight2 text-zinc-900">Overall PSI trajectory</h3>
        </div>
        <div className="p-3">
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={overallSeries} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
              <CartesianGrid stroke="#f4f4f5" vertical={false} />
              <XAxis dataKey="window" tick={{ fontSize: 10, fill: "#71717a" }} stroke="#e4e4e7" />
              <YAxis tick={{ fontSize: 11, fill: "#71717a" }} stroke="#e4e4e7" tickFormatter={(v) => v.toFixed(2)} />
              <Tooltip formatter={(v: number) => v.toFixed(4)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <ReferenceLine y={0.1} stroke="#f59e0b" strokeDasharray="4 4" />
              <ReferenceLine y={0.2} stroke="#f43f5e" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="psi" stroke="#52525b" strokeWidth={2} dot={{ r: 4, fill: "#52525b" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
