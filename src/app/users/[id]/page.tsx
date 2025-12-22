import { UserService } from '@/features/auth/actions/UserService';
import { updateUser, deleteUser } from '@/features/auth/actions/users';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;
  const service = new UserService();
  let user;
  try {
    user = await service.get(id);
  } catch (e) {
    notFound();
  }

  const deleteAction = deleteUser.bind(null, id);
  const updateAction = updateUser.bind(null, id);

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <Link href="/users" className="text-gray-500 hover:underline mb-4 block">Back to Users</Link>

      <div className="mb-6 border p-4 rounded">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Current Name:</strong> {user.name}</p>
        <p><strong>Type:</strong> {user.type}</p>
      </div>

      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Update Name</h2>
        <form action={updateAction} className="flex gap-2">
          <input 
            name="name" 
            defaultValue={user.name} 
            className="border p-2 rounded flex-1"
            required 
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Update
          </button>
        </form>
      </div>

      <div className="border-t pt-4">
        <form action={deleteAction}>
          <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Delete User
          </button>
        </form>
      </div>
    </div>
  );
}
