import { useEffect, useState } from "react";

import { ArchitectureDiagram } from "./components/ArchitectureDiagram";
import { ConfidenceRouterViz } from "./components/ConfidenceRouterViz";
import { DriftChart } from "./components/DriftChart";
import { FairnessChart } from "./components/FairnessChart";
import { Hero } from "./components/Hero";
import { ModelComparisonTable } from "./components/ModelComparisonTable";
import { PerformanceCharts } from "./components/PerformanceCharts";
import { PredictionCard } from "./components/PredictionCard";
import { RationaleDisplay } from "./components/RationaleDisplay";
import { ShapWaterfall } from "./components/ShapWaterfall";
import { TransactionPicker } from "./components/TransactionPicker";
import { ErrorNotice, Skeleton, WarmingNotice } from "./components/ui/Skeleton";
import { Section } from "./components/ui/Section";
import { useApi } from "./hooks/useApi";
import { api } from "./lib/api";
import type { PredictionResponse } from "./lib/types";

export default function App() {
  const transactionsState = useApi(() => api.getDemoTransactions(), []);
  const metricsState = useApi(() => api.getMetrics(), []);
  const comparisonState = useApi(() => api.getModelComparison(), []);
  const driftState = useApi(() => api.getDrift(), []);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [predictError, setPredictError] = useState<Error | null>(null);

  // Auto-select the first borderline transaction once data loads — this is the
  // most demonstrative case (LLM gets escalated).
  useEffect(() => {
    if (selectedId || !transactionsState.data) return;
    const firstBorderline = transactionsState.data.find((tx) => tx.predicted_label === "borderline");
    if (firstBorderline) setSelectedId(firstBorderline.transaction_id);
  }, [transactionsState.data, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    setPredicting(true);
    setPredictError(null);
    api
      .predict(selectedId)
      .then((p) => setPrediction(p))
      .catch((err: Error) => setPredictError(err))
      .finally(() => setPredicting(false));
  }, [selectedId]);

  return (
    <div className="min-h-screen">
      <Hero />
      <main>
        <ArchitectureDiagram />

        <Section
          id="live-prediction"
          eyebrow="Live prediction"
          title="Pick a transaction. Watch the router decide who handles it."
          description="Cached fixture data for now — the API contract and routing logic are real, the LightGBM model and Llama LoRA are in progress. The dashboard will hot-swap to live model outputs once training completes."
        >
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              {transactionsState.warming && <div className="mb-3"><WarmingNotice /></div>}
              {transactionsState.error ? (
                <ErrorNotice error={transactionsState.error} />
              ) : transactionsState.loading || !transactionsState.data ? (
                <Skeleton className="h-[420px] w-full" />
              ) : (
                <TransactionPicker
                  transactions={transactionsState.data}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              )}
            </div>

            <div className="space-y-4 lg:col-span-7">
              {predictError ? (
                <ErrorNotice error={predictError} />
              ) : !selectedId || predicting || !prediction ? (
                <>
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-40 w-full" />
                </>
              ) : (
                <>
                  <PredictionCard prediction={prediction} />
                  <ConfidenceRouterViz routing={prediction.routing} />
                  <ShapWaterfall shap={prediction.shap} />
                  {prediction.rationale && <RationaleDisplay rationale={prediction.rationale} />}
                </>
              )}
            </div>
          </div>
        </Section>

        <Section
          id="model-comparison"
          eyebrow="Benchmarks"
          title="Why LightGBM."
          description="Four candidate models trained on the IEEE-CIS dataset with identical preprocessing. Selection criteria: ROC-AUC ≥ 0.94 and inference latency p95 < 5ms."
        >
          {comparisonState.error ? (
            <ErrorNotice error={comparisonState.error} />
          ) : comparisonState.loading || !comparisonState.data ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ModelComparisonTable comparison={comparisonState.data} />
          )}
        </Section>

        <Section
          id="performance"
          eyebrow="Performance"
          title="Held-out evaluation."
          description={`Evaluated on a stratified 10% test split. Operating threshold tuned for ${"precision@recall=0.8"}.`}
        >
          {metricsState.error ? (
            <ErrorNotice error={metricsState.error} />
          ) : metricsState.loading || !metricsState.data ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <Skeleton className="h-72 w-full" />
              <Skeleton className="h-72 w-full" />
              <Skeleton className="h-32 w-full lg:col-span-2" />
            </div>
          ) : (
            <PerformanceCharts metrics={metricsState.data} />
          )}
        </Section>

        <Section
          id="fairness"
          eyebrow="Fairness"
          title="False-negative parity across merchant categories."
          description="A high-AUC model can still systematically miss fraud in specific verticals. We monitor false-negative rate by ProductCD and treat any sub-segment with FNR > overall + 0.05 as a deployment blocker."
        >
          {metricsState.error ? (
            <ErrorNotice error={metricsState.error} />
          ) : metricsState.loading || !metricsState.data ? (
            <Skeleton className="h-72 w-full" />
          ) : (
            <FairnessChart fnrByMerchant={metricsState.data.fnr_by_merchant} />
          )}
        </Section>

        <Section
          id="drift"
          eyebrow="Monitoring"
          title="Population drift over time."
          description="PSI and KS p-values for the top-20 features across 4 successive deployment windows, all compared to the training reference window. Triggers retraining when overall PSI exceeds 0.20."
        >
          {driftState.error ? (
            <ErrorNotice error={driftState.error} />
          ) : driftState.loading || !driftState.data ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <DriftChart drift={driftState.data} />
          )}
        </Section>
      </main>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10 text-xs text-zinc-500 sm:flex sm:items-center sm:justify-between">
        <div>
          FraudSentinel · Open-source MIT · Built by{" "}
          <a className="font-medium text-zinc-700 hover:text-accent-600" href="https://github.com/charanyellanki">
            Charan Yellanki
          </a>
        </div>
        <div className="mt-3 flex items-center gap-4 sm:mt-0">
          <a href="https://github.com/charanyellanki/fraudsentinel" className="hover:text-zinc-700">GitHub</a>
          <a href="#architecture" className="hover:text-zinc-700">Architecture</a>
          <a href="/docs" className="hover:text-zinc-700">API docs</a>
        </div>
      </div>
    </footer>
  );
}
