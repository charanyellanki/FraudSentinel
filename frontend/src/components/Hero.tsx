export function Hero() {
  return (
    <header className="relative overflow-hidden border-b border-zinc-200/70 bg-gradient-to-b from-white to-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="flex items-center gap-2 text-xs font-medium text-accent-700">
          <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-accent-500" />
          Hybrid tabular + LLM healthcare FWA detection
        </div>
        <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight2 text-zinc-900 sm:text-5xl">
          A LightGBM provider scorer with a Llama 3.1 second opinion — only when it matters.
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-base text-zinc-600 sm:text-lg">
          FraudSentinel scores Medicare providers for fraud, waste &amp; abuse in &lt;3ms with LightGBM.
          Borderline providers inside the uncertainty band are escalated to a QLoRA-fine-tuned Llama 3.1 8B
          that turns SHAP attributions into an investigator-ready audit narrative for SIU review. Built on the
          CMS / Kaggle Healthcare Provider Fraud dataset.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-xs">
          <a
            href="#live-prediction"
            className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-700"
          >
            Try a live prediction →
          </a>
          <a
            href="https://github.com/charanyellanki/fraudsentinel"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
          >
            View source on GitHub
          </a>
        </div>
        <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
          {[
            ["Tabular model", "LightGBM"],
            ["LLM rationale", "Llama 3.1 8B + LoRA"],
            ["Domain", "Medicare provider FWA"],
            ["Routing", "Confidence → SIU"],
          ].map(([label, value]) => (
            <div key={label} className="border-l border-zinc-200 pl-4">
              <dt className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">{label}</dt>
              <dd className="mt-1 text-sm font-semibold text-zinc-900">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
