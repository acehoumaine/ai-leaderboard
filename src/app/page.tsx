"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ViewColumnsIcon,
  Squares2X2Icon,
  ChartBarIcon,
  ArrowPathIcon,
  EyeIcon,
  HeartIcon
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

export default function Home() {
  // State
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState("overall_intelligence");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedModels, setSelectedModels] = useState<AIModel[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [refreshing, setRefreshing] = useState(false);

  // Persistent state
  const [favoriteModels, setFavoriteModels] = useLocalStorage<string[]>('favorite-models', []);
  const [, setLastVisited] = useLocalStorage<string>('last-visited', '');

  // Effects
  useEffect(() => {
    fetchData();
    setLastVisited(new Date().toISOString());
  }, [setLastVisited]);

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
    
    return filtered;
  }, [models, selectedCompany, searchQuery]);

  const sortedModels = useMemo(() => {
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

  const paginatedModels = useMemo(() => {
    return sortedModels.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [sortedModels, page]);

  const totalPages = Math.ceil(sortedModels.length / PAGE_SIZE);

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
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleModelSelect = (model: AIModel) => {
    const isSelected = selectedModels.some((m) => m.id === model.id);
    if (isSelected) {
      setSelectedModels(selectedModels.filter((m) => m.id !== model.id));
    } else if (selectedModels.length < 3) {
      setSelectedModels([...selectedModels, model]);
    }
  };

  const toggleFavorite = (modelId: string) => {
    setFavoriteModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleClearSelection = () => {
    setSelectedModels([]);
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
              <Badge variant="secondary" size="md" className="px-4 py-2">
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Updated {stats.lastUpdated}
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
            onSearchChange={(query) => {
              setSearchQuery(query);
              setPage(1);
            }}
            selectedCompany={selectedCompany}
            onCompanyChange={(company) => {
              setSelectedCompany(company);
              setPage(1);
            }}
            companyOptions={companyOptions}
            totalResults={sortedModels.length}
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
            {selectedModels.length > 0 && (
              <>
                <Badge variant="info" size="md">
                  {selectedModels.length} selected
                </Badge>
                                 <Button
                   variant="primary"
                   size="sm"
                   disabled={selectedModels.length < 2}
                   onClick={() => {/* TODO: Implement comparison */}}
                 >
                   Compare Models
                 </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                >
                  Clear
                </Button>
              </>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              isLoading={refreshing}
              leftIcon={<ArrowPathIcon className="h-4 w-4" />}
            >
              Refresh
            </Button>
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
                    isSelected={selectedModels.some(m => m.id === model.id)}
                    isFavorite={favoriteModels.includes(model.id)}
                    onSelect={handleModelSelect}
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
                    <AnimatePresence mode="popLayout">
                      {paginatedModels.map((model, index) => {
                        const rank = (page - 1) * PAGE_SIZE + index + 1;
                        const isSelected = selectedModels.some(m => m.id === model.id);
                        const isFavorite = favoriteModels.includes(model.id);
                        
                        return (
                          <motion.tr
                            key={model.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                            className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${
                              isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            }`}
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
                                  <HeartIcon className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                                </Button>
                                <Button
                                  variant={isSelected ? 'primary' : 'outline'}
                                  size="sm"
                                  onClick={() => handleModelSelect(model)}
                                  disabled={!isSelected && selectedModels.length >= 3}
                                >
                                  {isSelected ? 'Selected' : 'Select'}
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            
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
                  <Button
                    key={pageNumber}
                    variant={page === pageNumber ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className="w-10"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </motion.div>
        )}
      </main>

      <Footer stats={stats} />
    </div>
  );
}
