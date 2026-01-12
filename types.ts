export interface Measurement {
  id: string;
  date: string; // ISO date string
  weight: number; // lbs
  bodyFatPercentage: number; // %
  visceralFatLevel: number; // level (1-59 usually)
  leanMass: number; // lbs (calculated)
  waist: number; // cm (circumference)
  notes?: string;
}

export interface GoalMetrics {
  weight: number;
  bodyFat: number;
  visceralFat: number;
  waist: number;
}

export interface Goals {
  intermediate: GoalMetrics;
  final: GoalMetrics;
}

export interface AIAnalysis {
  text: string;
  timestamp: number;
}

export type ViewState = 'dashboard' | 'history' | 'settings';