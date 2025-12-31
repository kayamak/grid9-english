import { describe, it, expect, vi } from 'vitest';
import { SentenceDrillSeedService } from './SentenceDrillSeedService';
import { ISentenceDrillRepository } from '../repositories/ISentenceDrillRepository';
import { SentenceDrill } from '../entities/SentenceDrill';

describe('SentenceDrillSeedService', () => {
  it('should seed data accurately', async () => {
    // Mock Repository
    const mockSave = vi.fn().mockImplementation(async () => {});
    const mockRepo: ISentenceDrillRepository = {
      findAll: vi.fn(),
      findByPattern: vi.fn(),
      findUniquePatterns: vi.fn(),
      save: mockSave,
      count: vi.fn(),
    };

    const service = new SentenceDrillSeedService(mockRepo);
    const count = await service.execute();

    // Verify count matches the constant data length (which is 63 items in the list)
    expect(count).toBe(63);
    expect(mockSave).toHaveBeenCalledTimes(63);

    // Verify first call
    const firstCallArg = mockSave.mock.calls[0][0] as SentenceDrill;
    expect(firstCallArg.english).toBe('You live.');
    expect(firstCallArg.japanese).toBe('あなたは住んでいます。');
    expect(firstCallArg.sortOrder).toBe(1);

    // Check one call structure
    expect(firstCallArg).toBeInstanceOf(SentenceDrill);
  });
});
