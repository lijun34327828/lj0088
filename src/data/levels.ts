import type { LevelConfig, DisplayRule } from '@/types';

const RULE_LARGE_BOTTOM: DisplayRule = {
  id: 'r1',
  type: 'large_on_bottom',
  description: '大件陶艺摆件必须放在货架最下方两层',
};

const RULE_SMALL_TOP: DisplayRule = {
  id: 'r2',
  type: 'small_on_top',
  description: '小型香薰挂件必须放在货架最上方两层',
};

const RULE_HOT_VISUAL: DisplayRule = {
  id: 'r3',
  type: 'hot_on_visual_zone',
  description: '主推爆款手作需放在货架靠前视觉中心区域',
};

const RULE_ALL_PLACED: DisplayRule = {
  id: 'r4',
  type: 'must_place_all',
  description: '所有手作商品必须上架陈列，不可遗漏',
};

export const levels: LevelConfig[] = [
  {
    id: 1,
    name: '入门小货架 · 基础陈列',
    rows: 3,
    cols: 8,
    gridSpec: '3x8',
    difficulty: 1,
    items: [
      { itemId: 'pottery_vase', count: 2 },
      { itemId: 'pottery_bowl', count: 2 },
      { itemId: 'fragrance_sachet', count: 3 },
      { itemId: 'fragrance_ornament', count: 2 },
      { itemId: 'hot_bracelet', count: 2 },
      { itemId: 'normal_scroll', count: 2 },
      { itemId: 'normal_postcard', count: 1 },
    ],
    rules: [RULE_LARGE_BOTTOM, RULE_SMALL_TOP, RULE_HOT_VISUAL, RULE_ALL_PLACED],
    visualZone: { rows: [1, 1], cols: [2, 5] },
  },
  {
    id: 2,
    name: '标准货架 · 分区规范',
    rows: 9,
    cols: 8,
    gridSpec: '9x8',
    difficulty: 2,
    items: [
      { itemId: 'pottery_vase', count: 3 },
      { itemId: 'pottery_bowl', count: 3 },
      { itemId: 'pottery_teapot', count: 2 },
      { itemId: 'pottery_cup', count: 3 },
      { itemId: 'fragrance_sachet', count: 4 },
      { itemId: 'fragrance_ornament', count: 3 },
      { itemId: 'fragrance_candle', count: 3 },
      { itemId: 'hot_bracelet', count: 3 },
      { itemId: 'hot_keychain', count: 2 },
      { itemId: 'hot_badge', count: 2 },
      { itemId: 'normal_scroll', count: 2 },
      { itemId: 'normal_postcard', count: 2 },
      { itemId: 'normal_fan', count: 2 },
      { itemId: 'normal_puppet', count: 2 },
    ],
    rules: [RULE_LARGE_BOTTOM, RULE_SMALL_TOP, RULE_HOT_VISUAL, RULE_ALL_PLACED],
    visualZone: { rows: [3, 5], cols: [2, 5] },
  },
  {
    id: 3,
    name: '旗舰店展架 · 综合挑战',
    rows: 9,
    cols: 8,
    gridSpec: '9x8',
    difficulty: 3,
    items: [
      { itemId: 'pottery_vase', count: 4 },
      { itemId: 'pottery_bowl', count: 4 },
      { itemId: 'pottery_teapot', count: 3 },
      { itemId: 'pottery_cup', count: 4 },
      { itemId: 'fragrance_sachet', count: 5 },
      { itemId: 'fragrance_ornament', count: 4 },
      { itemId: 'fragrance_candle', count: 4 },
      { itemId: 'hot_bracelet', count: 4 },
      { itemId: 'hot_keychain', count: 3 },
      { itemId: 'hot_badge', count: 3 },
      { itemId: 'normal_scroll', count: 3 },
      { itemId: 'normal_postcard', count: 3 },
      { itemId: 'normal_fan', count: 3 },
      { itemId: 'normal_puppet', count: 3 },
    ],
    rules: [RULE_LARGE_BOTTOM, RULE_SMALL_TOP, RULE_HOT_VISUAL, RULE_ALL_PLACED],
    visualZone: { rows: [3, 5], cols: [2, 5] },
  },
  {
    id: 4,
    name: '节日主题架 · 精雕细琢',
    rows: 9,
    cols: 8,
    gridSpec: '9x8',
    difficulty: 3,
    items: [
      { itemId: 'pottery_vase', count: 3 },
      { itemId: 'pottery_teapot', count: 3 },
      { itemId: 'pottery_cup', count: 5 },
      { itemId: 'fragrance_candle', count: 5 },
      { itemId: 'fragrance_sachet', count: 4 },
      { itemId: 'hot_bracelet', count: 3 },
      { itemId: 'hot_badge', count: 3 },
      { itemId: 'hot_keychain', count: 3 },
      { itemId: 'normal_fan', count: 4 },
      { itemId: 'normal_puppet', count: 3 },
      { itemId: 'normal_scroll', count: 3 },
      { itemId: 'normal_postcard', count: 3 },
    ],
    rules: [RULE_LARGE_BOTTOM, RULE_SMALL_TOP, RULE_HOT_VISUAL, RULE_ALL_PLACED],
    visualZone: { rows: [3, 5], cols: [2, 5] },
  },
];

export const getLevelById = (id: number): LevelConfig | undefined =>
  levels.find((l) => l.id === id);
