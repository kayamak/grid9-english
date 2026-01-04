import { describe, it, expect } from 'vitest';
import { SentencePatternSpecification } from './SentencePatternSpecification';
import { SentencePattern } from '../vo/SentencePattern';

describe('SentencePatternSpecification', () => {
  const spec = new SentencePatternSpecification();

  describe('isSatisfiedBy', () => {
    it('should return false for be verb with SVO pattern', () => {
      const pattern = {
        verbType: 'be',
        fiveSentencePattern: 'SVO',
      } as SentencePattern;
      expect(spec.isSatisfiedBy(pattern)).toBe(false);
    });

    it('should return false for be verb with SVOO pattern', () => {
      const pattern = {
        verbType: 'be',
        fiveSentencePattern: 'SVOO',
      } as SentencePattern;
      expect(spec.isSatisfiedBy(pattern)).toBe(false);
    });

    it('should return false for be verb with SVOC pattern', () => {
      const pattern = {
        verbType: 'be',
        fiveSentencePattern: 'SVOC',
      } as SentencePattern;
      expect(spec.isSatisfiedBy(pattern)).toBe(false);
    });

    it('should return true for be verb with valid pattern (e.g., SVC)', () => {
      const pattern = {
        verbType: 'be',
        fiveSentencePattern: 'SVC',
      } as SentencePattern;
      expect(spec.isSatisfiedBy(pattern)).toBe(true);
    });

    it('should return true for do verb with any pattern', () => {
      const pattern = {
        verbType: 'do',
        fiveSentencePattern: 'SVO',
      } as SentencePattern;
      expect(spec.isSatisfiedBy(pattern)).toBe(true);
    });
  });
});
