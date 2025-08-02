"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { debounce } from '../../lib/utils';

interface AdvancedFilters {
  minScore?: number;
  maxScore?: number;
  hasCoding?: boolean;
  hasSpeed?: boolean;
  sortOrder?: string;
}

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCompany: string;
  onCompanyChange: (company: string) => void;
  companyOptions: string[];
  totalResults: number;
  advancedFilters: AdvancedFilters;
  onAdvancedFiltersChange: (filters: AdvancedFilters) => void;
  className?: string;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCompany,
  onCompanyChange,
  companyOptions,
  totalResults,
  advancedFilters,
  onAdvancedFiltersChange,
  className = ''
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [tempSearch, setTempSearch] = React.useState(searchQuery);

  // Debounced search
  const debouncedSearch = React.useMemo(
    () => debounce((...args: unknown[]) => onSearchChange(args[0] as string), 300),
    [onSearchChange]
  );

  React.useEffect(() => {
    debouncedSearch(tempSearch);
  }, [tempSearch, debouncedSearch]);

  const hasActiveFilters = selectedCompany || searchQuery || 
    advancedFilters.minScore !== undefined || 
    advancedFilters.maxScore !== undefined || 
    advancedFilters.hasCoding || 
    advancedFilters.hasSpeed || 
    advancedFilters.sortOrder !== 'desc';
  const clearAllFilters = () => {
    setTempSearch('');
    onSearchChange('');
    onCompanyChange('');
    onAdvancedFiltersChange({
      minScore: undefined,
      maxScore: undefined,
      hasCoding: false,
      hasSpeed: false,
      sortOrder: 'desc',
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search models, companies, or capabilities..."
            value={tempSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempSearch(e.target.value)}
            leftIcon={<MagnifyingGlassIcon />}
            className="w-full"
          />
        </div>
        
        {/* Company Filter */}
        <div className="flex gap-2">
          <select
            value={selectedCompany}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCompanyChange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All Companies</option>
            {companyOptions.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            leftIcon={<AdjustmentsHorizontalIcon className="h-4 w-4" />}
            className={showAdvanced ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}
          >
            <span className="hidden sm:inline">Advanced</span>
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <FunnelIcon className="h-4 w-4" />
                Advanced Filters
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Score Range */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Intelligence Score Range
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-20 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                      min="0"
                      max="100"
                      value={advancedFilters.minScore ?? ''}
                      onChange={e => onAdvancedFiltersChange({ ...advancedFilters, minScore: e.target.value ? Number(e.target.value) : undefined })}
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-20 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                      min="0"
                      max="100"
                      value={advancedFilters.maxScore ?? ''}
                      onChange={e => onAdvancedFiltersChange({ ...advancedFilters, maxScore: e.target.value ? Number(e.target.value) : undefined })}
                    />
                  </div>
                </div>

                {/* Has Coding Score */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Capabilities
                  </label>
                  <div className="space-y-1">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={advancedFilters.hasCoding}
                        onChange={e => onAdvancedFiltersChange({ ...advancedFilters, hasCoding: e.target.checked })}
                      />
                      <span className="ml-2 text-sm">Has Coding Score</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={advancedFilters.hasSpeed}
                        onChange={e => onAdvancedFiltersChange({ ...advancedFilters, hasSpeed: e.target.checked })}
                      />
                      <span className="ml-2 text-sm">Has Speed Data</span>
                    </label>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sort Order
                  </label>
                  <select
                    className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    value={advancedFilters.sortOrder}
                    onChange={e => onAdvancedFiltersChange({ ...advancedFilters, sortOrder: e.target.value })}
                  >
                    <option value="desc">Highest First</option>
                    <option value="asc">Lowest First</option>
                    <option value="name">Alphabetical</option>
                    <option value="recent">Recently Updated</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters & Results Count */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {hasActiveFilters && (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Active filters:
              </span>
              
              {searchQuery && (
                                 <Badge variant="secondary" className="flex items-center gap-1">
                   Search: &ldquo;{searchQuery}&rdquo;
                   <button
                    onClick={() => {
                      setTempSearch('');
                      onSearchChange('');
                    }}
                    className="ml-1 hover:text-red-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {selectedCompany && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Company: {selectedCompany}
                  <button
                    onClick={() => onCompanyChange('')}
                    className="ml-1 hover:text-red-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {/* Advanced Filters Indicators */}
              {advancedFilters.minScore !== undefined && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Min Score: {advancedFilters.minScore}
                  <button
                    onClick={() => onAdvancedFiltersChange({ ...advancedFilters, minScore: undefined })}
                    className="ml-1 hover:text-red-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {advancedFilters.maxScore !== undefined && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Max Score: {advancedFilters.maxScore}
                  <button
                    onClick={() => onAdvancedFiltersChange({ ...advancedFilters, maxScore: undefined })}
                    className="ml-1 hover:text-red-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {advancedFilters.hasCoding && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Has Coding
                  <button
                    onClick={() => onAdvancedFiltersChange({ ...advancedFilters, hasCoding: false })}
                    className="ml-1 hover:text-red-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {advancedFilters.hasSpeed && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Has Speed
                  <button
                    onClick={() => onAdvancedFiltersChange({ ...advancedFilters, hasSpeed: false })}
                    className="ml-1 hover:text-red-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {advancedFilters.sortOrder !== 'desc' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Sort: {advancedFilters.sortOrder === 'asc' ? 'Lowest First' : 
                         advancedFilters.sortOrder === 'name' ? 'Alphabetical' : 'Recently Updated'}
                  <button
                    onClick={() => onAdvancedFiltersChange({ ...advancedFilters, sortOrder: 'desc' })}
                    className="ml-1 hover:text-red-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear all
              </Button>
            </>
          )}
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <motion.span
            key={totalResults}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {totalResults} {totalResults === 1 ? 'model' : 'models'} found
          </motion.span>
        </div>
      </div>
    </div>
  );
};