// Removed 'use server' for SSG

import { PrismaWordRepository } from '@/infrastructure/repositories/PrismaWordRepository';

export async function getNounWords() {
  const repository = new PrismaWordRepository();
  const words = await repository.getNounWords();
  return words.map((w) => w.toObject());
}

export async function getVerbWords(type?: 'do' | 'be', pattern?: string) {
  const repository = new PrismaWordRepository();
  const words = await repository.getVerbWords(type, pattern);
  return words.map((w) => w.toObject());
}

export async function getAdjectiveWords() {
  const repository = new PrismaWordRepository();
  const words = await repository.getAdjectiveWords();
  return words.map((w) => w.toObject());
}

export async function getAdverbWords() {
  const repository = new PrismaWordRepository();
  const words = await repository.getAdverbWords();
  return words.map((w) => w.toObject());
}
