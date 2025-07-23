"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

// Define the metrics available for sorting/filtering
const metrics = [
  { key: "overall_intelligence", label: "Overall Intelligence" },
  { key: "speed", label: "Speed" },
  { key: "cost_efficiency", label: "Cost Efficiency" },
  { key: "coding", label: "Coding" },
];

// Type for the AI model
interface AIModel {
  id: string;
  name: string;
  company: string;
  description?: string;
  last_updated?: string;
  overall_intelligence: number;
  benchmark_scores: {
    speed?: number;
    cost_efficiency?: number;
    coding?: number;
    reasoning?: number;
    [key: string]: number | undefined;
  };
}

export default function Home() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState("overall_intelligence");

  // Fetch models from Supabase
  useEffect(() => {
    async function fetchModels() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("ai_models")
        .select("id, name, company, benchmark_scores, description, last_updated, overall_intelligence");
      if (error) {
        setError("Failed to fetch models");
        setModels([]);
      } else {
        setModels((data as AIModel[]) || []);
      }
      setLoading(false);
    }
    fetchModels();
  }, []);

  // Sort models by selected metric
  const sortedModels = React.useMemo(() => {
    return [...models].sort((a, b) => {
      const aScore = selectedMetric === "overall_intelligence"
        ? a.overall_intelligence
        : a.benchmark_scores?.[selectedMetric] ?? -Infinity;
      const bScore = selectedMetric === "overall_intelligence"
        ? b.overall_intelligence
        : b.benchmark_scores?.[selectedMetric] ?? -Infinity;
      return bScore - aScore;
    });
  }, [models, selectedMetric]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white drop-shadow-sm">
        AI Model Leaderboard
      </h1>
      <div className="mb-6 flex flex-wrap gap-3 justify-center">
        {metrics.map((metric) => (
          <button
            key={metric.key}
            aria-label={`Sort by ${metric.label}`}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400
              ${selectedMetric === metric.key
                ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-blue-900"}
            `}
            onClick={() => setSelectedMetric(metric.key)}
          >
            {metric.label}
          </button>
        ))}
      </div>
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="py-4 px-6 text-sm font-semibold tracking-wide">#</th>
              <th className="py-4 px-6 text-sm font-semibold tracking-wide">Model Name</th>
              <th className="py-4 px-6 text-sm font-semibold tracking-wide">Company</th>
              <th className="py-4 px-6 text-sm font-semibold tracking-wide text-right">
                {metrics.find(m => m.key === selectedMetric)?.label === 'Overall Intelligence'
                  ? 'Overall Intelligence'
                  : `${metrics.find(m => m.key === selectedMetric)?.label} Score`}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 px-6 text-center text-gray-500 dark:text-gray-400">
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                    Loading models...
                  </span>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="py-8 px-6 text-center text-red-500 dark:text-red-400" aria-live="polite">
                  {error}
                </td>
              </tr>
            ) : sortedModels.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 px-6 text-center text-gray-500 dark:text-gray-400" aria-live="polite">
                  No models found.
                </td>
              </tr>
            ) : (
              sortedModels.map((model, idx) => (
                <tr
                  key={model.id}
                  className={
                    `${idx % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"} transition-colors hover:bg-blue-50 dark:hover:bg-blue-900 active:bg-blue-100 dark:active:bg-blue-800`}
                >
                  <td className="py-4 px-6 font-mono text-gray-500 dark:text-gray-400">{idx + 1}</td>
                  <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{model.name}</td>
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">{model.company}</td>
                  <td className="py-4 px-6 text-right font-bold text-blue-600 dark:text-blue-400">
                    {selectedMetric === "overall_intelligence"
                      ? (model.overall_intelligence !== undefined && model.overall_intelligence !== null
                          ? Number(model.overall_intelligence)
                          : <span className="text-gray-400">N/A</span>)
                      : (model.benchmark_scores && model.benchmark_scores[selectedMetric] !== undefined && model.benchmark_scores[selectedMetric] !== null
                          ? Number(model.benchmark_scores[selectedMetric])
                          : <span className="text-gray-400">N/A</span>)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <footer className="mt-10 text-xs text-gray-500 dark:text-gray-400 text-center">
        &copy; {new Date().getFullYear()} AI Leaderboard. All rights reserved.
      </footer>
    </div>
  );
}
