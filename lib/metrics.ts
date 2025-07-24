import type { MetricDefinition } from './types';
import { formatNumber, formatPercentage, formatCurrency, formatSpeed, formatLatency } from './utils';

export const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
  overall_intelligence: {
    key: 'overall_intelligence',
    name: 'Overall Intelligence',
    shortName: 'Intelligence',
    description: 'Comprehensive intelligence score combining multiple evaluation benchmarks',
    formatter: (value) => formatNumber(value, 1),
    higherIsBetter: true,
    category: 'capability'
  },
  speed: {
    key: 'speed',
    name: 'Output Speed',
    shortName: 'Speed',
    description: 'Tokens generated per second during inference',
    unit: 'tokens/sec',
    formatter: formatSpeed,
    higherIsBetter: true,
    category: 'performance'
  },
  latency: {
    key: 'latency',
    name: 'Response Latency',
    shortName: 'Latency',
    description: 'Time to first token generation',
    unit: 'seconds',
    formatter: formatLatency,
    higherIsBetter: false,
    category: 'performance'
  },
  price: {
    key: 'price',
    name: 'Price per 1M Tokens',
    shortName: 'Price',
    description: 'Cost per million tokens (blended input/output)',
    unit: 'USD',
    formatter: formatCurrency,
    higherIsBetter: false,
    category: 'efficiency'
  },
  cost_efficiency: {
    key: 'cost_efficiency',
    name: 'Cost Efficiency',
    shortName: 'Efficiency',
    description: 'Value per dollar spent (inverse of price)',
    formatter: (value) => formatNumber(value, 3),
    higherIsBetter: true,
    category: 'efficiency'
  },
  coding: {
    key: 'coding',
    name: 'Coding Ability',
    shortName: 'Coding',
    description: 'Performance on programming and software development tasks',
    formatter: (value) => formatNumber(value, 1),
    higherIsBetter: true,
    category: 'capability'
  },
  math: {
    key: 'math',
    name: 'Mathematical Reasoning',
    shortName: 'Math',
    description: 'Performance on mathematical problem-solving tasks',
    formatter: (value) => formatNumber(value, 1),
    higherIsBetter: true,
    category: 'capability'
  },
  mmlu_pro: {
    key: 'mmlu_pro',
    name: 'General Knowledge (MMLU Pro)',
    shortName: 'MMLU Pro',
    description: 'Massive Multitask Language Understanding - Professional level',
    formatter: formatPercentage,
    higherIsBetter: true,
    category: 'capability'
  },
  gpqa: {
    key: 'gpqa',
    name: 'Graduate-Level Q&A',
    shortName: 'GPQA',
    description: 'Graduate-level Google-proof Q&A benchmark',
    formatter: formatPercentage,
    higherIsBetter: true,
    category: 'capability'
  },
  hle: {
    key: 'hle',
    name: 'High-Level English',
    shortName: 'HLE',
    description: 'Advanced English language comprehension and usage',
    formatter: formatPercentage,
    higherIsBetter: true,
    category: 'capability'
  },
  livecodebench: {
    key: 'livecodebench',
    name: 'Live Code Benchmark',
    shortName: 'LiveCode',
    description: 'Real-world coding challenges and problem-solving',
    formatter: formatPercentage,
    higherIsBetter: true,
    category: 'capability'
  },
  scicode: {
    key: 'scicode',
    name: 'Scientific Coding',
    shortName: 'SciCode',
    description: 'Scientific computing and research-oriented programming',
    formatter: formatPercentage,
    higherIsBetter: true,
    category: 'capability'
  },
  math_500: {
    key: 'math_500',
    name: 'Math 500',
    shortName: 'Math 500',
    description: 'Comprehensive mathematical problem-solving benchmark',
    formatter: formatPercentage,
    higherIsBetter: true,
    category: 'capability'
  },
  aime: {
    key: 'aime',
    name: 'AIME Math Competition',
    shortName: 'AIME',
    description: 'American Invitational Mathematics Examination problems',
    formatter: formatPercentage,
    higherIsBetter: true,
    category: 'capability'
  },
  time_to_first_answer_token: {
    key: 'time_to_first_answer_token',
    name: 'Time to First Answer Token',
    shortName: 'TTFAT',
    description: 'Time to generate the first answer token (for reasoning models)',
    unit: 'seconds',
    formatter: formatLatency,
    higherIsBetter: false,
    category: 'performance'
  }
};

export const PRIMARY_METRICS = [
  'overall_intelligence',
  'speed',
  'cost_efficiency',
  'coding'
];

export const METRIC_CATEGORIES = {
  capability: {
    name: 'Capability',
    description: 'Model intelligence and reasoning abilities',
    color: 'blue'
  },
  performance: {
    name: 'Performance',
    description: 'Speed and responsiveness metrics',
    color: 'green'
  },
  efficiency: {
    name: 'Efficiency',
    description: 'Cost-effectiveness and resource utilization',
    color: 'purple'
  }
};

export function getMetricDefinition(key: string): MetricDefinition | undefined {
  return METRIC_DEFINITIONS[key];
}

export function getMetricsByCategory(category: keyof typeof METRIC_CATEGORIES): MetricDefinition[] {
  return Object.values(METRIC_DEFINITIONS).filter(metric => metric.category === category);
}

export function formatMetricValue(key: string, value: number | undefined | null): string {
  const definition = getMetricDefinition(key);
  if (!definition) return formatNumber(value);
  return definition.formatter(value);
}

export function getMetricColor(key: string): string {
  const definition = getMetricDefinition(key);
  if (!definition) return 'blue';
  return METRIC_CATEGORIES[definition.category].color;
}