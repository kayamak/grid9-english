import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSentenceDrills, getDrillQuestQuestions, getUniquePatterns } from './drills';
import { PrismaSentenceDrillRepository } from "@/infrastructure/repositories/PrismaSentenceDrillRepository";
import { SentenceDrill } from "@/domain/practice/entities/SentenceDrill";

vi.mock("@/infrastructure/repositories/PrismaSentenceDrillRepository");

describe('drills actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSentenceDrills', () => {
    it('should fetch all drills when no pattern is provided', async () => {
      const mockDrills = [
        SentenceDrill.reconstruct({ id: '1', sentencePattern: 'SV', english: 'I run', japanese: '私は走る', sortOrder: 1 }),
      ];
      const findAllSpy = vi.spyOn(PrismaSentenceDrillRepository.prototype, 'findAll').mockResolvedValue(mockDrills);

      const result = await getSentenceDrills();

      expect(findAllSpy).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should fetch drills by pattern when provided', async () => {
      const mockDrills = [
        SentenceDrill.reconstruct({ id: '1', sentencePattern: 'SV', english: 'I run', japanese: '私は走る', sortOrder: 1 }),
      ];
      const findByPatternSpy = vi.spyOn(PrismaSentenceDrillRepository.prototype, 'findByPattern').mockResolvedValue(mockDrills);

      const result = await getSentenceDrills('SV');

      expect(findByPatternSpy).toHaveBeenCalledWith('SV');
      expect(result).toHaveLength(1);
    });
  });

  describe('getDrillQuestQuestions', () => {
    it('should return 10 questions for level 1 (DO_SV)', async () => {
      const mockDrills = Array.from({ length: 15 }, (_, i) => 
        SentenceDrill.reconstruct({ 
          id: String(i), 
          sentencePattern: 'DO_SV', 
          english: `English ${i}`, 
          japanese: `Japanese ${i}`, 
          sortOrder: i 
        })
      );
      vi.spyOn(PrismaSentenceDrillRepository.prototype, 'findByPattern').mockResolvedValue(mockDrills);

      const result = await getDrillQuestQuestions(1);

      expect(result).toHaveLength(10);
      // Level 1-3 should return the first 10 (not shuffled)
      expect(result[0].id).toBe('0');
      expect(result[9].id).toBe('9');
    });

    it('should return 10 random questions for level 4 (DO_SV)', async () => {
      const mockDrills = Array.from({ length: 20 }, (_, i) => 
        SentenceDrill.reconstruct({ 
          id: String(i), 
          sentencePattern: 'DO_SV', 
          english: `English ${i}`, 
          japanese: `Japanese ${i}`, 
          sortOrder: i 
        })
      );
      vi.spyOn(PrismaSentenceDrillRepository.prototype, 'findByPattern').mockResolvedValue(mockDrills);

      const result = await getDrillQuestQuestions(4);

      expect(result).toHaveLength(10);
      // Level 4+ should be shuffled, so we can't guarantee order, 
      // but we can check it's a subset.
      const ids = result.map(r => r.id);
      expect(ids.every(id => Number(id) >= 0 && Number(id) < 20)).toBe(true);
    });

    it('should return all patterns for level 10', async () => {
      const mockDrills = [
        SentenceDrill.reconstruct({ id: '1', sentencePattern: 'SV', english: 'E1', japanese: 'J1', sortOrder: 1 }),
        SentenceDrill.reconstruct({ id: '2', sentencePattern: 'SVO', english: 'E2', japanese: 'J2', sortOrder: 2 }),
      ];
      const findAllSpy = vi.spyOn(PrismaSentenceDrillRepository.prototype, 'findAll').mockResolvedValue(mockDrills);

      await getDrillQuestQuestions(10);

      expect(findAllSpy).toHaveBeenCalled();
    });
  });

  describe('getUniquePatterns', () => {
    it('should return unique patterns from repository', async () => {
      const mockPatterns = ['SV', 'SVO', 'SVC'];
      const findUniquePatternsSpy = vi.spyOn(PrismaSentenceDrillRepository.prototype, 'findUniquePatterns').mockResolvedValue(mockPatterns);

      const result = await getUniquePatterns();

      expect(findUniquePatternsSpy).toHaveBeenCalled();
      expect(result).toEqual(mockPatterns);
    });
  });
});
