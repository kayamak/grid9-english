import Link from 'next/link';
import { getUniquePatterns } from '@/features/practice/actions/drills';

export default async function Home() {
  const patterns = await getUniquePatterns();

  return (
    <main className="min-h-screen bg-[#000840] flex flex-col items-center justify-center p-4 md:p-8 font-dot">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Title Window */}
        <header className="dq-window-fancy text-center py-8">
          <h1 className="text-4xl md:text-6xl font-normal tracking-widest text-white mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            GRID９ ENGLISH
          </h1>
          <p className="text-lg md:text-xl text-yellow-200 typing-text">視覚的なパターンで英語をマスターせよ！</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Menu Window */}
          <section className="dq-window">
            <h2 className="text-2xl mb-6 border-b-2 border-white/20 pb-2 text-yellow-400">コマンド</h2>
            <nav className="flex flex-col gap-4">
              <Link href="/practice?mode=free" className="dq-menu-item text-xl text-white">
                <span>じゆうトレーニング</span>
              </Link>
              <Link href="/practice?mode=drill" className="dq-menu-item text-xl text-white">
                <span>ぶんしょうドリル</span>
              </Link>
              <Link href="/practice?mode=quest" className="dq-menu-item text-xl text-white">
                <span>ドリルクエスト</span>
              </Link>
            </nav>
          </section>

          {/* Info/Patterns Window */}
          <section className="dq-window">
            <h2 className="text-2xl mb-6 border-b-2 border-white/20 pb-2 text-yellow-400">じゅもん（パターン）</h2>
            <div className="grid grid-cols-2 gap-2">
              {patterns.map((pattern) => (
                <Link
                  key={pattern}
                  href={`/practice?mode=drill&pattern=${pattern}`}
                  className="dq-menu-item text-lg text-white"
                >
                  {pattern}
                </Link>
              ))}
            </div>
            {patterns.length === 0 && (
              <p className="text-white/40">まだ　なにも　おぼえていない！</p>
            )}
          </section>
        </div>

        {/* Message Window (Lower) */}
        <div className="dq-window h-24 flex items-center px-8 border-yellow-400">
          <p className="text-xl animate-pulse text-white">▼ ぼうけんの　じゅんびは　いいかな？</p>
        </div>
      </div>
    </main>
  );
}
