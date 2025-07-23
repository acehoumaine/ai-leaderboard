"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import type { AIModel } from "../../lib/types";

const metrics = [
  { key: "overall_intelligence", menuLabel: "Overall Intelligence", tableLabel: "Intelligence" },
  { key: "speed", menuLabel: "Speed", tableLabel: "Speed (tokens/sec)" },
  { key: "cost_efficiency", menuLabel: "Cost Efficiency", tableLabel: "Cost Efficiency" },
  { key: "coding", menuLabel: "Coding", tableLabel: "Coding" },
];

const PAGE_SIZE = 25;

export default function Home() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState("overall_intelligence");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

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
      } catch (err: any) {
        setError("Failed to fetch data: " + (err?.message || String(err)));
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
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-gray-900 dark:text-white drop-shadow-sm">
        AI Model Leaderboard
      </h1>
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
        {selectedCompany && (
          <button
            onClick={() => setSelectedCompany("")}
            className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs"
          >
            Clear Company Filter
          </button>
        )}
      </div>
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-semibold tracking-wide">#</th>
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
                <td colSpan={4} className="py-6 sm:py-8 px-3 sm:px-6 text-center text-gray-500 dark:text-gray-400" aria-live="polite">
                  No models found.
                </td>
              </tr>
            ) : (
              <>
                {paginatedModels.map((model, idx) => (
                  <tr
                    key={model.id}
                    className={
                      `${idx % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50 dark:bg-gray-800"} transition-colors hover:bg-blue-50 dark:hover:bg-blue-900 active:bg-blue-100 dark:active:bg-blue-800`}
                  >
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-mono text-gray-500 dark:text-gray-400">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-medium text-gray-900 dark:text-white">{model.name}</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-700 dark:text-gray-300">
                      <button
                        className="underline hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => handleCompanyClick(model.company)}
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
                ))}
              </>
            )}
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
