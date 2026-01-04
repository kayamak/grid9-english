import { MainMenu } from '@/features/home/components/MainMenu';

export default async function Home() {
  return (
    <main className="min-h-screen bg-[#000840] flex flex-col items-center justify-center p-4 md:p-8 font-dot">
      <div className="w-full max-w-4xl space-y-8">
        {/* Title Window */}
        <header className="dq-window-fancy text-center py-8">
          <h1 className="text-4xl md:text-6xl font-normal tracking-widest text-white mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            GRID９ ENGLISH
          </h1>
          <p className="text-lg md:text-xl text-yellow-200 typing-text">
            視覚的なパターンで英語をマスターせよ！
          </p>
        </header>

        {/* Main Menu Component (Now Includes Message Window) */}
        <MainMenu />
      </div>
    </main>
  );
}
