export type ItemCategory = 'pottery' | 'fragrance' | 'hot' | 'normal';
export type ItemSize = 'large' | 'medium' | 'small';
export type GridSpec = '9x8' | '3x8';

export interface CraftItem {
  id: string;
  name: string;
  emoji: string;
  category: ItemCategory;
  size: ItemSize;
  isHot: boolean;
}

export interface GridCellData {
  row: number;
  col: number;
  itemId: string | null;
}

export type RuleType =
  | 'large_on_bottom'
  | 'small_on_top'
  | 'hot_on_visual_zone'
  | 'must_place_all';

export interface DisplayRule {
  id: string;
  type: RuleType;
  description: string;
  params?: Record<string, unknown>;
}

export interface LevelConfig {
  id: number;
  name: string;
  rows: number;
  cols: number;
  gridSpec: GridSpec;
  difficulty: 1 | 2 | 3;
  items: Array<{ itemId: string; count: number }>;
  rules: DisplayRule[];
  visualZone?: { rows: [number, number]; cols: [number, number] };
}

export interface Violation {
  row: number;
  col: number;
  ruleId: string;
  msg: string;
}

export interface HistorySnapshot {
  grid: GridCellData[][];
  inventory: Record<string, number>;
}

export interface GameStateShape {
  currentLevelId: number;
  grid: GridCellData[][];
  inventory: Record<string, number>;
  history: HistorySnapshot[];
  violations: Violation[];
  isPassed: boolean;
  passedLevels: number[];
  showLevelSelector: boolean;
  autoCheck: boolean;
  startTime: number | null;
  elapsed: number;
  bestTimes: Record<number, number>;
  isNewRecord: boolean;
}
