"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { PRIMARY_METRICS, METRIC_DEFINITIONS, METRIC_CATEGORIES, getMetricsByCategory } from '../../lib/metrics';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

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
    <div className={`relative ${className}`}>
      {/* Primary Metrics (Always Visible) */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PRIMARY_METRICS.map((metricKey) => {
          const metric = METRIC_DEFINITIONS[metricKey];
          const isSelected = selectedMetric === metricKey;
          
          return (
            <Button
              key={metricKey}
              variant={isSelected ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onMetricChange(metricKey)}
              className={`relative ${isSelected ? 'shadow-lg' : ''}`}
            >
              {isSelected && (
                <motion.div
                  layoutId="metric-indicator"
                  className="absolute inset-0 bg-blue-600 rounded-lg"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{metric.shortName}</span>
            </Button>
          );
        })}
        
        {/* More Metrics Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          rightIcon={
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDownIcon className="h-4 w-4" />
            </motion.div>
          }
        >
          More Metrics
        </Button>
      </div>

      {/* Expanded Metrics */}
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="space-y-6 pb-4">
          {Object.entries(METRIC_CATEGORIES).map(([categoryKey, category]) => {
            const metrics = getMetricsByCategory(categoryKey as keyof typeof METRIC_CATEGORIES);
            const categoryMetrics = metrics.filter(m => !PRIMARY_METRICS.includes(m.key));
            
            if (categoryMetrics.length === 0) return null;

            return (
              <div key={categoryKey} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" size="sm">
                    {category.name}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {category.description}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {categoryMetrics.map((metric) => {
                    const isSelected = selectedMetric === metric.key;
                    
                    return (
                      <Button
                        key={metric.key}
                        variant={isSelected ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => onMetricChange(metric.key)}
                        className="text-xs"
                        title={metric.description}
                      >
                        {metric.shortName}
                      </Button>
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={selectedMetric}
          className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                {selectedDef.name}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                {selectedDef.description}
              </p>
            </div>
            <Badge 
              variant={selectedDef.higherIsBetter ? 'success' : 'warning'}
              size="sm"
            >
              {selectedDef.higherIsBetter ? 'Higher is better' : 'Lower is better'}
            </Badge>
          </div>
        </motion.div>
      )}
    </div>
  );
};