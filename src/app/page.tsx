import Link from 'next/link';
import { getUniquePatterns } from '@/features/practice/actions/drills';

export default async function Home() {
  const patterns = await getUniquePatterns();

  return (
    <main className="min-h-screen bg-[#f8f9fa] p-8 md:p-16 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
            GRID<span className="text-blue-600">9</span> ENGLISH
          </h1>
          <p className="text-xl text-slate-500 font-medium">視覚的なパターンで英語の文章構造をマスターする。</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Entry: Free Practice */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">自由練習</h2>
              <Link 
                href="/practice?mode=free" 
                className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 group text-sm"
              >
                開始 <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 h-full">
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                3x3のグリッドシステムを使って、自由に英語の文章構造を探求しましょう。決まった課題はなく、自由な実験の場です。
              </p>
            </div>
          </section>

          {/* Entry: Sentence Drill Mode */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">文章ドリル</h2>
              <Link 
                href="/practice?mode=drill" 
                className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors flex items-center gap-1 group text-sm"
              >
                全ドリル <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 h-full flex flex-col">
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                ガイド付きの課題で核心的なパターンをマスターしましょう。特定の文章を組み立てて、ドリルセットを完了させます。
              </p>
              
              <div className="mt-auto space-y-4">
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">パターン</p>
                <div className="flex flex-wrap gap-1">
                  {patterns.map((pattern) => (
                    <Link
                      key={pattern}
                      href={`/practice?mode=drill&pattern=${pattern}`}
                      className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-lg transition-all"
                    >
                      {pattern}
                    </Link>
                  ))}
                </div>

              </div>
            </div>
          </section>

          {/* Entry: Drill Quest Mode */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">ドリルクエスト</h2>
              <Link 
                href="/practice?mode=quest" 
                className="text-amber-600 font-bold hover:text-amber-700 transition-colors flex items-center gap-1 group text-sm"
              >
                クエスト開始 <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 h-full flex flex-col">
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                RPGスタイルの旅に出かけましょう。プレッシャーの中で課題をクリアしてレベルアップ。どこまで到達できるでしょうか？
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
