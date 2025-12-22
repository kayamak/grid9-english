'use server'

import { CircleService } from './CircleService';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCircle(formData: FormData) {
  const name = formData.get('name') as string;
  const ownerId = formData.get('ownerId') as string;
  
  if (!name || !ownerId) throw new Error("Name and OwnerId are required");

  const service = new CircleService();
  await service.create(name, ownerId);
  
  revalidatePath('/circles');
  redirect('/circles');
}

export async function joinCircle(circleId: string, formData: FormData) {
  const userId = formData.get('userId') as string;
  if (!userId) throw new Error("UserId is required");

  const service = new CircleService();
  await service.join(circleId, userId);
  
  revalidatePath(`/circles/${circleId}`);
}

export async function updateCircle(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const service = new CircleService();
  await service.update(id, name);
  
  revalidatePath(`/circles/${id}`);
  revalidatePath('/circles');
}

export async function deleteCircle(id: string) {
  const service = new CircleService();
  await service.delete(id);
  
  revalidatePath('/circles');
  redirect('/circles');
}
