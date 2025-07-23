export interface BenchmarkScores {
  speed?: number;
  cost_efficiency?: number;
  coding?: number;
  reasoning?: number;
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