import type { RoutingDecision } from "@/lib/types";

export function ConfidenceRouterViz({ routing }: { routing: RoutingDecision }) {
  const escalated = routing.path === "llm_escalated";
  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-100 px-5 py-4">
        <h3 className="text-sm font-semibold tracking-tight2 text-zinc-900">Routing decision</h3>
        <p className="mt-1 text-xs text-zinc-500">{routing.reason}</p>
      </div>
      <div className="px-5 py-4">
        <div className="relative h-12">
          <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-zinc-100" />
          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-amber-200"
            style={{
              left: `${routing.low_threshold * 100}%`,
              right: `${(1 - routing.high_threshold) * 100}%`,
            }}
          />
          <div
            className="absolute -top-0.5 h-12 w-0.5 bg-zinc-900"
            style={{ left: `calc(${routing.probability * 100}% - 1px)` }}
          />
          <div
            className="absolute -bottom-1 -translate-x-1/2 text-[10px] font-mono font-medium text-zinc-700"
            style={{ left: `${routing.probability * 100}%` }}
          >
            p={routing.probability.toFixed(3)}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px]">
          <Lane label="approve" active={!escalated && routing.probability < routing.low_threshold} tone="success" />
          <Lane label="LLM review" active={escalated} tone="warning" />
          <Lane label="decline" active={!escalated && routing.probability > routing.high_threshold} tone="danger" />
        </div>
      </div>
    </div>
  );
}

function Lane({ label, active, tone }: { label: string; active: boolean; tone: "success" | "warning" | "danger" }) {
  const TONE = {
    success: active ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-zinc-200 bg-white text-zinc-500",
    warning: active ? "border-amber-300 bg-amber-50 text-amber-800" : "border-zinc-200 bg-white text-zinc-500",
    danger: active ? "border-rose-300 bg-rose-50 text-rose-800" : "border-zinc-200 bg-white text-zinc-500",
  }[tone];
  return (
    <div className={`rounded-md border px-2 py-1.5 font-medium uppercase tracking-wider transition ${TONE}`}>
      {label}
    </div>
  );
}
