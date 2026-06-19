import { PartyPopper, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { levels, getLevelById } from '@/data/levels';

export default function PassModal() {
  const { isPassed, currentLevelId, nextLevel, resetCurrentLevel, violations } = useGameStore();
  const level = getLevelById(currentLevelId);

  if (!isPassed || !level) return null;

  const idx = levels.findIndex((l) => l.id === currentLevelId);
  const hasNext = idx >= 0 && idx < levels.length - 1;

  const stars = 3;
  const totalItems = level.items.reduce((s, e) => s + e.count, 0);
  const score = 100 * stars + totalItems * 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.8}s`,
            backgroundColor: ['#C23B22', '#FFD56B', '#4F7942', '#8B6914', '#FF8FAB'][i % 5],
          }}
        />
      ))}
      <div className="relative w-[520px] max-w-[92vw] rounded-3xl shadow-2xl border-4 border-[#C23B22] bg-gradient-to-br from-[#FFF8E7] via-[#FFE59B] to-[#FFD56B] flex flex-col overflow-hidden animate-pop-in">
        <div className="pt-6 pb-4 px-6 text-center">
          <div className="relative w-20 h-20 mx-auto mb-3">
            <div className="absolute inset-0 rounded-full bg-[#C23B22]/15 animate-ping" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#C23B22] to-[#8B2E1C] flex items-center justify-center shadow-xl">
              <Award size={42} className="text-[#FFD56B]" />
            </div>
          </div>
          <div className="text-sm font-black uppercase tracking-[0.35em] text-[#C23B22]">
            Display Perfect
          </div>
          <div className="text-4xl font-black font-serif mt-1 text-[#5D4510] flex items-center justify-center gap-2">
            <PartyPopper size={28} className="text-[#C23B22]" />
            <span>完美通关！</span>
            <PartyPopper size={28} className="text-[#C23B22]" />
          </div>
          <div className="mt-2 text-[#6B4F14] font-semibold">
            本关陈列布局完全符合规范，货架美学满分 ✨
          </div>
        </div>

        <div className="mx-6 mb-4 p-5 rounded-2xl bg-white/80 border-2 border-[#C23B22]/30 shadow-inner">
          <div className="flex items-center justify-around mb-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="relative animate-star-pop"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="absolute inset-0 rounded-full bg-[#FFD56B]/30 blur-lg" />
                <svg width="62" height="62" viewBox="0 0 24 24" className="relative drop-shadow-lg">
                  <defs>
                    <linearGradient id={`sg${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFE59B" />
                      <stop offset="100%" stopColor="#E4B84A" />
                    </linearGradient>
                  </defs>
                  <path
                    fill={`url(#sg${i})`}
                    stroke="#8B6914"
                    strokeWidth="0.6"
                    d="M12 2l2.9 6.9L22 9.8l-5.5 4.7L18 22l-6-3.7L6 22l1.5-7.5L2 9.8l7.1-.9z"
                  />
                </svg>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-2 rounded-xl bg-[#FFF8E7]">
              <div className="text-[#6B4F14] font-semibold">关卡</div>
              <div className="text-lg font-black text-[#C23B22]">{level.id}</div>
            </div>
            <div className="p-2 rounded-xl bg-[#FFF8E7]">
              <div className="text-[#6B4F14] font-semibold">陈列商品</div>
              <div className="text-lg font-black text-[#4F7942]">{totalItems}</div>
            </div>
            <div className="p-2 rounded-xl bg-[#FFF8E7]">
              <div className="text-[#6B4F14] font-semibold">综合得分</div>
              <div className="text-lg font-black text-[#8B6914]">{score}</div>
            </div>
          </div>
          {violations.length === 0 && (
            <div className="mt-3 text-center text-[11px] text-[#6B4F14] font-semibold">
              🏆 零违规成就达成！你就是陈列大师
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex items-center gap-3">
          <button
            onClick={resetCurrentLevel}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-white/70 hover:bg-white text-[#6B4F14] font-bold border-2 border-[#8B6914]/30 transition-all hover:-translate-y-0.5 shadow-md"
          >
            <RotateCcw size={18} />
            再来一次
          </button>
          {hasNext ? (
            <button
              onClick={nextLevel}
              className="flex-[1.4] flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-br from-[#C23B22] to-[#8B2E1C] text-white font-black shadow-[0_5px_0_#5D1A10] hover:shadow-[0_2px_0_#5D1A10] hover:translate-y-0.5 transition-all border-2 border-[#5D1A10]"
            >
              下一关
              <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={() => { /* noop */ }}
              className="flex-[1.4] flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-br from-[#4F7942] to-[#2D6A4F] text-white font-black shadow-[0_5px_0_#1B4332] hover:shadow-[0_2px_0_#1B4332] hover:translate-y-0.5 transition-all border-2 border-[#1B4332]"
            >
              🎊 全部通关！
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
