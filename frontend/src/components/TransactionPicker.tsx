import { useMemo, useState } from "react";

import { labelTone } from "@/lib/tone";
import type { DemoTransactionSummary, PredictedLabel } from "@/lib/types";

import { Badge } from "./ui/Badge";

const FILTERS: { key: "all" | PredictedLabel; label: string }[] = [
  { key: "all", label: "All" },
  { key: "legit", label: "Legit" },
  { key: "borderline", label: "Borderline" },
  { key: "fraud", label: "Fraud" },
];

interface Props {
  transactions: DemoTransactionSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TransactionPicker({ transactions, selectedId, onSelect }: Props) {
  const [filter, setFilter] = useState<"all" | PredictedLabel>("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: transactions.length, legit: 0, borderline: 0, fraud: 0 };
    transactions.forEach((tx) => (c[tx.predicted_label] = (c[tx.predicted_label] ?? 0) + 1));
    return c;
  }, [transactions]);

  const filtered = useMemo(
    () => (filter === "all" ? transactions : transactions.filter((tx) => tx.predicted_label === filter)),
    [transactions, filter],
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === f.key
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:text-zinc-900"
            }`}
          >
            {f.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                filter === f.key ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {counts[f.key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="grid max-h-[420px] grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 p-2 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((tx) => {
          const isSelected = tx.transaction_id === selectedId;
          return (
            <button
              key={tx.transaction_id}
              type="button"
              onClick={() => onSelect(tx.transaction_id)}
              className={`group rounded-md border bg-white px-3 py-2.5 text-left transition ${
                isSelected
                  ? "border-accent-500 ring-2 ring-accent-200"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-zinc-500">{tx.transaction_id}</span>
                <Badge tone={labelTone(tx.predicted_label)}>{tx.predicted_label}</Badge>
              </div>
              <div className="mt-1.5 text-base font-semibold tracking-tight text-zinc-900">
                ${tx.amount.toFixed(2)}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
                <span className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[10px] text-zinc-600">
                  {tx.product_code}
                </span>
                <span>{tx.card_network}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
