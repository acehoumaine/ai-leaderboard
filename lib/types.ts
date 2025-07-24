export interface BenchmarkScores {
  speed?: number;
  latency?: number;
  price?: number;
  cost_efficiency?: number;
  coding?: number;
  math?: number;
  reasoning?: number;
  mmlu_pro?: number;
  gpqa?: number;
  hle?: number;
  livecodebench?: number;
  scicode?: number;
  math_500?: number;
  aime?: number;
  time_to_first_answer_token?: number;
  [key: string]: number | undefined;
}

export interface AIModel {
  id: string;
  name: string;
  company: string;
  description?: string;
  last_updated?: string;
  overall_intelligence: number;
  benchmark_scores: BenchmarkScores;
  source_id?: string;
}

export interface ModelComparison {
  models: AIModel[];
  selectedMetrics: string[];
}

export interface FilterOptions {
  companies: string[];
  minScore?: number;
  maxScore?: number;
  hasSpeed?: boolean;
  hasCoding?: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface SearchFilters {
  query: string;
  company: string;
  metric: string;
  page: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  favoriteModels: string[];
  defaultMetric: string;
  itemsPerPage: number;
  comparisonView: 'table' | 'chart';
}

export interface MetricDefinition {
  key: string;
  name: string;
  shortName: string;
  description: string;
  unit?: string;
  formatter: (value: number | undefined | null) => string;
  higherIsBetter: boolean;
  category: 'performance' | 'efficiency' | 'capability';
}

export interface CompanyInfo {
  name: string;
  slug: string;
  color: string;
  modelCount: number;
  avgScore: number;
}

export interface LeaderboardStats {
  totalModels: number;
  totalCompanies: number;
  lastUpdated: string;
  topModel: AIModel | null;
  avgIntelligence: number;
}

export type AdminFormState = {
  name: string;
  company: string;
  description: string;
  overall_intelligence: string;
  speed: string;
  cost_efficiency: string;
  coding: string;
  reasoning: string;
};

export type SortDirection = 'asc' | 'desc';

export type ViewMode = 'table' | 'grid' | 'compact';

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
} 