import { UserService } from '@/features/auth/actions/UserService';
import { registerUser } from '@/features/auth/actions/users';
import Link from 'next/link';


// Force dynamic because we fetch directly from DB/Service
export const dynamic = 'force-static';

export default async function UsersPage() {
  const service = new UserService();
  const users = await service.getAll();

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <Link href="/" className="text-gray-500 hover:underline mb-4 block">Back to Home</Link>
      
      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Register User</h2>
        <form action={registerUser} className="flex gap-2">
          <input 
            name="name" 
            placeholder="New User Name" 
            className="border p-2 rounded flex-1"
            required 
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Register
          </button>
        </form>
      </div>

      <ul className="space-y-2">
        {users.map(u => (
          <li key={u.id} className="border p-4 rounded hover:bg-gray-50 flex justify-between items-center">
            <Link href={`/users/${u.id}`} className="text-blue-600 hover:underline font-semibold block flex-1">
              {u.name} <span className="text-sm text-gray-500 font-normal">({u.type})</span>
            </Link>
            <span className="text-xs text-gray-400 font-mono">{u.id}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
