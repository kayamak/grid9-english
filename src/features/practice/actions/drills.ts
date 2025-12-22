'use server'

import { PrismaSentenceDrillRepository } from "@/infrastructure/repositories/PrismaSentenceDrillRepository";

export async function getSentenceDrills(pattern?: string) {
  const repository = new PrismaSentenceDrillRepository();
  const drills = pattern 
    ? await repository.findByPattern(pattern)
    : await repository.findAll();
  return drills.map(d => d.toObject());
}

export async function getUniquePatterns() {
  const repository = new PrismaSentenceDrillRepository();
  return await repository.findUniquePatterns();
}
