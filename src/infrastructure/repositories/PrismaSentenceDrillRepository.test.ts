import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaSentenceDrillRepository } from './PrismaSentenceDrillRepository';
import { SentenceDrill } from '@/domain/practice/entities/SentenceDrill';

// Mock the prisma client
const { mockPrisma } = vi.hoisted(() => {
  return {
    mockPrisma: {
      sentenceDrill: {
        findMany: vi.fn(),
        groupBy: vi.fn(),
        upsert: vi.fn(),
        count: vi.fn(),
      },
    },
  };
});

vi.mock('@/infrastructure/prisma/client', () => ({
  prisma: mockPrisma,
}));

describe('PrismaSentenceDrillRepository', () => {
  let repository: PrismaSentenceDrillRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new PrismaSentenceDrillRepository();
  });

  describe('findAll', () => {
    it('should return all drills', async () => {
      const mockData = [
        {
          id: '1',
          sentencePattern: 'SVO',
          english: 'I love you',
          japanese: '愛してる',
          sortOrder: 1,
        },
      ];
      mockPrisma.sentenceDrill.findMany.mockResolvedValue(mockData);

      const result = await repository.findAll();

      expect(mockPrisma.sentenceDrill.findMany).toHaveBeenCalledWith({
        orderBy: { sortOrder: 'asc' },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(SentenceDrill);
      expect(result[0].id).toBe('1');
    });
  });

  describe('findByPattern', () => {
    it('should return drills for specific pattern', async () => {
      const mockData = [
        {
          id: '2',
          sentencePattern: 'SVC',
          english: 'I am happy',
          japanese: '幸せだ',
          sortOrder: 2,
        },
      ];
      mockPrisma.sentenceDrill.findMany.mockResolvedValue(mockData);

      const result = await repository.findByPattern('SVC');

      expect(mockPrisma.sentenceDrill.findMany).toHaveBeenCalledWith({
        where: { sentencePattern: 'SVC' },
        orderBy: { sortOrder: 'asc' },
      });
      expect(result).toHaveLength(1);
      expect(result[0].sentencePattern).toBe('SVC');
    });
  });

  describe('findUniquePatterns', () => {
    it('should return unique patterns', async () => {
      const mockData = [{ sentencePattern: 'SVO' }, { sentencePattern: 'SVC' }];
      mockPrisma.sentenceDrill.groupBy.mockResolvedValue(mockData);

      const result = await repository.findUniquePatterns();

      expect(mockPrisma.sentenceDrill.groupBy).toHaveBeenCalledWith({
        by: ['sentencePattern'],
      });
      expect(result).toEqual(['SVO', 'SVC']);
    });
  });

  describe('save', () => {
    it('should upsert drill', async () => {
      const drill = SentenceDrill.create({
        id: '1',
        sentencePattern: 'SVO',
        english: 'Test',
        japanese: 'テスト',
        sortOrder: 1,
      });

      await repository.save(drill);

      expect(mockPrisma.sentenceDrill.upsert).toHaveBeenCalledWith({
        where: { id: '1' },
        update: {
          sentencePattern: 'SVO',
          english: 'Test',
          japanese: 'テスト',
          sortOrder: 1,
        },
        create: {
          id: '1',
          sentencePattern: 'SVO',
          english: 'Test',
          japanese: 'テスト',
          sortOrder: 1,
        },
      });
    });
  });

  describe('count', () => {
    it('should return count', async () => {
      mockPrisma.sentenceDrill.count.mockResolvedValue(5);

      const result = await repository.count();

      expect(result).toBe(5);
    });
  });
});
