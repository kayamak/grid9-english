import { CircleService } from '@/features/circles/actions/CircleService';
import { UserService } from '@/features/auth/actions/UserService';
import { updateCircle, deleteCircle, joinCircle } from '@/features/circles/actions/circles';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CircleDetailPage({ params }: Props) {
  const { id } = await params;
  const circleService = new CircleService();
  const userService = new UserService();
  
  let circle;
  try {
    circle = await circleService.get(id);
  } catch (e) {
    notFound();
  }

  const allUsers = await userService.getAll();
  // Filter users who are not owner and not members
  const memberIds = new Set(circle.members.map((m: string) => m)); // circle.members is string[] in service response? Wait, let's check Service return type.
  // CircleService.get returns { members: string[] }? 
  // Let's verify CircleService.get implementation. 
  // It returns { members: circle.members } which is string[] in Circle.ts.
  // Wait, PrismaCircleRepository.find includes members, mapping to IDs in Circle entity.
  // Correct.

  const candidates = allUsers.filter(u => u.id !== circle.ownerId && !circle.members.includes(u.id));
  
  // Need to resolve member names? Service only returns IDs?
  // CircleService.get returns members as IDs.
  // To show names, I should fetch users.
  // circle.members is string[].
  // I need to fetch member objects.
  const members = await userService.userRepository.findMany(circle.members); // Accessing repo directly on service public prop? 
  // UserService defines private userRepository. 
  // I should add `getMany` to UserService or just use getAll and filter here?
  // Using getAll and filter map is fine for small scale.
  const memberObjMap = new Map(allUsers.map(u => [u.id, u]));

  const joinAction = joinCircle.bind(null, id);
  const deleteAction = deleteCircle.bind(null, id);
  const updateAction = updateCircle.bind(null, id);

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Circle Details</h1>
      <Link href="/circles" className="text-gray-500 hover:underline mb-4 block">Back to Circles</Link>

      <div className="mb-6 border p-4 rounded">
        <p><strong>ID:</strong> {circle.id}</p>
        <p><strong>Name:</strong> {circle.name}</p>
        <p><strong>Owner:</strong> {circle.ownerName} ({circle.ownerId})</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-2">Members ({members.length})</h2>
          <ul className="list-disc list-inside mb-4">
            {circle.members.map((mid: string) => {
               const user = memberObjMap.get(mid);
               return <li key={mid}>{user ? user.name : mid}</li>
            })}
          </ul>

          <div className="p-4 border rounded bg-gray-50">
             <h3 className="font-semibold mb-2">Add Member</h3>
             {candidates.length === 0 ? (
               <p className="text-gray-500">No candidates available.</p>
             ) : (
               <form action={joinAction} className="flex gap-2">
                 <select name="userId" className="border p-2 rounded flex-1">
                   {candidates.map(u => (
                     <option key={u.id} value={u.id}>{u.name}</option>
                   ))}
                 </select>
                 <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                   Join
                 </button>
               </form>
             )}
          </div>
        </div>

        <div>
          <div className="mb-6 p-4 border rounded bg-gray-50">
            <h3 className="font-semibold mb-2">Update Name</h3>
            <form action={updateAction} className="flex gap-2">
              <input 
                name="name" 
                defaultValue={circle.name} 
                className="border p-2 rounded flex-1"
                required 
              />
              <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                Update
              </button>
            </form>
          </div>

          <div className="border-t pt-4">
            <form action={deleteAction}>
              <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Delete Circle
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
