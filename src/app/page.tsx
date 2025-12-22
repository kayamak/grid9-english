import Link from 'next/link';
import { getSentenceDrills } from '@/features/practice/actions/drills';

export default async function Home() {
  const drills = await getSentenceDrills();

  return (
    <main className="min-h-screen bg-[#f8f9fa] p-8 md:p-16 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
            GRID<span className="text-blue-600">9</span> ENGLISH
          </h1>
          <p className="text-xl text-slate-500 font-medium">Mastering English sentence structures through visual patterns.</p>
        </header>

        <div className="space-y-16">
          {/* Main Feature: Pattern Practice */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Pattern Practice</h2>
              <Link 
                href="/practice" 
                className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 group"
              >
                Open Generator <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                Utilize our innovative 3x3 grid system to visualize and build English sentence patterns. 
                Perfect for understanding subject-verb-object relationships and tenses.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">SV</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">SVO</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">SVC</span>
              </div>
            </div>
          </section>

          {/* New Feature: Sentence Drill - DIRECTLY BELOW PATTERN PRACTICE */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Sentence Drill</h2>
              <Link 
                href="/practice" 
                className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors flex items-center gap-1 group"
              >
                Go to Practice <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
            
            <div className="mb-8">
              <p className="text-slate-600 leading-relaxed text-lg bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl">
                <strong>New:</strong> Sentence Drills are now integrated! Switch to "Sentence Drill Mode" on the practice page to build these sentences using the grid system.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drills.map((drill) => (
                <Link 
                  href={`/practice?mode=drill&drill=${drill.sortOrder}`}
                  key={drill.id} 
                  className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center hover:border-indigo-200 hover:shadow-md transition-all group"
                >
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{drill.english}</p>
                    <p className="text-sm text-slate-400 font-medium">{drill.japanese}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-colors">
                    {drill.sortOrder}
                  </div>
                </Link>
              ))}
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
