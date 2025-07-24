"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import type { AIModel } from "../../lib/types";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  TooltipItem,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const metrics = [
  { key: "overall_intelligence", menuLabel: "Overall Intelligence", tableLabel: "Intelligence" },
  { key: "speed", menuLabel: "Speed", tableLabel: "Speed (tokens/sec)" },
  { key: "cost_efficiency", menuLabel: "Cost Efficiency", tableLabel: "Cost Efficiency" },
  { key: "coding", menuLabel: "Coding", tableLabel: "Coding" },
];

const PAGE_SIZE = 25;

// User-friendly metric names
const metricLabels: Record<string, string> = {
  speed: "Output Speed (tokens/sec)",
  latency: "Response Latency (sec)",
  price: "Price per 1M Tokens (USD)",
  cost_efficiency: "Cost Efficiency",
  coding: "Coding Ability",
  math: "Math Ability",
  mmlu_pro: "General Knowledge (MMLU Pro)",
  gpqa: "Graduate QA (GPQA)",
  hle: "High-Level English (HLE)",
  livecodebench: "Live Coding Bench",
  scicode: "Scientific Coding",
  math_500: "Math 500",
  aime: "AIME (Math Competition)",
  time_to_first_answer_token: "Time to First Answer Token (sec)",
};

export default function Home() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState("overall_intelligence");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedModels, setSelectedModels] = useState<AIModel[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonView, setComparisonView] = useState<'table' | 'graph'>('table');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("ai_models")
          .select("id, name, company, benchmark_scores, description, last_updated, overall_intelligence, source_id");
        if (error) throw error;
        setModels((data as AIModel[]) || []);
      } catch (err: unknown) {
        setError("Failed to fetch data: " + (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string' ? err.message : String(err)));
        setModels([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Get unique companies for filter dropdown
  const companyOptions = React.useMemo(() => {
    const set = new Set<string>();
    models.forEach((m) => set.add(m.company));
    return Array.from(set).sort();
  }, [models]);

  // Filter and search
  const filteredModels = React.useMemo(() => {
    let filtered = models;
    if (selectedCompany) {
      filtered = filtered.filter((m) => m.company === selectedCompany);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(s) ||
          m.company.toLowerCase().includes(s)
      );
    }
    return filtered;
  }, [models, selectedCompany, search]);

  // Sort models by selected metric
  const sortedModels = React.useMemo(() => {
    return [...filteredModels].sort((a, b) => {
      const aScore = selectedMetric === "overall_intelligence"
        ? a.overall_intelligence
        : a.benchmark_scores?.[selectedMetric] ?? -Infinity;
      const bScore = selectedMetric === "overall_intelligence"
        ? b.overall_intelligence
        : b.benchmark_scores?.[selectedMetric] ?? -Infinity;
      return bScore - aScore;
    });
  }, [filteredModels, selectedMetric]);

  // Pagination
  const totalPages = Math.ceil(sortedModels.length / PAGE_SIZE);
  const paginatedModels = sortedModels.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const handleCompanyClick = (company: string) => {
    setSelectedCompany(company);
    setPage(1);
  };

  const handleModelSelect = (model: AIModel) => {
    const isSelected = selectedModels.some((m) => m.id === model.id);
    if (isSelected) {
      setSelectedModels(selectedModels.filter((m) => m.id !== model.id));
    } else if (selectedModels.length < 3) {
      setSelectedModels([...selectedModels, model]);
    }
  };

  const isModelSelected = (id: string) => selectedModels.some((m) => m.id === id);
  const handleClearSelection = () => {
    setSelectedModels([]);
    setShowComparison(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          Loading models...
        </span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <div className="text-red-500 dark:text-red-400 text-center" aria-live="polite">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-2 sm:px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl flex flex-row justify-between items-center mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white drop-shadow-sm flex-1">
          AI Model Leaderboard
        </h1>
        <Link
          href="/api-info"
          className="ml-2 bg-gray-100 dark:bg-gray-800 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white text-gray-700 dark:text-gray-200 font-semibold py-1.5 px-4 rounded-full transition-colors shadow text-xs sm:text-sm border border-gray-200 dark:border-gray-700"
          style={{ minWidth: '60px', textAlign: 'center' }}
        >
          API
        </Link>
      </div>
      <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-3 justify-center">
        {metrics.map((metric) => (
          <button
            key={metric.key}
            aria-label={`Sort by ${metric.menuLabel}`}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400
              ${selectedMetric === metric.key
                ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-blue-900"}
            `}
            onClick={() => setSelectedMetric(metric.key)}
          >
            {metric.menuLabel}
          </button>
        ))}
      </div>
      <div className="mb-3 sm:mb-4 flex flex-wrap gap-2 sm:gap-3 items-center justify-center w-full max-w-2xl">
        <select
          value={selectedCompany}
          onChange={e => { setSelectedCompany(e.target.value); setPage(1); }}
          className="px-2 sm:px-3 py-1.5 sm:py-2 rounded border bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs sm:text-sm"
        >
          <option value="">All Companies</option>
          {companyOptions.map((company) => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search models or companies..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="px-2 sm:px-3 py-1.5 sm:py-2 rounded border bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 w-40 sm:w-64 text-xs sm:text-sm"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded-full transition-colors shadow text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedModels.length < 2}
          onClick={() => setShowComparison(true)}
        >
          Compare Models
        </button>
        {selectedCompany && (
          <button
            onClick={() => setSelectedCompany("")}
            className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs"
          >
            Clear Company Filter
          </button>
        )}
      </div>
      {/* Comparison Table/Graph Toggle and View */}
      {selectedModels.length >= 2 && showComparison && (
        <div className="w-full max-w-4xl mb-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white text-center sm:text-left">Model Comparison</h2>
            <div className="flex flex-row sm:flex-row gap-1 sm:gap-2 justify-center">
              <button
                className={`px-2.5 sm:px-3 py-1 rounded-l-full border font-semibold text-xs sm:text-sm transition-colors ${comparisonView === 'table' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'}`}
                onClick={() => setComparisonView('table')}
                aria-pressed={comparisonView === 'table'}
              >
                Table
              </button>
              <button
                className={`px-2.5 sm:px-3 py-1 rounded-r-full border font-semibold text-xs sm:text-sm transition-colors ${comparisonView === 'graph' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'}`}
                onClick={() => setComparisonView('graph')}
                aria-pressed={comparisonView === 'graph'}
              >
                Graph
              </button>
            </div>
            <button
              onClick={handleClearSelection}
              className="text-xs sm:text-xs px-2.5 sm:px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 w-full sm:w-auto"
            >
              Clear Selection
            </button>
          </div>
          <div className="overflow-x-auto w-full">
            {comparisonView === 'table' ? (
              <table className="w-full min-w-[400px] text-xs sm:text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="py-2 px-2 sm:px-3 font-semibold">Metric</th>
                    {selectedModels.map((model) => (
                      <th key={model.id} className="py-2 px-2 sm:px-3 font-semibold text-center whitespace-nowrap">{model.name} <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">{model.company}</span></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-2 sm:px-3 font-medium">Overall Intelligence</td>
                    {selectedModels.map((model) => (
                      <td key={model.id} className="py-2 px-2 sm:px-3 text-center font-bold text-blue-600 dark:text-blue-400">{model.overall_intelligence !== undefined && model.overall_intelligence !== null ? Number(model.overall_intelligence).toFixed(1) : <span className="text-gray-400">N/A</span>}</td>
                    ))}
                  </tr>
                  {/* Only show metrics where at least 2 models have data */}
                  {(() => {
                    const allMetrics = Array.from(new Set(selectedModels.flatMap(m => Object.keys(m.benchmark_scores || {}))));
                    return allMetrics.filter(metric => {
                      const countWithData = selectedModels.filter(m => m.benchmark_scores && m.benchmark_scores[metric] !== undefined && m.benchmark_scores[metric] !== null).length;
                      return countWithData >= 2;
                    }).map((metric) => (
                      <tr key={metric}>
                        <td className="py-2 px-2 sm:px-3 font-medium whitespace-nowrap">{metricLabels[metric] || metric.replace(/_/g, ' ')}</td>
                        {selectedModels.map((model) => (
                          <td key={model.id} className="py-2 px-2 sm:px-3 text-center">{model.benchmark_scores && model.benchmark_scores[metric] !== undefined && model.benchmark_scores[metric] !== null ? Number(model.benchmark_scores[metric]).toFixed(2) : <span className="text-gray-400">N/A</span>}</td>
                        ))}
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500 dark:text-gray-400 w-full">
                {(() => {
                  const allMetrics = Array.from(new Set(selectedModels.flatMap(m => Object.keys(m.benchmark_scores || {}))));
                  const metricsToShow = allMetrics.filter(metric => {
                    const countWithData = selectedModels.filter(m => m.benchmark_scores && m.benchmark_scores[metric] !== undefined && m.benchmark_scores[metric] !== null).length;
                    return countWithData >= 2;
                  });
                  if (metricsToShow.length === 0) {
                    return <span className="mb-2">No comparable metrics available for graph.</span>;
                  }
                  // Normalize each metric row: best = 100, others as % of best
                  const normalizedData = metricsToShow.map(metric => {
                    const values = selectedModels.map(model =>
                      model.benchmark_scores && model.benchmark_scores[metric] !== undefined && model.benchmark_scores[metric] !== null
                        ? Number(model.benchmark_scores[metric])
                        : null
                    );
                    const max = Math.max(...values.filter(v => v !== null) as number[]);
                    return values.map(v => v === null ? null : (max === 0 ? 0 : (v / max) * 100));
                  });
                  const data = {
                    labels: metricsToShow.map(metric => metricLabels[metric] || metric),
                    datasets: selectedModels.map((model, idx) => ({
                      label: model.name,
                      data: normalizedData.map(row => row[idx]),
                      backgroundColor: `rgba(${60 + idx * 60}, 165, 250, 0.7)` ,
                      borderColor: `rgba(${60 + idx * 60}, 165, 250, 1)` ,
                      borderWidth: 1,
                      maxBarThickness: 28,
                    })),
                  };
                  const options = {
                    indexAxis: 'y' as const,
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                        labels: {
                          color: '#2563eb',
                          font: { size: 12, weight: 'bold' as const },
                        },
                      },
                      tooltip: {
                        enabled: true,
                        callbacks: {
                          label: function(context: TooltipItem<'bar'>) {
                            // Show actual value in tooltip
                            const metricIdx = context.dataIndex;
                            const modelIdx = context.datasetIndex;
                            const actual = selectedModels[modelIdx].benchmark_scores && selectedModels[modelIdx].benchmark_scores[metricsToShow[metricIdx]];
                            return `${context.dataset.label}: ${context.formattedValue}%${actual !== undefined && actual !== null ? ` (actual: ${actual})` : ''}`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        grid: { color: '#e5e7eb' },
                        ticks: { color: '#6b7280', font: { size: 10 }, callback: (v: number | string) => `${v}%` },
                        min: 0,
                        max: 100,
                      },
                      y: {
                        grid: { color: '#e5e7eb' },
                        ticks: { color: '#374151', font: { size: 10 }, },
                      },
                    },
                  };
                  return (
                    <>
                      <div className="w-full min-h-[300px] max-w-full sm:max-w-xl overflow-x-auto" style={{ minWidth: 0 }}>
                        <Bar data={data} options={options} height={Math.max(300, metricsToShow.length * 40)} />
                      </div>
                      <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 text-center">
                        Each metric is normalized: the best model for each metric is shown as 100%.
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-semibold tracking-wide">#</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-semibold tracking-wide"></th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-semibold tracking-wide">Model Name</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-semibold tracking-wide">Company</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-semibold tracking-wide text-right">
                {metrics.find(m => m.key === selectedMetric)?.tableLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedModels.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 sm:py-8 px-3 sm:px-6 text-center text-gray-500 dark:text-gray-400" aria-live="polite">
                  No models found.
                </td>
              </tr>
            ) :
              paginatedModels.map((model, idx) => (
                <tr
                  key={model.id}
                  className={
                    `${idx % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"} transition-colors hover:bg-blue-100 dark:hover:bg-blue-900 active:bg-blue-200 dark:active:bg-blue-800 cursor-pointer`}
                  onClick={() => handleModelSelect(model)}
                >
                  <td className="py-3 sm:py-4 px-3 sm:px-6 font-mono text-gray-500 dark:text-gray-400">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <input
                      type="checkbox"
                      checked={isModelSelected(model.id)}
                      onChange={e => { e.stopPropagation(); handleModelSelect(model); }}
                      disabled={!isModelSelected(model.id) && selectedModels.length >= 3}
                      aria-label={`Select ${model.name} for comparison`}
                    />
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 font-medium text-gray-900 dark:text-white">{model.name}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-700 dark:text-gray-300">
                    <button
                      className="underline hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={e => { e.stopPropagation(); handleCompanyClick(model.company); }}
                    >
                      {model.company}
                    </button>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-right font-bold text-blue-600 dark:text-blue-400">
                    {selectedMetric === "overall_intelligence"
                      ? (model.overall_intelligence !== undefined && model.overall_intelligence !== null
                          ? Number(model.overall_intelligence).toFixed(1)
                          : <span className="text-gray-400">N/A</span>)
                      : (model.benchmark_scores && model.benchmark_scores[selectedMetric] !== undefined && model.benchmark_scores[selectedMetric] !== null
                          ? Number(model.benchmark_scores[selectedMetric]).toFixed(1)
                          : <span className="text-gray-400">N/A</span>)}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex gap-1 sm:gap-2 mt-4 sm:mt-6 items-center justify-center">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-2 sm:px-3 py-1 rounded border bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-50 text-xs sm:text-sm"
          >
            Previous
          </button>
          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-2 sm:px-3 py-1 rounded border bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-50 text-xs sm:text-sm"
          >
            Next
          </button>
        </div>
      )}
      <footer className="mt-8 sm:mt-10 text-xs text-gray-500 dark:text-gray-400 text-center">
        &copy; {new Date().getFullYear()} AI Leaderboard. All rights reserved.
      </footer>
    </div>
  );
}
