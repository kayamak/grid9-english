import { CircleService } from '../../application/services/CircleService';
import { UserService } from '../../application/services/UserService';
import { createCircle } from '../actions/circles';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CirclesPage() {
  const circleService = new CircleService();
  const userService = new UserService();
  
  const circles = await circleService.getAll();
  const users = await userService.getAll();

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Circles</h1>
      <Link href="/" className="text-gray-500 hover:underline mb-4 block">Back to Home</Link>

      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Create Circle</h2>
        <form action={createCircle} className="flex flex-col gap-2 max-w-md">
          <input 
            name="name" 
            placeholder="Circle Name" 
            className="border p-2 rounded"
            required 
          />
          <select name="ownerId" className="border p-2 rounded" required defaultValue="">
            <option value="" disabled>Select Owner</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Create Circle
          </button>
        </form>
      </div>

      <ul className="space-y-2">
        {circles.map(c => (
          <li key={c.id} className="border p-4 rounded hover:bg-gray-50 flex justify-between items-center">
            <Link href={`/circles/${c.id}`} className="text-blue-600 hover:underline font-semibold block flex-1">
              {c.name}
            </Link>
            <span className="text-sm text-gray-500">Owner ID: {c.ownerId}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
