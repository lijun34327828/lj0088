import type { DragEvent, MouseEvent } from 'react';
import { useMemo, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getLevelById } from '@/data/levels';
import { getItemById } from '@/data/craftItems';
import type { CraftItem } from '@/types';

interface DragSource {
  source: 'panel' | 'grid';
  itemId: string;
  fromRow?: number;
  fromCol?: number;
}

interface GridCellProps {
  row: number;
  col: number;
  itemId: string | null;
  isViolation: boolean;
  violationMsgs: string[];
  isVisualZone: boolean;
  isDragOver: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onDoubleClick: () => void;
}

function GridCell(props: GridCellProps) {
  const {
    row,
    col,
    itemId,
    isViolation,
    violationMsgs,
    isVisualZone,
    isDragOver,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDoubleClick,
  } = props;

  const item: CraftItem | undefined = itemId ? getItemById(itemId) : undefined;
  const rowLabel = `第${row + 1}行`;
  const colLabel = `第${col + 1}列`;

  return (
    <div
      className={`relative group rounded-lg transition-all duration-150
        ${isVisualZone ? 'bg-gradient-to-br from-[#FFF4CC]/60 to-[#FFE59B]/60 ring-2 ring-[#E4B84A]/60 ring-inset' : 'bg-[#FFF8E7]/50'}
        ${isDragOver ? 'ring-4 ring-[#4F7942] scale-105 z-10 bg-[#D8F3DC]/70' : ''}
        ${isViolation ? 'animate-pulse-violation' : ''}
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      title={`${rowLabel} · ${colLabel}${item ? '｜' + item.name : ''}`}
    >
      <div
        className={`w-full h-full rounded-lg flex items-center justify-center
          border-2 border-dashed
          ${isVisualZone ? 'border-[#C23B22]/30' : 'border-[#8B6914]/25'}
          ${isViolation ? '!border-solid !border-[#C23B22] shadow-[0_0_0_3px_rgba(194,59,34,0.25)]' : ''}
        `}
      >
        {item ? (
          <div
            draggable
            onDragStart={onDragStart}
            onDoubleClick={onDoubleClick}
            className={`relative w-[92%] h-[92%] rounded-xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-transform
              hover:-translate-y-0.5 hover:shadow-lg
              ${item.size === 'large' ? 'bg-gradient-to-br from-[#D4A373] to-[#A98467] text-white' : ''}
              ${item.size === 'small' ? 'bg-gradient-to-br from-[#B5E48C] to-[#74C69D] text-[#1B4332]' : ''}
              ${item.size === 'medium' && item.isHot ? 'bg-gradient-to-br from-[#FFAFCC] to-[#FF8FAB] text-white' : ''}
              ${item.size === 'medium' && !item.isHot ? 'bg-gradient-to-br from-[#CDB4DB] to-[#A994D0] text-white' : ''}
              border border-white/40 shadow-md
            `}
            title={`${item.name}（双击移回库存）`}
          >
            <span className="text-2xl sm:text-3xl drop-shadow-sm leading-none">{item.emoji}</span>
            <span className="text-[10px] mt-0.5 font-bold truncate max-w-full px-1 opacity-95">
              {item.name}
            </span>
            {item.isHot && (
              <span className="absolute -top-1 -right-1 text-[10px] bg-[#C23B22] text-white rounded-full px-1.5 py-0.5 shadow font-bold">
                ✨
              </span>
            )}
            {isViolation && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 hidden group-hover:block w-44 text-[10px] bg-[#C23B22] text-white p-2 rounded-lg shadow-xl pointer-events-none font-semibold leading-tight">
                ❌ {violationMsgs.join('；')}
              </div>
            )}
          </div>
        ) : (
          <div className="text-[10px] text-[#8B6914]/40 font-medium select-none">
            {rowLabel}/{colLabel}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShelfGrid() {
  const {
    currentLevelId,
    grid,
    placeItem,
    removeItem,
    moveItem,
    getViolationsAt,
  } = useGameStore();
  const level = getLevelById(currentLevelId);

  const [dragOver, setDragOver] = useState<Record<string, boolean>>({});

  const visualZone = useMemo(() => {
    if (!level?.visualZone) return null;
    return level.visualZone;
  }, [level]);

  if (!level) return null;

  const inVisualZone = (r: number, c: number) => {
    if (!visualZone) return false;
    const [r0, r1] = visualZone.rows;
    const [c0, c1] = visualZone.cols;
    return r >= r0 && r <= r1 && c >= c0 && c <= c1;
  };

  const handleCellDragStart = (row: number, col: number) => (e: DragEvent<HTMLDivElement>) => {
    const cell = grid[row]?.[col];
    if (!cell || !cell.itemId) {
      e.preventDefault();
      return;
    }
    const payload: DragSource = {
      source: 'grid',
      itemId: cell.itemId,
      fromRow: row,
      fromCol: col,
    };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(payload));
  };

  const handleCellDragOver = (row: number, col: number) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver((prev) => ({ ...prev, [`${row}-${col}`]: true }));
  };

  const handleCellDragLeave = (row: number, col: number) => () => {
    setDragOver((prev) => {
      const next = { ...prev };
      delete next[`${row}-${col}`];
      return next;
    });
  };

  const handleCellDrop = (row: number, col: number) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const key = `${row}-${col}`;
    setDragOver((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    try {
      const raw = e.dataTransfer.getData('text/plain');
      if (!raw) return;
      const payload: DragSource = JSON.parse(raw);
      if (payload.source === 'panel') {
        placeItem(row, col, payload.itemId);
      } else if (payload.source === 'grid' && payload.fromRow !== undefined && payload.fromCol !== undefined) {
        moveItem(payload.fromRow, payload.fromCol, row, col);
      }
    } catch {
      /* ignore */
    }
  };

  const handleCellDoubleClick = (row: number, col: number) => (_e: MouseEvent) => {
    removeItem(row, col);
  };

  const CELL_SIZE = level.gridSpec === '9x8' ? 'w-[78px] h-[78px]' : 'w-[86px] h-[86px]';
  const shelfLayers: { label: string; rowRange: [number, number]; type: 'top' | 'middle' | 'bottom' }[] = [];
  const totalRows = level.rows;
  if (totalRows >= 6) {
    shelfLayers.push({ label: '✨ 上层展示区 · 香薰挂件专区', rowRange: [0, 1], type: 'top' });
    shelfLayers.push({ label: '🎯 视觉中心区 · 爆款主推位', rowRange: [2, totalRows - 3], type: 'middle' });
    shelfLayers.push({ label: '🏺 底层承重区 · 陶艺大件专区', rowRange: [totalRows - 2, totalRows - 1], type: 'bottom' });
  } else {
    shelfLayers.push({ label: '✨ 上层 · 香薰挂件', rowRange: [0, 0], type: 'top' });
    if (totalRows >= 3) {
      shelfLayers.push({ label: '🎯 中心视觉区 · 爆款主推', rowRange: [1, totalRows - 2], type: 'middle' });
    }
    shelfLayers.push({ label: '🏺 底层 · 陶艺大件', rowRange: [totalRows - 1, totalRows - 1], type: 'bottom' });
  }

  return (
    <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#6B4F14] flex flex-col">
      <div
        className="px-4 py-2 bg-gradient-to-r from-[#5D4510] via-[#6B4F14] to-[#5D4510] text-[#FFE9B0] text-sm font-bold tracking-wide border-b-2 border-[#3A2A0C] flex items-center justify-between"
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0 2px, transparent 2px 14px)' }}
      >
        <span>🛍️ 文创手作门店 · 沉浸式货架模拟</span>
        <span>规格 {level.rows} × {level.cols} 网格</span>
      </div>
      <div
        className="flex-1 overflow-auto p-5"
        style={{
          backgroundImage:
            'linear-gradient(180deg, #E8D5A8 0%, #D4B47A 30%, #B8894A 70%, #8B5E34 100%), url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><path d=%22M0 20 Q 10 15 20 20 T 40 20%22 stroke=%22%236B4F14%22 stroke-width=%220.6%22 fill=%22none%22 opacity=%220.35%22/></svg>")',
          backgroundBlendMode: 'multiply',
        }}
      >
        <div className="mx-auto space-y-4" style={{ width: 'fit-content' }}>
          {shelfLayers.map((layer) => {
            const [rStart, rEnd] = layer.rowRange;
            const rowsInLayer = [];
            for (let r = rStart; r <= rEnd && r < level.rows; r++) rowsInLayer.push(r);
            const isTop = layer.type === 'top';
            const isBottom = layer.type === 'bottom';
            return (
              <div
                key={layer.label}
                className={`rounded-xl p-3 shadow-inner border-2
                  ${isTop ? 'bg-gradient-to-b from-[#F4E4BC]/90 to-[#E8D5A8]/90 border-[#C9A968]' : ''}
                  ${layer.type === 'middle' ? 'bg-gradient-to-b from-[#F7EBCF]/90 to-[#F0DEA8]/90 border-[#C9A968]' : ''}
                  ${isBottom ? 'bg-gradient-to-b from-[#E8D5A8]/90 to-[#C9A36A]/90 border-[#8B5E34]' : ''}
                `}
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, rgba(107,79,20,0.08) 0 1px, transparent 1px 12px), repeating-linear-gradient(0deg, rgba(107,79,20,0.08) 0 1px, transparent 1px 12px)',
                }}
              >
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-md shadow-sm
                      ${isTop ? 'bg-[#52B788] text-white' : ''}
                      ${layer.type === 'middle' ? 'bg-[#C23B22] text-white' : ''}
                      ${isBottom ? 'bg-[#8B5E34] text-[#FFE9B0]' : ''}
                    `}
                  >
                    层 {rStart + 1}{rEnd !== rStart ? `~${rEnd + 1}` : ''}
                  </span>
                  <span className="text-xs font-bold text-[#5D4510]">{layer.label}</span>
                </div>
                <div
                  className="grid gap-1.5"
                  style={{ gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))` }}
                >
                  {rowsInLayer.map((r) =>
                    grid[r].map((cell) => {
                      const col = cell.col;
                      const vs = getViolationsAt(r, col);
                      const key = `${r}-${col}`;
                      return (
                        <div key={key} className={CELL_SIZE}>
                          <GridCell
                            row={r}
                            col={col}
                            itemId={cell.itemId}
                            isViolation={vs.length > 0}
                            violationMsgs={vs.map((x) => x.msg)}
                            isVisualZone={inVisualZone(r, col)}
                            isDragOver={!!dragOver[key]}
                            onDragStart={handleCellDragStart(r, col)}
                            onDragOver={handleCellDragOver(r, col)}
                            onDragLeave={handleCellDragLeave(r, col)}
                            onDrop={handleCellDrop(r, col)}
                            onDoubleClick={() => removeItem(r, col)}
                          />
                        </div>
                      );
                    }),
                  )}
                </div>
                {isBottom && (
                  <div className="h-3 mt-3 rounded-md bg-gradient-to-b from-[#6B4F14] to-[#3A2A0C] shadow-inner" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
