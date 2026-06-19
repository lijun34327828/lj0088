import { Undo2, Trash2, CheckCircle, RotateCcw, Layers } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getLevelById } from '@/data/levels';

export default function TopBar() {
  const {
    currentLevelId,
    history,
    undo,
    clearAll,
    checkRules,
    resetCurrentLevel,
    setLevelSelectorVisible,
  } = useGameStore();
  const level = getLevelById(currentLevelId);

  const stars = '★'.repeat(level?.difficulty || 1) + '☆'.repeat(3 - (level?.difficulty || 1));

  return (
    <div className="w-full px-6 py-4 bg-gradient-to-r from-[#8B6914] via-[#A0781C] to-[#8B6914] text-white shadow-lg border-b-4 border-[#5D4510]">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLevelSelectorVisible(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 rounded-xl transition-all border border-white/25 backdrop-blur-sm"
          >
            <Layers size={18} />
            <span className="font-bold tracking-wide">选关</span>
          </button>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[#FFE9B0]">
              关卡 {level?.id} · {level?.gridSpec}
            </div>
            <div className="text-xl font-bold font-serif">
              {level?.name ?? '未命名关卡'}
            </div>
          </div>
          <div className="ml-3 px-3 py-1 rounded-full bg-[#C23B22]/80 text-sm font-bold shadow-inner">
            {stars}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all border border-white/20 backdrop-blur-sm"
          >
            <Undo2 size={18} />
            <span>撤销</span>
            {history.length > 0 && (
              <span className="text-xs bg-white/25 px-1.5 py-0.5 rounded-md">
                {history.length}
              </span>
            )}
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-[#C23B22]/60 rounded-xl transition-all border border-white/20 backdrop-blur-sm"
          >
            <Trash2 size={18} />
            <span>清空</span>
          </button>
          <button
            onClick={resetCurrentLevel}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 rounded-xl transition-all border border-white/20 backdrop-blur-sm"
          >
            <RotateCcw size={18} />
            <span>重置</span>
          </button>
          <button
            onClick={checkRules}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#FFD56B] hover:bg-[#FFE59B] text-[#5D4510] font-bold rounded-xl shadow-[0_4px_0_#B8912F] hover:shadow-[0_2px_0_#B8912F] hover:translate-y-0.5 transition-all border-2 border-[#E4B84A]"
          >
            <CheckCircle size={20} />
            <span>判定合规</span>
          </button>
        </div>
      </div>
    </div>
  );
}
