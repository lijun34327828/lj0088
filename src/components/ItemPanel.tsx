import type { CSSProperties, DragEvent } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getLevelById } from '@/data/levels';
import { getItemById } from '@/data/craftItems';
import type { CraftItem, ItemCategory } from '@/types';

const CATEGORY_LABELS: Record<ItemCategory, string> = {
  pottery: '陶艺摆件',
  fragrance: '香薰挂件',
  hot: '爆款主推',
  normal: '精品手作',
};

const CATEGORY_ICONS: Record<ItemCategory, string> = {
  pottery: '🏺',
  fragrance: '🌸',
  hot: '✨',
  normal: '🎨',
};

const CATEGORY_BG: Record<ItemCategory, string> = {
  pottery: 'from-[#D4A373]/90 to-[#A98467]/90 border-[#8B5E3C]',
  fragrance: 'from-[#B5E48C]/90 to-[#74C69D]/90 border-[#52B788]',
  hot: 'from-[#FFAFCC]/95 to-[#FF8FAB]/95 border-[#C23B22]',
  normal: 'from-[#CDB4DB]/90 to-[#A994D0]/90 border-[#7B6CAD]',
};

const SIZE_LABEL: Record<string, string> = {
  large: '大件',
  medium: '中件',
  small: '小件',
};

interface ItemCardProps {
  itemId: string;
  count: number;
}

export function ItemCard({ itemId, count }: ItemCardProps) {
  const item: CraftItem | undefined = getItemById(itemId);
  if (!item) return null;

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    if (count <= 0) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ source: 'panel', itemId }));
  };

  const disabled = count <= 0;

  const cardStyle: CSSProperties = {
    backgroundImage:
      'repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0 2px, transparent 2px 10px)',
  };

  return (
    <div
      draggable={!disabled}
      onDragStart={handleDragStart}
      className={`group relative flex items-center gap-3 p-3 rounded-2xl border-2 shadow-md transition-all select-none
        bg-gradient-to-br ${CATEGORY_BG[item.category]}
        ${disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:shadow-xl'}
      `}
      style={cardStyle}
    >
      <div className="relative w-14 h-14 flex items-center justify-center rounded-xl bg-white/60 border border-white/70 shadow-inner">
        <span className="text-3xl drop-shadow-sm" draggable={false}>{item.emoji}</span>
        {item.isHot && (
          <span className="absolute -top-1.5 -right-1.5 text-xs bg-[#C23B22] text-white rounded-full px-1.5 py-0.5 shadow-md font-bold animate-pulse">
            HOT
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-[#3A2A0C] truncate">{item.name}</div>
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#5D4510]">
          <span className="px-1.5 py-0.5 rounded bg-white/50 font-semibold">
            {SIZE_LABEL[item.size]}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-white/30">
            {CATEGORY_ICONS[item.category]} {CATEGORY_LABELS[item.category]}
          </span>
        </div>
      </div>
      <div
        className={`text-2xl font-black px-3 py-1 rounded-xl shadow-inner
          ${count > 0 ? 'bg-white/70 text-[#C23B22]' : 'bg-white/30 text-gray-500'}
        `}
      >
        ×{count}
      </div>
    </div>
  );
}

export default function ItemPanel() {
  const { currentLevelId, inventory } = useGameStore();
  const level = getLevelById(currentLevelId);
  if (!level) return null;

  const grouped: Record<ItemCategory, Array<{ itemId: string; count: number }>> = {
    pottery: [],
    fragrance: [],
    hot: [],
    normal: [],
  };
  level.items.forEach((entry) => {
    const item = getItemById(entry.itemId);
    if (!item) return;
    grouped[item.category].push({ itemId: entry.itemId, count: inventory[entry.itemId] || 0 });
  });

  const total = level.items.reduce((s, e) => s + e.count, 0);
  const remaining = Object.values(inventory).reduce((s, n) => s + n, 0);
  const placed = total - remaining;
  const percent = total > 0 ? Math.round((placed / total) * 100) : 0;

  return (
    <aside className="w-[320px] shrink-0 flex flex-col rounded-2xl overflow-hidden shadow-2xl border-4 border-[#6B4F14] bg-[#FFF8E7]">
      <div className="px-4 py-3 bg-gradient-to-r from-[#8B6914] to-[#A0781C] text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-widest opacity-80">Inventory</div>
            <div className="text-lg font-bold font-serif">商品组件面板</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-80">上架进度</div>
            <div className="text-xl font-black">
              {placed}/{total}
              <span className="text-sm opacity-80 ml-1">{percent}%</span>
            </div>
          </div>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FFD56B] to-[#FFAFCC] transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 bg-[#FFF8E7]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 10%, rgba(139,105,20,0.06) 0, transparent 40%), radial-gradient(circle at 80% 90%, rgba(194,59,34,0.06) 0, transparent 40%)',
        }}
      >
        {(Object.keys(grouped) as ItemCategory[]).map((cat) => {
          const entries = grouped[cat];
          if (entries.length === 0) return null;
          return (
            <div key={cat}>
              <div className="flex items-center gap-1.5 mb-2 px-1 text-xs font-bold text-[#6B4F14] uppercase tracking-widest">
                <span className="text-base">{CATEGORY_ICONS[cat]}</span>
                <span>{CATEGORY_LABELS[cat]}</span>
                <span className="flex-1 h-px bg-[#6B4F14]/20" />
              </div>
              <div className="space-y-2">
                {entries.map((e) => (
                  <ItemCard key={e.itemId} itemId={e.itemId} count={e.count} />
                ))}
              </div>
            </div>
          );
        })}

        <div className="mt-4 p-3 rounded-xl bg-[#8B6914]/10 border border-[#8B6914]/20">
          <div className="text-xs font-bold text-[#6B4F14] mb-1">💡 操作提示</div>
          <ul className="text-[11px] text-[#5D4510] leading-relaxed space-y-1">
            <li>• 从面板拖拽商品到右侧货架网格</li>
            <li>• 再次拖拽货架内商品可移动位置</li>
            <li>• 双击货架商品可撤回至库存</li>
            <li>• 摆放完成后点击「判定合规」</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
