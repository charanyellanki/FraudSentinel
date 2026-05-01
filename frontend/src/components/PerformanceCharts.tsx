import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { EvalMetrics } from "@/lib/types";

const AXIS_TICK = { fontSize: 11, fill: "#71717a" };

export function PerformanceCharts({ metrics }: { metrics: EvalMetrics }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="ROC curve"
        subtitle={`Area under curve · ${metrics.roc_auc.toFixed(4)}`}
      >
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={metrics.roc_curve} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="rocFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f4f4f5" />
            <XAxis dataKey="x" type="number" domain={[0, 1]} tick={AXIS_TICK} stroke="#e4e4e7" label={{ value: "FPR", position: "insideBottom", offset: -2, style: { fontSize: 11, fill: "#a1a1aa" } }} />
            <YAxis type="number" domain={[0, 1]} tick={AXIS_TICK} stroke="#e4e4e7" label={{ value: "TPR", angle: -90, position: "insideLeft", offset: 18, style: { fontSize: 11, fill: "#a1a1aa" } }} />
            <Tooltip formatter={(v: number) => v.toFixed(3)} labelFormatter={(l: number) => `FPR ${l.toFixed(3)}`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Area type="monotone" dataKey="y" stroke="#6366f1" strokeWidth={2} fill="url(#rocFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Precision–Recall curve"
        subtitle={`Area under curve · ${metrics.pr_auc.toFixed(4)} · operating threshold ${metrics.threshold}`}
      >
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={metrics.pr_curve} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="#f4f4f5" />
            <XAxis dataKey="x" type="number" domain={[0, 1]} tick={AXIS_TICK} stroke="#e4e4e7" label={{ value: "Recall", position: "insideBottom", offset: -2, style: { fontSize: 11, fill: "#a1a1aa" } }} />
            <YAxis type="number" domain={[0, 1]} tick={AXIS_TICK} stroke="#e4e4e7" label={{ value: "Precision", angle: -90, position: "insideLeft", offset: 18, style: { fontSize: 11, fill: "#a1a1aa" } }} />
            <Tooltip formatter={(v: number) => v.toFixed(3)} labelFormatter={(l: number) => `Recall ${l.toFixed(3)}`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={2} dot={false} />
            <ReferenceDot x={0.5} y={metrics["precision@recall=0.5"]} r={3} fill="#10b981" stroke="white" />
            <ReferenceDot x={0.8} y={metrics["precision@recall=0.8"]} r={3} fill="#10b981" stroke="white" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <KeyStats metrics={metrics} />
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-100 px-5 py-4">
        <h3 className="text-sm font-semibold tracking-tight2 text-zinc-900">{title}</h3>
        <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function KeyStats({ metrics }: { metrics: EvalMetrics }) {
  const cm = metrics.confusion_matrix;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white lg:col-span-2">
      <div className="border-b border-zinc-100 px-5 py-4">
        <h3 className="text-sm font-semibold tracking-tight2 text-zinc-900">Key metrics @ operating threshold</h3>
        <p className="mt-0.5 text-xs text-zinc-500">Threshold {metrics.threshold} · Held-out test set ({(cm.tp + cm.fp + cm.tn + cm.fn).toLocaleString()} txs)</p>
      </div>
      <div className="grid grid-cols-2 gap-px bg-zinc-100 sm:grid-cols-6">
        <KV label="ROC-AUC" value={metrics.roc_auc.toFixed(4)} />
        <KV label="PR-AUC" value={metrics.pr_auc.toFixed(4)} />
        <KV label="P @ R=0.5" value={metrics["precision@recall=0.5"].toFixed(3)} />
        <KV label="P @ R=0.8" value={metrics["precision@recall=0.8"].toFixed(3)} />
        <KV label="F1" value={metrics.f1.toFixed(3)} />
        <KV label="FNR" value={metrics.fnr.toFixed(3)} />
        <KV label="True Pos" value={cm.tp.toLocaleString()} />
        <KV label="False Pos" value={cm.fp.toLocaleString()} />
        <KV label="True Neg" value={cm.tn.toLocaleString()} />
        <KV label="False Neg" value={cm.fn.toLocaleString()} />
        <KV label="FPR" value={metrics.fpr.toFixed(4)} />
        <KV label="Threshold" value={metrics.threshold.toFixed(2)} />
      </div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-4 py-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-1 font-mono text-sm font-semibold tabular-nums text-zinc-900">{value}</div>
    </div>
  );
}
