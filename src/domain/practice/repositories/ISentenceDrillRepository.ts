import { SentenceDrill } from "../entities/SentenceDrill";

export interface ISentenceDrillRepository {
  findAll(): Promise<SentenceDrill[]>;
  findByPattern(pattern: string): Promise<SentenceDrill[]>;
  findUniquePatterns(): Promise<string[]>;
  save(drill: SentenceDrill): Promise<void>;
  count(): Promise<number>;
}
