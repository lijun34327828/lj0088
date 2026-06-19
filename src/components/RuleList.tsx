import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getLevelById } from '@/data/levels';

export default function RuleList() {
  const { currentLevelId, rulePassed, violations, isPassed } = useGameStore();
  const level = getLevelById(currentLevelId);
  if (!level) return null;

  const total = level.rules.length;
  const passed = Object.values(rulePassed).filter(Boolean).length;
  const percent = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <aside className="w-[300px] shrink-0 flex flex-col rounded-2xl overflow-hidden shadow-2xl border-4 border-[#6B4F14] bg-[#FFF8E7]">
      <div className="px-4 py-3 bg-gradient-to-r from-[#556B2F] to-[#4F7942] text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-widest opacity-80">Standard</div>
            <div className="text-lg font-bold font-serif">陈列规范清单</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-80">合规进度</div>
            <div className="text-xl font-black">
              {passed}/{total}
            </div>
          </div>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-white/20 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isPassed
                ? 'bg-gradient-to-r from-[#FFD56B] via-[#74C69D] to-[#52B788]'
                : 'bg-gradient-to-r from-[#FFE59B] to-[#C9A968]'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 bg-[#FFF8E7]">
        {level.rules.map((rule, idx) => {
          const done = rulePassed[rule.id] === true;
          const relevantCount = violations.filter((v) => v.ruleId === rule.id).length;
          return (
            <div
              key={rule.id}
              className={`p-3 rounded-xl border-2 shadow-sm transition-all
                ${done ? 'bg-gradient-to-br from-[#D8F3DC] to-[#B7E4C7] border-[#40916C]' : 'bg-white/70 border-[#8B6914]/30'}
              `}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5 shrink-0">
                  {done ? (
                    <CheckCircle2 size={18} className="text-[#1B4332]" />
                  ) : (
                    <XCircle size={18} className="text-[#8B6914]/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[11px] font-black px-1.5 py-0.5 rounded bg-[#8B6914]/15 text-[#5D4510]">
                      规范{idx + 1}
                    </span>
                    {!done && relevantCount > 0 && (
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#C23B22] text-white flex items-center gap-0.5">
                        <AlertTriangle size={10} /> {relevantCount}处违规
                      </span>
                    )}
                    {done && (
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#40916C] text-white">
                        通过 ✓
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-sm leading-relaxed font-semibold
                      ${done ? 'text-[#1B4332]' : 'text-[#3A2A0C]'}
                    `}
                  >
                    {rule.description}
                  </div>
                  {!done && relevantCount > 0 && (
                    <div className="mt-2 p-2 rounded-lg bg-[#C23B22]/10 border border-[#C23B22]/30 text-[11px] text-[#C23B22] space-y-0.5 font-semibold">
                      {Array.from(new Set(violations.filter((v) => v.ruleId === rule.id).map((v) => v.msg))).map(
                        (msg, i) => (
                          <div key={i}>⚠ {msg}</div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div className="mt-3 p-3 rounded-xl border-2 border-dashed border-[#C23B22]/40 bg-[#FFF0F0]">
          <div className="text-xs font-black text-[#C23B22] mb-1 flex items-center gap-1">
            🎯 快速测试提示
          </div>
          <ul className="text-[11px] text-[#8B3A1A] leading-relaxed space-y-1 font-semibold">
            <li>• 把陶艺放上层 → 立即触发规范1违规</li>
            <li>• 把香薰放下层 → 立即触发规范2违规</li>
            <li>• 爆款放边角 → 立即触发规范3违规</li>
            <li>• 点击「判定合规」查看具体提示</li>
          </ul>
        </div>
      </div>

      {isPassed && (
        <div className="px-4 py-3 bg-gradient-to-r from-[#52B788] via-[#40916C] to-[#2D6A4F] text-white border-t-2 border-[#1B4332] animate-bounce-in">
          <div className="flex items-center justify-center gap-2 font-black text-lg">
            <span className="text-2xl">🎉</span>
            <span>恭喜！全部陈列规范通过！</span>
            <span className="text-2xl">🎊</span>
          </div>
        </div>
      )}
    </aside>
  );
}
