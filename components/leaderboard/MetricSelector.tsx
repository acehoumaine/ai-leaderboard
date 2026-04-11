"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { PRIMARY_METRICS, METRIC_DEFINITIONS, METRIC_CATEGORIES, getMetricsByCategory } from '../../lib/metrics';

interface MetricSelectorProps {
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
  className?: string;
}

export const MetricSelector: React.FC<MetricSelectorProps> = ({
  selectedMetric,
  onMetricChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedDef = METRIC_DEFINITIONS[selectedMetric];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Primary Metrics */}
      <div className="flex flex-wrap gap-2 items-center">
        {PRIMARY_METRICS.map((metricKey) => {
          const metric = METRIC_DEFINITIONS[metricKey];
          const isSelected = selectedMetric === metricKey;

          return (
            <button
              key={metricKey}
              onClick={() => onMetricChange(metricKey)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              {metric.shortName}
            </button>
          );
        })}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          More Metrics
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className="h-3.5 w-3.5" />
          </motion.div>
        </button>
      </div>

      {/* Expanded Metrics */}
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-5">
          {Object.entries(METRIC_CATEGORIES).map(([categoryKey, category]) => {
            const metrics = getMetricsByCategory(categoryKey as keyof typeof METRIC_CATEGORIES);
            const categoryMetrics = metrics.filter(m => !PRIMARY_METRICS.includes(m.key));

            if (categoryMetrics.length === 0) return null;

            return (
              <div key={categoryKey} className="space-y-2">
                <div>
                  <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    {category.name}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    {category.description}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {categoryMetrics.map((metric) => {
                    const isSelected = selectedMetric === metric.key;

                    return (
                      <button
                        key={metric.key}
                        onClick={() => onMetricChange(metric.key)}
                        title={metric.description}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
                        }`}
                      >
                        {metric.shortName}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Selected Metric Info */}
      {selectedDef && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          key={selectedMetric}
          className="flex items-center justify-between px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg"
        >
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-blue-900">
              {selectedDef.name}
            </span>
            <span className="text-xs text-blue-600">
              {selectedDef.description}
            </span>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            selectedDef.higherIsBetter
              ? 'bg-green-100 text-green-700'
              : 'bg-orange-100 text-orange-700'
          }`}>
            {selectedDef.higherIsBetter ? 'Higher is better' : 'Lower is better'}
          </span>
        </motion.div>
      )}
    </div>
  );
};
