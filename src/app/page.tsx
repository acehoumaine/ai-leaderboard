"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import {
  ViewColumnsIcon,
  Squares2X2Icon,
  ArrowPathIcon,
  HeartIcon,
  ArrowDownTrayIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

import { supabase } from "../../lib/supabase";
import type { AIModel } from "../../lib/types";
import { useLocalStorage } from "../../lib/hooks/useLocalStorage";
import { formatRelativeTime, getCompanyColor } from "../../lib/utils";
import { formatMetricValue, METRIC_DEFINITIONS } from "../../lib/metrics";

// Components
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { MetricSelector } from "../../components/leaderboard/MetricSelector";
import { SearchAndFilters } from "../../components/leaderboard/SearchAndFilters";
import { ModelCard } from "../../components/leaderboard/ModelCard";
import Link from "next/link";

const PAGE_SIZE = 25;

// Models that are known to have unreliable/inflated benchmark data.
// These are permanently excluded from rankings.
const BLOCKED_MODELS = [
  "KAT-Coder-Pro V1",
  "KAT-Coder-Pro",
];

function isBlockedModel(name: string): boolean {
  return BLOCKED_MODELS.some(
    blocked => name.toLowerCase().includes(blocked.toLowerCase())
  );
}

type ViewMode = 'table' | 'grid';

interface AdvancedFilters {
  minScore?: number;
  maxScore?: number;
  hasCoding?: boolean;
  hasSpeed?: boolean;
  sortOrder?: string;
}

export default function Home() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState("overall_intelligence");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [refreshing, setRefreshing] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    minScore: undefined,
    maxScore: undefined,
    hasCoding: false,
    hasSpeed: false,
    sortOrder: 'desc',
  });

  const [favoriteModels, setFavoriteModels] = useLocalStorage<string[]>('favorite-models', []);
  const [, setLastVisited] = useLocalStorage<string>('last-visited', '');
  const setLastVisitedRef = useRef(setLastVisited);
  setLastVisitedRef.current = setLastVisited;

  useEffect(() => {
    fetchData();
    setLastVisitedRef.current(new Date().toISOString());
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("ai_models")
        .select("id, name, company, benchmark_scores, description, last_updated, overall_intelligence, source_id");

      if (error) throw error;

      // Filter out blocked models with unreliable data
      const cleanData = ((data as AIModel[]) || []).filter(
        model => !isBlockedModel(model.name)
      );
      setModels(cleanData);
    } catch (err: unknown) {
      setError("Failed to fetch data: " + (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string' ? err.message : String(err)));
      setModels([]);
    }
    setLoading(false);
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const companyOptions = useMemo(() => {
    const set = new Set<string>();
    models.forEach((m) => set.add(m.company));
    return Array.from(set).sort();
  }, [models]);

  const filteredModels = useMemo(() => {
    let filtered = models;
    if (selectedCompany) {
      filtered = filtered.filter((m) => m.company === selectedCompany);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.company.toLowerCase().includes(query) ||
          (m.description && m.description.toLowerCase().includes(query))
      );
    }
    if (advancedFilters.minScore !== undefined) {
      filtered = filtered.filter((m) => m.overall_intelligence >= advancedFilters.minScore!);
    }
    if (advancedFilters.maxScore !== undefined) {
      filtered = filtered.filter((m) => m.overall_intelligence <= advancedFilters.maxScore!);
    }
    if (advancedFilters.hasCoding) {
      filtered = filtered.filter((m) => m.benchmark_scores && typeof m.benchmark_scores.coding === 'number');
    }
    if (advancedFilters.hasSpeed) {
      filtered = filtered.filter((m) => m.benchmark_scores && typeof m.benchmark_scores.speed === 'number');
    }
    return filtered;
  }, [models, selectedCompany, searchQuery,
    advancedFilters.minScore, advancedFilters.maxScore,
    advancedFilters.hasCoding, advancedFilters.hasSpeed]);

  const sortedModels = useMemo(() => {
    const sorted = [...filteredModels];
    if (advancedFilters.sortOrder === 'asc') {
      sorted.sort((a, b) => {
        const aScore = selectedMetric === "overall_intelligence"
          ? a.overall_intelligence
          : a.benchmark_scores?.[selectedMetric] ?? -Infinity;
        const bScore = selectedMetric === "overall_intelligence"
          ? b.overall_intelligence
          : b.benchmark_scores?.[selectedMetric] ?? -Infinity;
        return aScore - bScore;
      });
    } else if (advancedFilters.sortOrder === 'desc') {
      sorted.sort((a, b) => {
        const aScore = selectedMetric === "overall_intelligence"
          ? a.overall_intelligence
          : a.benchmark_scores?.[selectedMetric] ?? -Infinity;
        const bScore = selectedMetric === "overall_intelligence"
          ? b.overall_intelligence
          : b.benchmark_scores?.[selectedMetric] ?? -Infinity;
        return bScore - aScore;
      });
    } else if (advancedFilters.sortOrder === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (advancedFilters.sortOrder === 'recent') {
      sorted.sort((a, b) => {
        const aDate = a.last_updated ? new Date(a.last_updated).getTime() : 0;
        const bDate = b.last_updated ? new Date(b.last_updated).getTime() : 0;
        return bDate - aDate;
      });
    }
    return sorted;
  }, [filteredModels, selectedMetric, advancedFilters.sortOrder]);

  const totalPages = Math.ceil(sortedModels.length / PAGE_SIZE);
  const safePage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedModels = sortedModels.slice(startIndex, endIndex);

  const stats = useMemo(() => {
    if (models.length === 0) return null;
    const totalModels = models.length;
    const totalCompanies = companyOptions.length;
    const lastUpdated = models.reduce((latest, model) => {
      const modelDate = model.last_updated ? new Date(model.last_updated) : new Date(0);
      return modelDate > latest ? modelDate : latest;
    }, new Date(0));
    return {
      totalModels,
      totalCompanies,
      lastUpdated: formatRelativeTime(lastUpdated.toISOString())
    };
  }, [models, companyOptions]);

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages || 1));
    if (validPage !== page) {
      setPage(validPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleCompanyChange = useCallback((company: string) => {
    setSelectedCompany(company);
    setPage(1);
  }, []);

  const handleAdvancedFiltersChange = useCallback((filters: AdvancedFilters) => {
    setAdvancedFilters(filters);
    setPage(1);
  }, []);

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.export-dropdown')) {
        setShowExportDropdown(false);
      }
    };
    if (showExportDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showExportDropdown]);

  const toggleFavorite = (modelId: string) => {
    setFavoriteModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const exportToCSV = () => {
    const headers = ['Rank', 'Model', 'Company', 'Score', 'Description'];
    const csvContent = [
      headers.join(','),
      ...paginatedModels.map((model, index) => {
        const rank = (page - 1) * PAGE_SIZE + index + 1;
        const score = selectedMetric === "overall_intelligence"
          ? model.overall_intelligence
          : model.benchmark_scores?.[selectedMetric];
        const formattedScore = formatMetricValue(selectedMetric, score);
        return [
          rank,
          `"${model.name}"`,
          `"${model.company}"`,
          formattedScore,
          `"${model.description || ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ai-leaderboard-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAllToCSV = () => {
    const headers = ['Rank', 'Model', 'Company', 'Score', 'Description', 'Last Updated'];
    const csvContent = [
      headers.join(','),
      ...sortedModels.map((model, index) => {
        const score = selectedMetric === "overall_intelligence"
          ? model.overall_intelligence
          : model.benchmark_scores?.[selectedMetric];
        const formattedScore = formatMetricValue(selectedMetric, score);
        return [
          index + 1,
          `"${model.name}"`,
          `"${model.company}"`,
          formattedScore,
          `"${model.description || ''}"`,
          `"${model.last_updated || ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ai-leaderboard-all-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedDef = METRIC_DEFINITIONS[selectedMetric];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header currentPath="/" />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="h-7 bg-gray-100 rounded-lg animate-pulse w-64 mx-auto" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-96 mx-auto" />
            </div>
            <TableSkeleton rows={10} />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header currentPath="/" />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center space-y-4">
              <div className="text-red-500 text-lg font-semibold">
                Error Loading Data
              </div>
              <p className="text-gray-600">{error}</p>
              <Button onClick={handleRefresh} isLoading={refreshing}>
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header currentPath="/" />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Hero - compact and informative */}
        <div className="text-center space-y-3 pb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            AI Model Rankings
          </h1>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            Independent rankings based on standardized benchmarks from{' '}
            <a href="https://artificialanalysis.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Artificial Analysis
            </a>.
            {stats && (
              <span className="text-gray-400">
                {' '}{stats.totalModels} models from {stats.totalCompanies} companies.
              </span>
            )}
          </p>
        </div>

        {/* Ranking methodology mini-explainer */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium text-gray-900">How we rank:</span>{' '}
                Models are ranked by the selected metric below. The default <span className="font-medium">Overall Intelligence</span> score
                is a composite of multiple evaluations including MMLU-Pro, GPQA, HLE, LiveCodeBench, SciCode, MATH-500, and AIME.
                Switch metrics to sort by speed, efficiency, coding ability, or individual benchmarks.
              </p>
              <p>
                <Link href="/methodology" className="text-blue-600 hover:underline font-medium">
                  Read our full methodology
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Metric Selector */}
        <MetricSelector
          selectedMetric={selectedMetric}
          onMetricChange={(metric) => {
            setSelectedMetric(metric);
            setPage(1);
          }}
        />

        {/* Search and Filters */}
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedCompany={selectedCompany}
          onCompanyChange={handleCompanyChange}
          companyOptions={companyOptions}
          totalResults={sortedModels.length}
          advancedFilters={advancedFilters}
          onAdvancedFiltersChange={handleAdvancedFiltersChange}
        />

        {/* Action Bar - simplified */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
              title="Table view"
            >
              <ViewColumnsIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
              title="Grid view"
            >
              <Squares2X2Icon className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <div className="relative export-dropdown">
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                disabled={sortedModels.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Export
              </button>
              {showExportDropdown && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => { exportToCSV(); setShowExportDropdown(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Current Page ({paginatedModels.length})
                    </button>
                    <button
                      onClick={() => { exportAllToCSV(); setShowExportDropdown(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      All Filtered ({sortedModels.length})
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Models Display */}
        <div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {paginatedModels.map((model, index) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    rank={(page - 1) * PAGE_SIZE + index + 1}
                    selectedMetric={selectedMetric}
                    isFavorite={favoriteModels.includes(model.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Model
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {selectedDef?.shortName || 'Score'}
                      </th>
                      <th className="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedModels.map((model, index) => {
                      const rank = (page - 1) * PAGE_SIZE + index + 1;
                      const score = selectedMetric === "overall_intelligence"
                        ? model.overall_intelligence
                        : model.benchmark_scores?.[selectedMetric];
                      return (
                        <tr
                          key={model.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                              rank === 1
                                ? 'bg-yellow-400 text-yellow-900'
                                : rank === 2
                                ? 'bg-gray-300 text-gray-700'
                                : rank === 3
                                ? 'bg-orange-300 text-orange-900'
                                : 'text-gray-400'
                            }`}>
                              {rank}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="font-medium text-gray-900 text-sm">
                              {model.name}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getCompanyColor(model.company)}`}>
                              {model.company}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span className="font-semibold text-sm tabular-nums text-gray-900">
                              {formatMetricValue(selectedMetric, score)}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => toggleFavorite(model.id)}
                              className="p-1 rounded hover:bg-gray-100 transition-colors"
                            >
                              <HeartIcon className={`h-4 w-4 ${favoriteModels.includes(model.id) ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-gray-400'}`} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1.5 py-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1.5 rounded-md text-sm ${
                page === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (page <= 3) {
                pageNumber = i + 1;
              } else if (page >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = page - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                    page === pageNumber
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1.5 rounded-md text-sm ${
                page === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </main>

      <Footer stats={stats ?? undefined} />
    </div>
  );
}
