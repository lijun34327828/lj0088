import TopBar from '@/components/TopBar';
import ItemPanel from '@/components/ItemPanel';
import ShelfGrid from '@/components/ShelfGrid';
import RuleList from '@/components/RuleList';
import LevelSelector from '@/components/LevelSelector';
import PassModal from '@/components/PassModal';

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 10% 0%, rgba(255,200,120,0.25) 0, transparent 50%), radial-gradient(ellipse at 90% 100%, rgba(194,59,34,0.12) 0, transparent 50%), linear-gradient(180deg, #FFF8E7 0%, #FFEBC9 100%)',
      }}
    >
      <TopBar />
      <main className="flex-1 w-full">
        <div className="max-w-[1440px] mx-auto p-5 flex flex-col lg:flex-row gap-4 items-stretch">
          <ItemPanel />
          <ShelfGrid />
          <RuleList />
        </div>
        <footer className="max-w-[1440px] mx-auto px-6 pb-6 pt-1 text-xs text-[#6B4F14]/70 font-semibold text-center">
          💡 测试玩法：故意把大件陶艺放到上层、把香薰挂件放下层、把爆款放到边角 → 点击「判定合规」可看到详细违规标注
        </footer>
      </main>
      <LevelSelector />
      <PassModal />
    </div>
  );
}
