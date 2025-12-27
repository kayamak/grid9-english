'use server'

import { PrismaSentenceDrillRepository } from "@/infrastructure/repositories/PrismaSentenceDrillRepository";

export async function getSentenceDrills(pattern?: string) {
  const repository = new PrismaSentenceDrillRepository();
  const drills = pattern 
    ? await repository.findByPattern(pattern)
    : await repository.findAll();
  return drills.map(d => d.toObject());
}

export async function getDrillQuestQuestions(level: number) {
  const repository = new PrismaSentenceDrillRepository();
  let pattern = '';
  // Level mapping based on spec
  if ([1, 4, 7].includes(level)) pattern = 'DO_SV';
  else if ([2, 5, 8].includes(level)) pattern = 'DO_SVO';
  else if (level === 3) pattern = 'BE_SVC';
  else if ([6, 9].includes(level)) pattern = 'DO_SVC';

  const drills = await repository.findByPattern(pattern);
  
  if (level <= 3) {
    // Lead 10 questions (First 10)
    return drills.slice(0, 10).map(d => d.toObject());
  } else {
    // Random 10 questions
    const shuffled = [...drills].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10).map(d => d.toObject());
  }
}

export async function getUniquePatterns() {
  const repository = new PrismaSentenceDrillRepository();
  return await repository.findUniquePatterns();
}

