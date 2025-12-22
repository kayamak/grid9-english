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
          <p className="text-xl text-slate-500 font-medium">Mastering English sentence structures through visual patterns.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Entry: Free Practice */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Free Practice</h2>
              <Link 
                href="/practice?mode=free" 
                className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 group"
              >
                Launch <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 h-full">
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                Explore English sentence structures freely using our 3x3 grid system. No set challenges, just pure experimentation.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">SANDBOX</span>
              </div>
            </div>
          </section>

          {/* Entry: Sentence Drill Mode */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Sentence Drill</h2>
              <Link 
                href="/practice?mode=drill" 
                className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors flex items-center gap-1 group"
              >
                All Drills <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 h-full flex flex-col">
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                Master core patterns with guided challenges. Build specific sentences to complete the drill set.
              </p>
              
              <div className="mt-auto space-y-4">
                <p className="text-xs font-black text-indigo-300 uppercase tracking-widest">Select a Pattern to Focus</p>
                <div className="flex flex-wrap gap-2">
                  {patterns.map((pattern) => (
                    <Link
                      key={pattern}
                      href={`/practice?mode=drill&pattern=${pattern}`}
                      className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm font-bold rounded-xl transition-all hover:scale-105"
                    >
                      {pattern}
                    </Link>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">CHALLENGE</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* System Links */}
        <footer className="mt-24 pt-12 border-t border-slate-200">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">System Management</h3>
          <nav className="flex gap-8">
            <Link href="/users" className="text-slate-500 hover:text-slate-900 font-bold transition-colors">User Profiles</Link>
            <Link href="/circles" className="text-slate-500 hover:text-slate-900 font-bold transition-colors">Circle Groups</Link>
            <Link href="/api/test-db" className="text-slate-400 hover:text-red-500 font-medium text-sm transition-colors">DB Health Check</Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}
