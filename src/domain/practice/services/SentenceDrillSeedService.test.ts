import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SentenceDrillSeedService } from './SentenceDrillSeedService';
import { ISentenceDrillRepository } from '../repositories/ISentenceDrillRepository';
import { SentenceDrill } from '../entities/SentenceDrill';

// Mock Repository
const mockRepository: ISentenceDrillRepository = {
  save: vi.fn(),
  findAll: vi.fn(),
  findByPattern: vi.fn(),
  findUniquePatterns: vi.fn(),
  count: vi.fn(),
};

describe('SentenceDrillSeedService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should save all drills using the repository', async () => {
    const service = new SentenceDrillSeedService(mockRepository);
    const drills = [
      SentenceDrill.create({
        id: '1',
        sentencePattern: 'SV',
        english: 'I run.',
        japanese: '私は走る。',
        sortOrder: 1,
      }),
      SentenceDrill.create({
        id: '2',
        sentencePattern: 'SVO',
        english: 'I eat apple.',
        japanese: '私はリンゴを食べる。',
        sortOrder: 2,
      }),
    ];

    await service.seed(drills);

    expect(mockRepository.save).toHaveBeenCalledTimes(2);
    expect(mockRepository.save).toHaveBeenCalledWith(drills[0]);
    expect(mockRepository.save).toHaveBeenCalledWith(drills[1]);
  });

  it('should handle empty drill list', async () => {
    const service = new SentenceDrillSeedService(mockRepository);
    const drills: SentenceDrill[] = [];

    await service.seed(drills);

    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});
