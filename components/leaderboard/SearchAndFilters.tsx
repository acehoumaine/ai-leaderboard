"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
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
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search models or companies..."
            value={tempSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Company Filter */}
        <select
          value={selectedCompany}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCompanyChange(e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Companies</option>
          {companyOptions.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        {/* Advanced Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors ${
            showAdvanced
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FunnelIcon className="h-4 w-4" />
                Advanced Filters
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Score Range */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-600">
                    Intelligence Score Range
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-20 px-2 py-1.5 text-sm rounded-md border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="100"
                      value={advancedFilters.minScore ?? ''}
                      onChange={e => onAdvancedFiltersChange({ ...advancedFilters, minScore: e.target.value ? Number(e.target.value) : undefined })}
                    />
                    <span className="text-gray-400 text-sm">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-20 px-2 py-1.5 text-sm rounded-md border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="100"
                      value={advancedFilters.maxScore ?? ''}
                      onChange={e => onAdvancedFiltersChange({ ...advancedFilters, maxScore: e.target.value ? Number(e.target.value) : undefined })}
                    />
                  </div>
                </div>

                {/* Capabilities */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-600">
                    Has Data For
                  </label>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={advancedFilters.hasCoding}
                        onChange={e => onAdvancedFiltersChange({ ...advancedFilters, hasCoding: e.target.checked })}
                      />
                      Coding score
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={advancedFilters.hasSpeed}
                        onChange={e => onAdvancedFiltersChange({ ...advancedFilters, hasSpeed: e.target.checked })}
                      />
                      Speed data
                    </label>
                  </div>
                </div>

                {/* Sort Order */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-600">
                    Sort Order
                  </label>
                  <select
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Active Filters & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {hasActiveFilters && (
            <>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md">
                  &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => { setTempSearch(''); onSearchChange(''); }} className="hover:text-red-500">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedCompany && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md">
                  {selectedCompany}
                  <button onClick={() => onCompanyChange('')} className="hover:text-red-500">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {advancedFilters.minScore !== undefined && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md">
                  Min: {advancedFilters.minScore}
                  <button onClick={() => onAdvancedFiltersChange({ ...advancedFilters, minScore: undefined })} className="hover:text-red-500">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {advancedFilters.maxScore !== undefined && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md">
                  Max: {advancedFilters.maxScore}
                  <button onClick={() => onAdvancedFiltersChange({ ...advancedFilters, maxScore: undefined })} className="hover:text-red-500">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {advancedFilters.hasCoding && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md">
                  Has Coding
                  <button onClick={() => onAdvancedFiltersChange({ ...advancedFilters, hasCoding: false })} className="hover:text-red-500">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {advancedFilters.hasSpeed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md">
                  Has Speed
                  <button onClick={() => onAdvancedFiltersChange({ ...advancedFilters, hasSpeed: false })} className="hover:text-red-500">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            </>
          )}
        </div>

        <span className="text-xs text-gray-400">
          {totalResults} {totalResults === 1 ? 'model' : 'models'}
        </span>
      </div>
    </div>
  );
};
