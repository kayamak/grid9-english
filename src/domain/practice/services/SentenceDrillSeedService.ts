
import { SentenceDrill } from '../entities/SentenceDrill';
import { ISentenceDrillRepository } from '../repositories/ISentenceDrillRepository';

export class SentenceDrillSeedService {
  constructor(private readonly repository: ISentenceDrillRepository) {}

  async seed(drills: SentenceDrill[]): Promise<void> {
    // Implementation for seeding drills
    // This is a placeholder aligning with the specification
    for (const drill of drills) {
      await this.repository.save(drill);
    }
  }
}
