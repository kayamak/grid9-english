'use server'

import { PrismaSentenceDrillRepository } from "@/infrastructure/repositories/PrismaSentenceDrillRepository";

export async function getSentenceDrills() {
  const repository = new PrismaSentenceDrillRepository();
  const drills = await repository.findAll();
  return drills.map(d => d.toObject());
}
