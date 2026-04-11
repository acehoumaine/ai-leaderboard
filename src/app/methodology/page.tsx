import React from 'react';
import Link from 'next/link';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header currentPath="/methodology" />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Methodology</h1>
          <p className="text-gray-500 text-base">
            How we rank AI models — exact benchmark definitions, data sources, and scoring formulas.
          </p>
        </div>

        <div className="space-y-8">

          {/* Data Source */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Data Source</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              All benchmark scores are sourced from{' '}
              <a href="https://artificialanalysis.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Artificial Analysis
              </a>
              {' '}via their{' '}
              <a href="https://artificialanalysis.ai/api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                free public API
              </a>
              . Artificial Analysis performs independent intelligence, performance, and price benchmarking
              on AI models and inference API endpoints. We do not conduct our own benchmarks —
              we aggregate, display, and make searchable the data they publish.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Performance benchmarks measure <span className="font-medium text-gray-800">end-to-end performance experienced by customers</span> of
              AI inference services, not the maximum possible hardware performance. Both proprietary
              and open-weights models are benchmarked.
            </p>
          </section>

          {/* Overall Intelligence */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Overall Intelligence Score</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              The default ranking metric is the <span className="font-medium text-gray-800">Artificial Analysis Intelligence Index</span> —
              a composite score combining multiple independent academic benchmarks into a single number.
              A higher score means stronger general reasoning, knowledge, and problem-solving ability.
            </p>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Benchmarks in the composite</p>
              {[
                {
                  name: 'MMLU-Pro',
                  field: 'mmlu_pro',
                  format: 'percentage',
                  description: 'Massive Multitask Language Understanding (Professional). 12,000+ expert-level questions across 57 academic subjects including biology, chemistry, law, mathematics, and more. Professional difficulty — harder than the original MMLU.',
                },
                {
                  name: 'GPQA Diamond',
                  field: 'gpqa',
                  format: 'percentage',
                  description: '"Graduate-level Google-Proof Q&A" — expert-authored questions in chemistry, biology, and physics. Designed so that non-experts with internet access score around 34%, while domain experts score around 65%. Tests deep scientific reasoning, not lookup.',
                },
                {
                  name: 'HLE (Humanity\'s Last Exam)',
                  field: 'hle',
                  format: 'percentage',
                  description: 'A frontier benchmark of ~3,000 extremely difficult questions across mathematics, sciences, humanities, and professions — collectively assembled from thousands of expert contributors. Designed to be near the limit of what any human can answer today.',
                },
                {
                  name: 'LiveCodeBench',
                  field: 'livecodebench',
                  format: 'percentage',
                  description: 'Real coding problems from LeetCode, AtCoder, and CodeForces, evaluated on a continuously updated dataset to prevent training data contamination. Problems span easy to hard difficulty. Tests the ability to write correct, executable code under realistic conditions.',
                },
                {
                  name: 'SciCode',
                  field: 'scicode',
                  format: 'percentage',
                  description: 'Scientific research programming — tasks that require generating executable code to solve computational science problems across physics, math, chemistry, biology, and materials science. Created with domain experts; tests research-level scientific coding.',
                },
                {
                  name: 'MATH-500',
                  field: 'math_500',
                  format: 'percentage',
                  description: 'A curated set of 500 challenging competition-style math problems across algebra, geometry, number theory, counting, probability, and precalculus. Requires multi-step symbolic reasoning with exact final answers.',
                },
                {
                  name: 'AIME',
                  field: 'aime',
                  format: 'percentage',
                  description: 'American Invitational Mathematics Examination — high-school olympiad level problems requiring rigorous multi-step proof-like reasoning. Problems are integer-valued (0–999) with no multiple choice, so guessing is effectively impossible.',
                },
              ].map((b) => (
                <div key={b.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">{b.name}</span>
                    <code className="text-xs text-gray-400 font-mono">{b.field}</code>
                    <span className="text-xs text-gray-400">· {b.format}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Performance Metrics */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Performance Metrics</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Performance is measured end-to-end across real API calls — not synthetic hardware benchmarks.
              All speed and latency figures use <span className="font-medium text-gray-800">OpenAI tokens</span> as
              the unit of measurement (via the <code className="text-xs font-mono bg-gray-100 px-1 py-0.5 rounded">o200k_base</code> tokenizer)
              to allow fair comparison across models with different native tokenizers.
            </p>

            <div className="space-y-4">
              {[
                {
                  name: 'Output Speed',
                  field: 'speed',
                  unit: 'tokens/sec',
                  direction: 'Higher is better',
                  formula: 'Output Speed = (Total Tokens − First Chunk Tokens) ÷ (Time of Final Chunk − Time of First Chunk)',
                  description: 'Average number of output tokens received per second after the first token arrives. Measured at medium prompt length (≈1k input tokens) under serverless conditions.',
                },
                {
                  name: 'Time to First Token (TTFT)',
                  field: 'latency',
                  unit: 'seconds',
                  direction: 'Lower is better',
                  formula: 'TTFT = Time of First Token Arrival − Time Request Sent',
                  description: 'Time between sending the request and receiving the first token of the response. For reasoning models, this is the first reasoning token.',
                },
                {
                  name: 'Time to First Answer Token (TTFAT)',
                  field: 'time_to_first_answer_token',
                  unit: 'seconds',
                  direction: 'Lower is better',
                  formula: 'TTFAT = Input Processing Time + (Avg. Reasoning Tokens ÷ Reasoning Output Speed)',
                  description: 'For reasoning models: time until the first answer token after thinking completes. For non-reasoning models, equals TTFT. Average reasoning token count is computed over a diverse set of 60 prompts.',
                },
              ].map((m) => (
                <div key={m.name} className="p-4 border border-gray-100 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-gray-900">{m.name}</span>
                      <code className="text-xs text-gray-400 font-mono">{m.field}</code>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.direction.includes('Higher') ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {m.direction}
                    </span>
                  </div>
                  <code className="block text-xs font-mono text-gray-500 bg-gray-50 px-3 py-2 rounded">{m.formula}</code>
                  <p className="text-xs text-gray-500 leading-relaxed">{m.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Efficiency Metrics */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Pricing &amp; Efficiency Metrics</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Prices are sourced from official provider pricing pages. All prices are in USD.
            </p>
            <div className="space-y-3">
              {[
                {
                  name: 'Blended Price (3:1)',
                  field: 'price',
                  formula: 'Blended Price = (3 × Input Price + Output Price) ÷ 4',
                  description: 'Weighted average cost per million tokens assuming a 3:1 input-to-output token ratio. This is the standard comparison metric used by Artificial Analysis.',
                },
                {
                  name: 'Input Price',
                  field: 'price_input',
                  formula: 'Direct from provider',
                  description: 'Price per million input (prompt) tokens as listed by the provider.',
                },
                {
                  name: 'Output Price',
                  field: 'price_output',
                  formula: 'Direct from provider',
                  description: 'Price per million output (completion) tokens as listed by the provider. Typically 3–5× the input price.',
                },
                {
                  name: 'Cost Efficiency',
                  field: 'cost_efficiency',
                  formula: 'Cost Efficiency = 1 ÷ Blended Price',
                  description: 'Intelligence per dollar — the inverse of blended price. Higher is better: a model scoring 60 on intelligence at $1/M blended has a cost efficiency of 60.',
                },
              ].map((m) => (
                <div key={m.name} className="p-4 border border-gray-100 rounded-lg space-y-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-gray-900">{m.name}</span>
                    <code className="text-xs text-gray-400 font-mono">{m.field}</code>
                  </div>
                  <code className="block text-xs font-mono text-gray-500 bg-gray-50 px-3 py-2 rounded">{m.formula}</code>
                  <p className="text-xs text-gray-500 leading-relaxed">{m.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Data Integrity */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Data Integrity &amp; Exclusions</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We review models that appear with anomalously high scores not corroborated by independent
              reports. When a model has confirmed unreliable benchmark submissions, it is added to a
              blocklist and excluded from all rankings. Exclusions are applied at the application layer —
              the underlying Artificial Analysis data is unchanged.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              No model or company receives preferential treatment. The same scoring logic applies to all models.
            </p>
          </section>

          {/* Roadmap */}
          <section className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Planned Additions</h2>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">→</span> Community Elo ratings from LM Arena alongside benchmark scores</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">→</span> Per-domain rankings (coding, math, science, vision)</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">→</span> Score history charts to track model improvement over time</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">→</span> Model family grouping (all Claude versions, all GPT versions, etc.)</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">→</span> AA Coding Index and Math Index as primary sort options</li>
            </ul>
            <p className="text-sm text-gray-500 mt-2">
              Questions or suggestions?{' '}
              <Link href="/about" className="text-blue-600 hover:underline">Contact us</Link>.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
