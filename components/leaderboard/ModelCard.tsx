"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  HeartIcon as HeartOutline,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import type { AIModel } from '../../lib/types';
import { getCompanyColor } from '../../lib/utils';
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(rank * 0.02, 0.4) }}
      className={`group relative ${className}`}
    >
      <div
        className={`relative p-5 bg-white rounded-xl border transition-all duration-200 cursor-pointer ${
          isSelected
            ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        }`}
        onClick={() => onSelect?.(model)}
      >
        {/* Rank Badge */}
        <div className="absolute -top-2.5 -left-2.5 z-10">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow ${
            rank === 1
              ? 'bg-yellow-400 text-yellow-900'
              : rank === 2
              ? 'bg-gray-300 text-gray-700'
              : rank === 3
              ? 'bg-orange-300 text-orange-900'
              : 'bg-white border border-gray-200 text-gray-500'
          }`}>
            {rank}
          </div>
        </div>

        {/* Favorite Button */}
        <button
          className="absolute top-3 right-3 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-50 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(model.id);
          }}
        >
          {isFavorite ? (
            <HeartSolid className="h-4 w-4 text-red-500" />
          ) : (
            <HeartOutline className="h-4 w-4 text-gray-400 hover:text-red-400" />
          )}
        </button>

        <div className="space-y-3 mt-1">
          {/* Name + Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 truncate pr-6">
              {model.name}
            </h3>
            <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium ${getCompanyColor(model.company)}`}>
              {model.company}
            </span>
          </div>

          {/* Primary Score */}
          <div className="text-center py-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 tabular-nums">
              {formattedValue}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {metricDef?.shortName || 'Score'}
            </div>
          </div>

          {/* Secondary metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {selectedMetric !== 'overall_intelligence' && (
              <div className="text-center p-1.5 bg-blue-50 rounded-md">
                <div className="font-semibold text-blue-700 tabular-nums">
                  {formatMetricValue('overall_intelligence', model.overall_intelligence)}
                </div>
                <div className="text-blue-500/70">Intelligence</div>
              </div>
            )}
            {model.benchmark_scores?.speed && (
              <div className="text-center p-1.5 bg-green-50 rounded-md">
                <div className="font-semibold text-green-700 tabular-nums">
                  {formatMetricValue('speed', model.benchmark_scores.speed)}
                </div>
                <div className="text-green-500/70">Speed</div>
              </div>
            )}
            {model.benchmark_scores?.coding && (
              <div className="text-center p-1.5 bg-purple-50 rounded-md">
                <div className="font-semibold text-purple-700 tabular-nums">
                  {formatMetricValue('coding', model.benchmark_scores.coding)}
                </div>
                <div className="text-purple-500/70">Coding</div>
              </div>
            )}
            {model.benchmark_scores?.cost_efficiency && (
              <div className="text-center p-1.5 bg-orange-50 rounded-md">
                <div className="font-semibold text-orange-700 tabular-nums">
                  {formatMetricValue('cost_efficiency', model.benchmark_scores.cost_efficiency)}
                </div>
                <div className="text-orange-500/70">Efficiency</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
