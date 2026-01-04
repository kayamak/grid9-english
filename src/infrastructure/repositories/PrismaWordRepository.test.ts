import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaWordRepository } from './PrismaWordRepository';

// Mock the prisma client
const { mockPrisma } = vi.hoisted(() => {
  return {
    mockPrisma: {
      nounWord: { findMany: vi.fn() },
      beVerbWord: { findMany: vi.fn() },
      doVerbWord: { findMany: vi.fn() },
      adjectiveWord: { findMany: vi.fn() },
      adverbWord: { findMany: vi.fn() },
    },
  };
});

vi.mock('@/infrastructure/prisma/client', () => ({
  prisma: mockPrisma,
}));

describe('PrismaWordRepository', () => {
  let repository: PrismaWordRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new PrismaWordRepository();
  });

  describe('getNounWords', () => {
    it('should return noun words', async () => {
      const mockData = [
        {
          id: '1',
          value: 'dog',
          label: '犬',
          numberForm: 'dogs',
          sortOrder: 1,
        },
      ];
      mockPrisma.nounWord.findMany.mockResolvedValue(mockData);

      const result = await repository.getNounWords();

      expect(mockPrisma.nounWord.findMany).toHaveBeenCalledWith({
        orderBy: { sortOrder: 'asc' },
      });
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('noun');
    });
  });

  describe('getVerbWords', () => {
    it('should return be verbs when type is be', async () => {
      const mockBeVerbs = [
        { id: '1', value: 'is', label: '〜です', sortOrder: 1 },
      ];
      mockPrisma.beVerbWord.findMany.mockResolvedValue(mockBeVerbs);

      const result = await repository.getVerbWords('be');

      expect(mockPrisma.beVerbWord.findMany).toHaveBeenCalled();
      expect(mockPrisma.doVerbWord.findMany).not.toHaveBeenCalled(); // Wait, this depends on implementation
      // Wait, let's check implementation again.
      // if (!type || type === 'be') -> calls beVerb
      // if (!type || type === 'do') -> calls doVerb
      // correct.
      expect(result).toHaveLength(1);
      expect(result[0].value).toBe('is');
    });

    it('should return do verbs when type is do', async () => {
      const mockDoVerbs = [
        { id: '2', value: 'run', label: '走る', sortOrder: 2 },
      ];
      mockPrisma.doVerbWord.findMany.mockResolvedValue(mockDoVerbs);

      const result = await repository.getVerbWords('do');

      expect(mockPrisma.beVerbWord.findMany).not.toHaveBeenCalled();
      expect(mockPrisma.doVerbWord.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].value).toBe('run');
    });

    it('should return both when type is undefined', async () => {
      const mockBeVerbs = [{ id: '1', value: 'is', sortOrder: 1 }];
      const mockDoVerbs = [{ id: '2', value: 'run', sortOrder: 2 }];
      mockPrisma.beVerbWord.findMany.mockResolvedValue(mockBeVerbs);
      mockPrisma.doVerbWord.findMany.mockResolvedValue(mockDoVerbs);

      const result = await repository.getVerbWords();

      expect(mockPrisma.beVerbWord.findMany).toHaveBeenCalled();
      expect(mockPrisma.doVerbWord.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('should filter do verbs by pattern if provided', async () => {
      mockPrisma.doVerbWord.findMany.mockResolvedValue([]);

      await repository.getVerbWords('do', 'SVO');

      expect(mockPrisma.doVerbWord.findMany).toHaveBeenCalledWith({
        where: { sentencePattern: 'SVO' },
        orderBy: { sortOrder: 'asc' },
      });
    });
  });

  describe('getAdjectiveWords', () => {
    it('should return adjectives', async () => {
      const mockData = [
        { id: '1', value: 'happy', label: '幸せな', sortOrder: 1 },
      ];
      mockPrisma.adjectiveWord.findMany.mockResolvedValue(mockData);

      const result = await repository.getAdjectiveWords();

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('adjective');
    });
  });

  describe('getAdverbWords', () => {
    it('should return adverbs', async () => {
      const mockData = [
        { id: '1', value: 'quickly', label: '速く', sortOrder: 1 },
      ];
      mockPrisma.adverbWord.findMany.mockResolvedValue(mockData);

      const result = await repository.getAdverbWords();

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('adverb');
    });
  });
});
