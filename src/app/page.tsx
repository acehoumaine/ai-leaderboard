"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ViewColumnsIcon,
  Squares2X2Icon,
  ChartBarIcon,
  ArrowPathIcon,
  EyeIcon,
  HeartIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

import { supabase } from "../../lib/supabase";
import type { AIModel } from "../../lib/types";
import { useLocalStorage } from "../../lib/hooks/useLocalStorage";
import { formatRelativeTime, getCompanyColor } from "../../lib/utils";
import { formatMetricValue } from "../../lib/metrics";

// Components
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card, CardContent } from "../../components/ui/Card";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { MetricSelector } from "../../components/leaderboard/MetricSelector";
import { SearchAndFilters } from "../../components/leaderboard/SearchAndFilters";
import { ModelCard } from "../../components/leaderboard/ModelCard";

const PAGE_SIZE = 25;

type ViewMode = 'table' | 'grid';

interface AdvancedFilters {
  minScore?: number;
  maxScore?: number;
  hasCoding?: boolean;
  hasSpeed?: boolean;
  sortOrder?: string;
}

export default function Home() {
  // State
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

  // Advanced filters state - use useMemo to prevent unnecessary re-renders
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    minScore: undefined,
    maxScore: undefined,
    hasCoding: false,
    hasSpeed: false,
    sortOrder: 'desc',
  });

  // Persistent state
  const [favoriteModels, setFavoriteModels] = useLocalStorage<string[]>('favorite-models', []);
  const [, setLastVisited] = useLocalStorage<string>('last-visited', '');
  const setLastVisitedRef = useRef(setLastVisited);
  setLastVisitedRef.current = setLastVisited;

  // Effects
  useEffect(() => {
    fetchData();
    setLastVisitedRef.current(new Date().toISOString());
  }, []);

  // Data fetching
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Computed values
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
    // Advanced filters
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

  // Calculate total pages first
  const totalPages = Math.ceil(sortedModels.length / PAGE_SIZE);
  
  // Calculate paginated models directly
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

  // Handlers
  const handlePageChange = (newPage: number) => {
    // Ensure the new page is within valid bounds
    const validPage = Math.max(1, Math.min(newPage, totalPages || 1));
    
    if (validPage !== page) {
      setPage(validPage);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Add memoized callbacks
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
  
  // Ensure page is within valid bounds when total pages changes
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  // Close export dropdown when clicking outside
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
    // Create CSV content from current filtered/sorted data
    const headers = ['Rank', 'Model', 'Company', 'Intelligence Score', 'Description'];
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

    // Create filename with current filters
    const filters = [];
    if (selectedCompany) filters.push(selectedCompany);
    if (searchQuery) filters.push('search');
    if (advancedFilters.minScore !== undefined || advancedFilters.maxScore !== undefined) filters.push('filtered');
    const filterSuffix = filters.length > 0 ? `-${filters.join('-')}` : '';

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ai-leaderboard-page-${page}${filterSuffix}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAllToCSV = () => {
    // Create CSV content from all filtered/sorted data
    const headers = ['Rank', 'Model', 'Company', 'Intelligence Score', 'Description', 'Last Updated'];
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

    // Create filename with current filters
    const filters = [];
    if (selectedCompany) filters.push(selectedCompany);
    if (searchQuery) filters.push('search');
    if (advancedFilters.minScore !== undefined || advancedFilters.maxScore !== undefined) filters.push('filtered');
    const filterSuffix = filters.length > 0 ? `-${filters.join('-')}` : '';

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ai-leaderboard-all${filterSuffix}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header currentPath="/" />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-64 mx-auto" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96 mx-auto" />
            </div>
            <TableSkeleton rows={10} />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header currentPath="/" />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center space-y-4">
              <div className="text-red-500 dark:text-red-400 text-lg font-semibold">
                Error Loading Data
              </div>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      <Header currentPath="/" />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              AI Model Leaderboard
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Independent rankings and comprehensive analysis of AI models based on real-world performance, 
            benchmarks, and capabilities. Compare the latest models from leading AI companies.
          </p>
          
          {stats && (
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Badge variant="secondary" size="md" className="px-4 py-2">
                <ChartBarIcon className="h-4 w-4 mr-2" />
                {stats.totalModels} Models
              </Badge>
              <Badge variant="secondary" size="md" className="px-4 py-2">
                <EyeIcon className="h-4 w-4 mr-2" />
                {stats.totalCompanies} Companies
              </Badge>
            </div>
          )}
        </motion.div>

        {/* Metric Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MetricSelector
            selectedMetric={selectedMetric}
            onMetricChange={(metric) => {
              setSelectedMetric(metric);
              setPage(1);
            }}
          />
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
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
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              leftIcon={<ViewColumnsIcon className="h-4 w-4" />}
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              leftIcon={<Squares2X2Icon className="h-4 w-4" />}
            >
              Grid
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              isLoading={refreshing}
              leftIcon={<ArrowPathIcon className="h-4 w-4" />}
            >
              Refresh
            </Button>
            <div className="relative export-dropdown">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                disabled={sortedModels.length === 0}
                leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
                rightIcon={<ChevronDownIcon className="h-4 w-4" />}
              >
                Export
              </Button>
              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        exportToCSV();
                        setShowExportDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Current Page ({paginatedModels.length} models)
                    </button>
                    <button
                      onClick={() => {
                        exportAllToCSV();
                        setShowExportDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      All Filtered ({sortedModels.length} models)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Models Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
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
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full table-hover">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Model
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Company
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        Score
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedModels.map((model, index) => {
                      const rank = (page - 1) * PAGE_SIZE + index + 1;
                      return (
                        <tr
                          key={model.id}
                          className={`border-b border-gray-200 dark:border-gray-700 transition-colors`}
                        >
                          <td className="px-6 py-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              rank <= 3 
                                ? rank === 1 
                                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
                                  : rank === 2
                                  ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
                                  : 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }`}>
                              {rank}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {model.name}
                            </div>
                            {model.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {model.description}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Badge size="sm" className={getCompanyColor(model.company)}>
                              {model.company}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                              {formatMetricValue(selectedMetric, 
                                selectedMetric === "overall_intelligence"
                                  ? model.overall_intelligence
                                  : model.benchmark_scores?.[selectedMetric]
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(model.id)}
                                className="p-1"
                              >
                                <HeartIcon className={`h-4 w-4 ${favoriteModels.includes(model.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 mb-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded border ${
                page === 1 
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600`}
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
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
                    className={`w-8 h-8 flex items-center justify-center rounded ${
                      page === pageNumber
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded border ${
                page === totalPages 
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600`}
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
