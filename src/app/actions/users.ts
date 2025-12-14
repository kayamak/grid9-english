'use server'

import { UserService } from '../../application/services/UserService';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) throw new Error("Name is required");

  const service = new UserService();
  await service.register(name);
  
  revalidatePath('/users');
  redirect('/users');
}

export async function updateUser(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) throw new Error("Name is required");

  const service = new UserService();
  await service.update(id, name);
  
  revalidatePath(`/users/${id}`);
  revalidatePath('/users');
}

export async function deleteUser(id: string) {
  const service = new UserService();
  await service.delete(id);
  
  revalidatePath('/users');
  redirect('/users');
}
