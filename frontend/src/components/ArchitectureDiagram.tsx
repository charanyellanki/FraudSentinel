import { Section } from "./ui/Section";

/**
 * Hand-built SVG architecture diagram. Designed to read at thumbnail size
 * for use as a README screenshot / LinkedIn share image.
 */
export function ArchitectureDiagram() {
  return (
    <Section
      id="architecture"
      eyebrow="System architecture"
      title="A confidence router decides who labels what."
      description="Tabular model handles the easy 85–90% of decisions in milliseconds. The remaining 10–15% — transactions sitting inside the uncertainty band — are escalated to the LLM for a structured rationale before the final call."
    >
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white p-6 sm:p-10">
        <svg
          viewBox="0 0 960 360"
          className="mx-auto h-auto w-full min-w-[760px] max-w-5xl"
          role="img"
          aria-label="FraudSentinel architecture diagram"
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#52525b" />
            </marker>
            <marker id="arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#6366f1" />
            </marker>
            <marker id="arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#d97706" />
            </marker>
          </defs>

          {/* Node: Transaction */}
          <g>
            <rect x="20" y="150" width="130" height="60" rx="10" fill="#ffffff" stroke="#d4d4d8" />
            <text x="85" y="178" textAnchor="middle" className="fill-zinc-900" fontSize="13" fontWeight="600">Transaction</text>
            <text x="85" y="195" textAnchor="middle" className="fill-zinc-500" fontSize="10">400+ features</text>
          </g>

          {/* Arrow → LightGBM */}
          <line x1="150" y1="180" x2="190" y2="180" stroke="#52525b" strokeWidth="1.5" markerEnd="url(#arrow)" />

          {/* Node: LightGBM */}
          <g>
            <rect x="190" y="140" width="160" height="80" rx="10" fill="#fafafa" stroke="#a1a1aa" />
            <text x="270" y="168" textAnchor="middle" className="fill-zinc-900" fontSize="13" fontWeight="600">LightGBM</text>
            <text x="270" y="184" textAnchor="middle" className="fill-zinc-500" fontSize="10">~1.2 ms p50</text>
            <text x="270" y="200" textAnchor="middle" className="fill-zinc-500" fontSize="10">ROC-AUC 0.943</text>
          </g>

          {/* Arrow → Router */}
          <line x1="350" y1="180" x2="390" y2="180" stroke="#52525b" strokeWidth="1.5" markerEnd="url(#arrow)" />

          {/* Node: Confidence Router (diamond) */}
          <g>
            <polygon points="475,120 555,180 475,240 395,180" fill="#eef2ff" stroke="#6366f1" />
            <text x="475" y="174" textAnchor="middle" className="fill-accent-700" fontSize="12" fontWeight="600">Confidence</text>
            <text x="475" y="190" textAnchor="middle" className="fill-accent-700" fontSize="12" fontWeight="600">Router</text>
            <text x="475" y="208" textAnchor="middle" className="fill-accent-600" fontSize="10">[0.35, 0.65]</text>
          </g>

          {/* Branch up: Direct decision */}
          <line x1="555" y1="180" x2="610" y2="180" stroke="#52525b" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="582" y="170" textAnchor="middle" className="fill-zinc-500" fontSize="10">~85–90%</text>

          {/* Node: Direct Decision */}
          <g>
            <rect x="610" y="150" width="160" height="60" rx="10" fill="#ffffff" stroke="#d4d4d8" />
            <text x="690" y="178" textAnchor="middle" className="fill-zinc-900" fontSize="13" fontWeight="600">Direct Decision</text>
            <text x="690" y="195" textAnchor="middle" className="fill-zinc-500" fontSize="10">approve / decline</text>
          </g>

          {/* Branch down: LLM */}
          <line x1="475" y1="240" x2="475" y2="280" stroke="#d97706" strokeWidth="1.5" markerEnd="url(#arrow-amber)" />
          <text x="500" y="265" className="fill-amber-700" fontSize="10">10–15% borderline</text>

          {/* Node: LLM */}
          <g>
            <rect x="370" y="280" width="210" height="60" rx="10" fill="#fffbeb" stroke="#d97706" />
            <text x="475" y="307" textAnchor="middle" className="fill-amber-800" fontSize="13" fontWeight="600">Llama 3.1 8B + LoRA</text>
            <text x="475" y="324" textAnchor="middle" className="fill-amber-700" fontSize="10">SHAP-grounded rationale</text>
          </g>

          {/* LLM → Decision */}
          <path d="M 580 310 Q 660 310 690 240 L 690 215" fill="none" stroke="#d97706" strokeWidth="1.5" markerEnd="url(#arrow-amber)" />

          {/* Decision → Dashboard */}
          <line x1="770" y1="180" x2="810" y2="180" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arrow-accent)" />

          {/* Node: Dashboard */}
          <g>
            <rect x="810" y="150" width="130" height="60" rx="10" fill="#eef2ff" stroke="#6366f1" />
            <text x="875" y="178" textAnchor="middle" className="fill-accent-700" fontSize="13" fontWeight="600">Analyst</text>
            <text x="875" y="195" textAnchor="middle" className="fill-accent-700" fontSize="13" fontWeight="600">Dashboard</text>
          </g>

          {/* Threshold annotations */}
          <g>
            <text x="395" y="100" className="fill-zinc-600" fontSize="10" fontWeight="500">p &lt; 0.35 → approve</text>
            <text x="395" y="115" className="fill-zinc-600" fontSize="10" fontWeight="500">p &gt; 0.65 → decline</text>
          </g>
        </svg>
      </div>
    </Section>
  );
}
