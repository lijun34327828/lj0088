import { X, Check, Star, Grid3x3, Trophy } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { levels } from '@/data/levels';

function formatTime(seconds: number | undefined): string {
  if (seconds === undefined) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function LevelSelector() {
  const { showLevelSelector, setLevelSelectorVisible, currentLevelId, passedLevels, selectLevel, bestTimes } = useGameStore();

  if (!showLevelSelector) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setLevelSelectorVisible(false);
      }}
    >
      <div className="w-[680px] max-w-[92vw] max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl border-4 border-[#6B4F14] bg-[#FFF8E7] flex flex-col animate-pop-in">
        <div className="px-6 py-4 bg-gradient-to-r from-[#8B6914] via-[#A0781C] to-[#8B6914] text-white flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[#FFE9B0]">Level Selection</div>
            <div className="text-2xl font-bold font-serif flex items-center gap-2">
              <Grid3x3 size={22} /> 关卡选择
            </div>
          </div>
          <button
            onClick={() => setLevelSelectorVisible(false)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/35 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 gap-4"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 0%, rgba(139,105,20,0.08) 0, transparent 40%), radial-gradient(circle at 80% 100%, rgba(194,59,34,0.08) 0, transparent 40%)',
          }}
        >
          {levels.map((lv) => {
            const passed = passedLevels.includes(lv.id);
            const current = lv.id === currentLevelId;
            const stars = lv.difficulty;
            const best = bestTimes[lv.id];
            return (
              <button
                key={lv.id}
                onClick={() => selectLevel(lv.id)}
                className={`text-left p-4 rounded-2xl border-2 transition-all hover:-translate-y-0.5 hover:shadow-xl
                  ${current ? 'bg-gradient-to-br from-[#FFE59B] to-[#FFD56B] border-[#C23B22] ring-4 ring-[#C23B22]/25' : 'bg-white/70 border-[#8B6914]/30 hover:border-[#8B6914]'}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-[#6B4F14] px-2 py-0.5 rounded-lg bg-[#8B6914]/10">
                      Lv.{lv.id}
                    </span>
                    <div className="text-[#C23B22]">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < stars ? '#C23B22' : 'none'}
                          className="inline-block -mx-0.5"
                        />
                      ))}
                    </div>
                  </div>
                  {passed && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#40916C] text-white flex items-center gap-1">
                      <Check size={12} /> 已通关
                    </span>
                  )}
                </div>
                <div className="text-lg font-black text-[#3A2A0C] mb-2">{lv.name}</div>
                <div className="flex items-center gap-2 text-xs text-[#5D4510] font-semibold">
                  <span className="px-2 py-0.5 rounded bg-[#8B6914]/10">
                    网格 {lv.gridSpec}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#8B6914]/10">
                    {lv.rows}×{lv.cols}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#8B6914]/10">
                    {lv.items.reduce((s, e) => s + e.count, 0)}件商品
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-dashed border-[#8B6914]/20 text-[11px] text-[#5D4510] leading-relaxed">
                  {lv.rules.map((r, i) => (
                    <div key={r.id}>📌 {r.description}</div>
                  )).slice(0, 2)}
                  {lv.rules.length > 2 && <div>…共{lv.rules.length}条规范</div>}
                </div>
                <div className={`mt-2 pt-2 border-t border-dashed border-[#8B6914]/20 flex items-center justify-between text-[11px] font-semibold`}>
                  <div className={`flex items-center gap-1 ${best !== undefined ? 'text-[#C23B22]' : 'text-[#8B6914]/50'}`}>
                    <Trophy size={12} className={best !== undefined ? 'fill-current' : ''} />
                    <span>最佳用时</span>
                  </div>
                  <span className={`font-mono font-black text-sm ${best !== undefined ? 'text-[#C23B22]' : 'text-[#8B6914]/40'}`}>
                    {formatTime(best)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-6 py-3 bg-gradient-to-r from-[#5D4510] to-[#6B4F14] text-[#FFE9B0] text-xs font-semibold flex items-center justify-between">
          <span>已通关 {passedLevels.length} / {levels.length} 关</span>
          <span>点击任意关卡卡开始挑战 ✨</span>
        </div>
      </div>
    </div>
  );
}
