"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon as HeartOutline,
  CheckCircleIcon,
  BuildingOfficeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import type { AIModel } from '../../lib/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { getCompanyColor, getScoreColor } from '../../lib/utils';
import { formatMetricValue, getMetricDefinition } from '../../lib/metrics';

interface ModelCardProps {
  model: AIModel;
  rank: number;
  selectedMetric: string;
  isSelected?: boolean;
  isFavorite?: boolean;
  onSelect?: (model: AIModel) => void;
  onToggleFavorite?: (modelId: string) => void;
  className?: string;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  rank,
  selectedMetric,
  isSelected = false,
  isFavorite = false,
  onSelect,
  onToggleFavorite,
  className = ''
}) => {
  const metricDef = getMetricDefinition(selectedMetric);
  const metricValue = selectedMetric === 'overall_intelligence' 
    ? model.overall_intelligence 
    : model.benchmark_scores?.[selectedMetric];

  const formattedValue = formatMetricValue(selectedMetric, metricValue);
  const scoreColor = getScoreColor(metricValue);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.02 }}
      className={`group relative ${className}`}
    >
      <div
        className={`relative p-6 bg-white dark:bg-gray-900 rounded-xl border transition-all duration-200 cursor-pointer ${
          isSelected
            ? 'border-blue-500 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg'
        }`}
        onClick={() => onSelect?.(model)}
      >
        {/* Rank Badge */}
        <div className="absolute -top-3 -left-3 z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
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
        </div>

        {/* Favorite Button */}
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(model.id);
            }}
            className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isFavorite ? (
              <HeartSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartOutline className="h-5 w-5 text-gray-400 hover:text-red-500" />
            )}
          </Button>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-4 left-4">
            <CheckCircleIcon className="h-5 w-5 text-blue-500" />
          </div>
        )}

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {model.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                <Badge 
                  size="sm" 
                  className={getCompanyColor(model.company)}
                >
                  {model.company}
                </Badge>
              </div>
            </div>
          </div>

          {/* Main Metric Score */}
          <div className="text-center py-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className={`text-3xl font-bold ${scoreColor}`}>
              {formattedValue}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {metricDef?.name || 'Score'}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* Intelligence Score */}
            {selectedMetric !== 'overall_intelligence' && (
              <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  {formatMetricValue('overall_intelligence', model.overall_intelligence)}
                </div>
                <div className="text-xs text-blue-600/70 dark:text-blue-400/70">
                  Intelligence
                </div>
              </div>
            )}

            {/* Speed */}
            {model.benchmark_scores?.speed && (
              <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="font-semibold text-green-600 dark:text-green-400">
                  {formatMetricValue('speed', model.benchmark_scores.speed)}
                </div>
                <div className="text-xs text-green-600/70 dark:text-green-400/70">
                  Speed
                </div>
              </div>
            )}

            {/* Coding */}
            {model.benchmark_scores?.coding && (
              <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="font-semibold text-purple-600 dark:text-purple-400">
                  {formatMetricValue('coding', model.benchmark_scores.coding)}
                </div>
                <div className="text-xs text-purple-600/70 dark:text-purple-400/70">
                  Coding
                </div>
              </div>
            )}

            {/* Cost Efficiency */}
            {model.benchmark_scores?.cost_efficiency && (
              <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="font-semibold text-orange-600 dark:text-orange-400">
                  {formatMetricValue('cost_efficiency', model.benchmark_scores.cost_efficiency)}
                </div>
                <div className="text-xs text-orange-600/70 dark:text-orange-400/70">
                  Efficiency
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {model.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {model.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
            {/* Special Indicators */}
            <div className="flex items-center gap-1">
              {rank <= 3 && (
                <SparklesIcon className="h-4 w-4 text-yellow-500" title="Top performer" />
              )}
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </motion.div>
  );
};