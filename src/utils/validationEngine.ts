import type { LevelConfig, GridCellData, Violation } from '@/types';
import { getItemById } from '@/data/craftItems';

const cloneGrid = (grid: GridCellData[][]): GridCellData[][] =>
  grid.map((row) => row.map((cell) => ({ ...cell })));

export function checkLargeOnBottom(
  level: LevelConfig,
  grid: GridCellData[][],
): Violation[] {
  const violations: Violation[] = [];
  const rows = grid.length;
  const bottomStart = Math.max(0, rows - 2);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const cell = grid[r][c];
      if (!cell.itemId) continue;
      const item = getItemById(cell.itemId);
      if (!item) continue;
      if (item.category === 'pottery' && item.size === 'large') {
        if (r < bottomStart) {
          violations.push({
            row: r,
            col: c,
            ruleId: 'r1',
            msg: `大件「${item.name}」需放在货架最下方两层（第 ${bottomStart + 1}~${rows} 行）`,
          });
        }
      }
    }
  }
  return violations;
}

export function checkSmallOnTop(
  level: LevelConfig,
  grid: GridCellData[][],
): Violation[] {
  const violations: Violation[] = [];
  const rows = grid.length;
  const topEnd = Math.min(2, rows);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const cell = grid[r][c];
      if (!cell.itemId) continue;
      const item = getItemById(cell.itemId);
      if (!item) continue;
      if (item.category === 'fragrance' && item.size === 'small') {
        if (r >= topEnd) {
          violations.push({
            row: r,
            col: c,
            ruleId: 'r2',
            msg: `小件「${item.name}」需放在货架最上方两层（第 1~${topEnd} 行）`,
          });
        }
      }
    }
  }
  return violations;
}

export function checkHotInVisualZone(
  level: LevelConfig,
  grid: GridCellData[][],
): Violation[] {
  const violations: Violation[] = [];
  const vz = level.visualZone;
  if (!vz) return violations;

  const [rStart, rEnd] = vz.rows;
  const [cStart, cEnd] = vz.cols;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const cell = grid[r][c];
      if (!cell.itemId) continue;
      const item = getItemById(cell.itemId);
      if (!item) continue;
      if (item.isHot) {
        const inZone = r >= rStart && r <= rEnd && c >= cStart && c <= cEnd;
        if (!inZone) {
          violations.push({
            row: r,
            col: c,
            ruleId: 'r3',
            msg: `爆款「${item.name}」需放在视觉中心区（行 ${rStart + 1}~${rEnd + 1}，列 ${cStart + 1}~${cEnd + 1}）`,
          });
        }
      }
    }
  }
  return violations;
}

export function checkAllPlaced(
  level: LevelConfig,
  inventory: Record<string, number>,
): boolean {
  return level.items.every((entry) => (inventory[entry.itemId] || 0) === 0);
}

export function validateLayout(
  level: LevelConfig,
  grid: GridCellData[][],
  inventory: Record<string, number>,
): { violations: Violation[]; rulePassed: Record<string, boolean>; allPassed: boolean } {
  const g = cloneGrid(grid);
  const violations: Violation[] = [];
  const rulePassed: Record<string, boolean> = {};

  level.rules.forEach((rule) => {
    let ruleViolations: Violation[] = [];
    switch (rule.type) {
      case 'large_on_bottom':
        ruleViolations = checkLargeOnBottom(level, g);
        break;
      case 'small_on_top':
        ruleViolations = checkSmallOnTop(level, g);
        break;
      case 'hot_on_visual_zone':
        ruleViolations = checkHotInVisualZone(level, g);
        break;
      case 'must_place_all': {
        const ok = checkAllPlaced(level, inventory);
        rulePassed[rule.id] = ok;
        return;
      }
      default:
        break;
    }
    rulePassed[rule.id] = ruleViolations.length === 0;
    violations.push(...ruleViolations);
  });

  const allPassed = Object.values(rulePassed).every(Boolean);
  return { violations, rulePassed, allPassed };
}
