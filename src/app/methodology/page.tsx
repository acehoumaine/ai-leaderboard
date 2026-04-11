import React from 'react';
import Link from 'next/link';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header currentPath="/methodology" />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Methodology</h1>
          <p className="text-gray-500 text-lg">
            How we rank AI models — benchmarks, sources, and scoring approach.
          </p>
        </div>

        <div className="space-y-8">
          {/* Data Source */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Data Source</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              All benchmark scores are sourced from{' '}
              <a
                href="https://artificialanalysis.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Artificial Analysis
              </a>
              , an independent research organization that evaluates AI models under standardized
              conditions. We synchronize with their dataset regularly to ensure rankings reflect
              the latest available models.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              We do not conduct our own benchmarks. We aggregate, display, and make searchable
              the data they publish — giving proper attribution throughout.
            </p>
          </section>

          {/* Overall Intelligence Score */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Overall Intelligence Score</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              The default ranking metric is <span className="font-medium text-gray-900">Overall Intelligence</span>, a
              composite score calculated by Artificial Analysis that combines multiple standardized
              benchmarks into a single number. A higher score means stronger general reasoning and knowledge.
            </p>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Benchmarks included in the composite:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    name: 'MMLU-Pro',
                    description: 'Massive Multitask Language Understanding (Professional). Tests knowledge across 57 academic subjects at a professional difficulty level.',
                  },
                  {
                    name: 'GPQA Diamond',
                    description: 'Graduate-level, Google-proof Q&A. Expert-authored questions in chemistry, biology, and physics that cannot be solved by simple search.',
                  },
                  {
                    name: 'HLE (Humanity\'s Last Exam)',
                    description: 'A frontier benchmark of extremely hard questions across domains, designed to be near the limit of what any human can answer.',
                  },
                  {
                    name: 'LiveCodeBench',
                    description: 'Real coding challenges from competitive programming platforms, evaluated on a live, continuously updated dataset to prevent data contamination.',
                  },
                  {
                    name: 'SciCode',
                    description: 'Scientific research programming tasks that require generating executable code to solve computational science problems.',
                  },
                  {
                    name: 'MATH-500',
                    description: 'A curated set of 500 challenging math problems across algebra, geometry, number theory, and competition math.',
                  },
                  {
                    name: 'AIME',
                    description: 'American Invitational Mathematics Examination problems — high-school olympiad level problems that require rigorous multi-step reasoning.',
                  },
                ].map((b) => (
                  <div key={b.name} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{b.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{b.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Other Metrics */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Other Metrics</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Beyond Overall Intelligence, you can rank models by other dimensions using the metric selector:
            </p>
            <div className="space-y-3">
              {[
                {
                  name: 'Speed',
                  description: 'Tokens generated per second (output throughput). Measured on standardized hardware. Higher is better for latency-sensitive applications.',
                },
                {
                  name: 'Cost Efficiency',
                  description: 'A value index computed from the model\'s intelligence score divided by its price. Higher means more intelligence per dollar spent.',
                },
                {
                  name: 'Price',
                  description: 'Blended cost per million tokens (weighted input/output). Sourced from official provider pricing pages.',
                },
                {
                  name: 'Coding',
                  description: 'Dedicated coding ability score derived from LiveCodeBench and similar tasks, isolated from the composite intelligence score.',
                },
                {
                  name: 'Latency',
                  description: 'Time to first token (TTFT) in seconds. Measures how quickly a model begins responding, important for interactive use cases.',
                },
              ].map((m) => (
                <div key={m.name} className="flex gap-3">
                  <span className="text-sm font-medium text-gray-900 w-28 shrink-0">{m.name}</span>
                  <span className="text-sm text-gray-500 leading-relaxed">{m.description}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Data Integrity */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Data Integrity & Exclusions</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We manually review models that appear with anomalously high scores. When a model
              consistently outperforms all others by a large margin on the composite intelligence
              score but is not corroborated by independent benchmarks or third-party reports,
              we investigate and may exclude it from rankings.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Exclusions are applied at the application layer — the underlying data source is unchanged.
              We maintain a blocklist of models with confirmed unreliable benchmark submissions.
              No model or company receives preferential treatment.
            </p>
          </section>

          {/* Future Plans */}
          <section className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Future Updates</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              As the AI landscape evolves, we plan to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Add community-sourced benchmark data (e.g., LM Arena Elo ratings)</li>
              <li>Introduce per-domain rankings (science, code, reasoning, vision)</li>
              <li>Show score history over time to track model improvement</li>
              <li>Add model family grouping (e.g., all Claude versions together)</li>
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
