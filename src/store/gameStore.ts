import { create } from 'zustand';
import type {
  GameStateShape,
  GridCellData,
  HistorySnapshot,
  LevelConfig,
  Violation,
} from '@/types';
import { levels, getLevelById } from '@/data/levels';
import { validateLayout } from '@/utils/validationEngine';

function createEmptyGrid(rows: number, cols: number): GridCellData[][] {
  const grid: GridCellData[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: GridCellData[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({ row: r, col: c, itemId: null });
    }
    grid.push(row);
  }
  return grid;
}

function createInventoryFromLevel(level: LevelConfig): Record<string, number> {
  const inv: Record<string, number> = {};
  level.items.forEach((entry) => {
    inv[entry.itemId] = entry.count;
  });
  return inv;
}

function cloneGrid(grid: GridCellData[][]): GridCellData[][] {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

const STORAGE_KEY = 'craft_shelf_passed_levels_v1';
const BEST_TIMES_KEY = 'craft_shelf_best_times_v1';

function loadPassedLevels(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'number') : [];
  } catch {
    return [];
  }
}

function savePassedLevels(ids: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

function loadBestTimes(): Record<number, number> {
  try {
    const raw = localStorage.getItem(BEST_TIMES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const result: Record<number, number> = {};
    Object.entries(parsed).forEach(([k, v]) => {
      const key = Number(k);
      if (!Number.isNaN(key) && typeof v === 'number') {
        result[key] = v;
      }
    });
    return result;
  } catch {
    return {};
  }
}

function saveBestTimes(times: Record<number, number>): void {
  try {
    localStorage.setItem(BEST_TIMES_KEY, JSON.stringify(times));
  } catch {
    /* ignore */
  }
}

const initialLevel = levels[0];

type StoreApi = {
  getState: () => GameStateShape & { rulePassed: Record<string, boolean>; lastRule: LevelConfig };
  setState: (patch: Partial<GameStateShape & { rulePassed: Record<string, boolean>; lastRule: LevelConfig }>) => void;
};

function pushHistory(api: StoreApi) {
  const { history, grid, inventory } = api.getState();
  const snap: HistorySnapshot = {
    grid: cloneGrid(grid),
    inventory: { ...inventory },
  };
  api.setState({ history: [...history, snap].slice(-50) });
}

export const useGameStore = create<
  GameStateShape & {
    rulePassed: Record<string, boolean>;
    lastRule: LevelConfig;
    placeItem: (row: number, col: number, itemId: string) => void;
    removeItem: (row: number, col: number) => void;
    moveItem: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
    undo: () => void;
    clearAll: () => void;
    checkRules: () => void;
    selectLevel: (id: number) => void;
    nextLevel: () => void;
    setLevelSelectorVisible: (v: boolean) => void;
    resetCurrentLevel: () => void;
    toggleAutoCheck: () => void;
    getViolationsAt: (row: number, col: number) => Violation[];
    tickTimer: () => void;
  }
>((set, get) => {
  const api: StoreApi = { getState: get as any, setState: set as any };

  return {
  currentLevelId: initialLevel.id,
  grid: createEmptyGrid(initialLevel.rows, initialLevel.cols),
  inventory: createInventoryFromLevel(initialLevel),
  history: [],
  violations: [],
  rulePassed: {},
  isPassed: false,
  passedLevels: loadPassedLevels(),
  showLevelSelector: false,
  lastRule: initialLevel,
  autoCheck: false,
  startTime: Date.now(),
  elapsed: 0,
  bestTimes: loadBestTimes(),
  isNewRecord: false,

  placeItem(row, col, itemId) {
    const state = get();
    const level = getLevelById(state.currentLevelId);
    if (!level) return;
    if ((state.inventory[itemId] || 0) <= 0) return;

    const cell = state.grid[row]?.[col];
    if (!cell) return;

    pushHistory(api);
    const newGrid = cloneGrid(state.grid);
    const newInv = { ...state.inventory };

    if (newGrid[row][col].itemId) {
      const existing = newGrid[row][col].itemId!;
      newInv[existing] = (newInv[existing] || 0) + 1;
    }

    newGrid[row][col] = { ...newGrid[row][col], itemId };
    newInv[itemId] = (newInv[itemId] || 0) - 1;

    set({
      grid: newGrid,
      inventory: newInv,
      violations: [],
      rulePassed: {},
      isPassed: false,
      isNewRecord: false,
    });

    if (get().autoCheck) {
      get().checkRules();
    }
  },

  removeItem(row, col) {
    const state = get();
    const cell = state.grid[row]?.[col];
    if (!cell || !cell.itemId) return;

    pushHistory(api);
    const newGrid = cloneGrid(state.grid);
    const newInv = { ...state.inventory };
    const itemId = cell.itemId;
    newGrid[row][col] = { ...newGrid[row][col], itemId: null };
    newInv[itemId] = (newInv[itemId] || 0) + 1;

    set({
      grid: newGrid,
      inventory: newInv,
      violations: [],
      rulePassed: {},
      isPassed: false,
      isNewRecord: false,
    });

    if (get().autoCheck) {
      get().checkRules();
    }
  },

  moveItem(fromRow, fromCol, toRow, toCol) {
    const state = get();
    if (fromRow === toRow && fromCol === toCol) return;
    const from = state.grid[fromRow]?.[fromCol];
    const to = state.grid[toRow]?.[toCol];
    if (!from || !to || !from.itemId) return;

    pushHistory(api);
    const newGrid = cloneGrid(state.grid);
    const newInv = { ...state.inventory };

    const movedId = from.itemId;
    const replacedId = to.itemId;

    newGrid[fromRow][fromCol] = { ...newGrid[fromRow][fromCol], itemId: replacedId };
    newGrid[toRow][toCol] = { ...newGrid[toRow][toCol], itemId: movedId };

    set({
      grid: newGrid,
      inventory: newInv,
      violations: [],
      rulePassed: {},
      isPassed: false,
      isNewRecord: false,
    });

    if (get().autoCheck) {
      get().checkRules();
    }
  },

  undo() {
    const { history } = get();
    if (history.length === 0) return;
    const last = history[history.length - 1];
    set({
      grid: cloneGrid(last.grid),
      inventory: { ...last.inventory },
      history: history.slice(0, -1),
      violations: [],
      rulePassed: {},
      isPassed: false,
      isNewRecord: false,
    });
  },

  clearAll() {
    const state = get();
    const level = getLevelById(state.currentLevelId);
    if (!level) return;
    pushHistory(api);
    set({
      grid: createEmptyGrid(level.rows, level.cols),
      inventory: createInventoryFromLevel(level),
      violations: [],
      rulePassed: {},
      isPassed: false,
      isNewRecord: false,
    });
  },

  tickTimer() {
    const state = get();
    if (state.isPassed || state.startTime === null) return;
    const now = Date.now();
    const elapsed = Math.floor((now - state.startTime) / 1000);
    set({ elapsed });
  },

  checkRules() {
    const state = get();
    const level = getLevelById(state.currentLevelId);
    if (!level) return;
    const result = validateLayout(level, state.grid, state.inventory);
    const newPassed = result.allPassed ? [...new Set([...state.passedLevels, level.id])] : state.passedLevels;
    if (result.allPassed) savePassedLevels(newPassed);

    let newBestTimes = state.bestTimes;
    let isNewRecord = false;
    let finalElapsed = state.elapsed;

    if (result.allPassed && state.startTime !== null) {
      finalElapsed = Math.floor((Date.now() - state.startTime) / 1000);
      const currentBest = state.bestTimes[level.id];
      if (currentBest === undefined || finalElapsed < currentBest) {
        newBestTimes = { ...state.bestTimes, [level.id]: finalElapsed };
        saveBestTimes(newBestTimes);
        isNewRecord = true;
      }
    }

    set({
      violations: result.violations,
      rulePassed: result.rulePassed,
      isPassed: result.allPassed,
      passedLevels: newPassed,
      elapsed: finalElapsed,
      bestTimes: newBestTimes,
      isNewRecord,
    });
  },

  selectLevel(id) {
    const level = getLevelById(id);
    if (!level) return;
    set({
      currentLevelId: id,
      grid: createEmptyGrid(level.rows, level.cols),
      inventory: createInventoryFromLevel(level),
      history: [],
      violations: [],
      rulePassed: {},
      isPassed: false,
      lastRule: level,
      showLevelSelector: false,
      startTime: Date.now(),
      elapsed: 0,
      isNewRecord: false,
    });
  },

  nextLevel() {
    const state = get();
    const idx = levels.findIndex((l) => l.id === state.currentLevelId);
    if (idx < 0) return;
    const next = levels[idx + 1] || levels[0];
    get().selectLevel(next.id);
  },

  resetCurrentLevel() {
    get().selectLevel(get().currentLevelId);
  },

  setLevelSelectorVisible(v) {
    set({ showLevelSelector: v });
  },

  toggleAutoCheck() {
    const newVal = !get().autoCheck;
    set({ autoCheck: newVal });
    if (newVal) {
      get().checkRules();
    }
  },

  getViolationsAt(row, col) {
    return get().violations.filter((v) => v.row === row && v.col === col);
  },
}});
