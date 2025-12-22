import { SentenceDrill } from "../entities/SentenceDrill";

export interface ISentenceDrillRepository {
  findAll(): Promise<SentenceDrill[]>;
}
