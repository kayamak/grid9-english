import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">grid9-english Migration Home</h1>
      <ul className="list-disc list-inside">
        <li><Link href="/users" className="text-blue-600 hover:underline">Users</Link></li>
        <li><Link href="/circles" className="text-blue-600 hover:underline">Circles</Link></li>
      </ul>
    </main>
  );
}
