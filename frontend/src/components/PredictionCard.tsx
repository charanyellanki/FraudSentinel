import type { PredictionResponse } from "@/lib/types";
import { Badge, labelTone } from "./ui/Badge";

export function PredictionCard({ prediction }: { prediction: PredictionResponse }) {
  const p = prediction.fraud_probability;
  const pct = (p * 100).toFixed(1);
  const conf = (prediction.confidence * 100).toFixed(0);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <div className="flex items-start justify-between border-b border-zinc-100 px-5 py-4">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Decision
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-2xl font-semibold capitalize tracking-tight2 text-zinc-900">
              {prediction.decision}
            </span>
            <Badge tone={labelTone(prediction.decision)}>{prediction.decision}</Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Fraud probability
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold tracking-tight text-zinc-900">
            {pct}%
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        <ProbabilityBar probability={p} low={prediction.routing.low_threshold} high={prediction.routing.high_threshold} />
      </div>

      <div className="grid grid-cols-3 divide-x divide-zinc-100 border-t border-zinc-100 text-center">
        <Stat label="Confidence" value={`${conf}%`} />
        <Stat label="Latency" value={`${prediction.latency_ms.toFixed(1)} ms`} />
        <Stat label="Model" value={prediction.model_version} mono />
      </div>
    </div>
  );
}

function Stat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-3 py-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`mt-1 truncate text-sm font-semibold text-zinc-900 ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function ProbabilityBar({ probability, low, high }: { probability: number; low: number; high: number }) {
  return (
    <div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        {/* Borderline band */}
        <div
          className="absolute inset-y-0 bg-amber-100"
          style={{ left: `${low * 100}%`, right: `${(1 - high) * 100}%` }}
        />
        {/* Pointer */}
        <div
          className="absolute -top-1 h-4 w-0.5 bg-zinc-900"
          style={{ left: `calc(${probability * 100}% - 1px)` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] font-medium text-zinc-400">
        <span>0.0</span>
        <span className="text-amber-700">{low.toFixed(2)} ──── borderline ──── {high.toFixed(2)}</span>
        <span>1.0</span>
      </div>
    </div>
  );
}
