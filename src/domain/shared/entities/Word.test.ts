import { describe, it, expect } from 'vitest';
import { Word } from './Word';

describe('Word Entity', () => {
  const validProps = {
    id: '1',
    value: 'run',
    label: '走る',
    type: 'verb' as const,
    sortOrder: 1,
  };

  describe('create', () => {
    it('should create a Word instance with valid props', () => {
      const word = Word.create(validProps);
      expect(word).toBeInstanceOf(Word);
      expect(word.id).toBe('1');
      expect(word.value).toBe('run');
    });

    it('should throw error if id is missing', () => {
      expect(() => Word.create({ ...validProps, id: '' })).toThrow(
        'Word ID is required'
      );
    });

    it('should throw error if value is missing', () => {
      expect(() => Word.create({ ...validProps, value: '' })).toThrow(
        'Word value is required'
      );
    });
  });

  describe('reconstruct', () => {
    it('should reconstruct a Word instance', () => {
      const word = Word.reconstruct(validProps);
      expect(word).toBeInstanceOf(Word);
      expect(word.id).toBe('1');
    });
  });

  describe('toObject', () => {
    it('should return a plain object representation', () => {
      const word = Word.create(validProps);
      const obj = word.toObject();
      expect(obj).toEqual({
        id: '1',
        value: 'run',
        label: '走る',
        type: 'verb',
        numberForm: undefined,
        pastForm: undefined,
        thirdPersonForm: undefined,
        adverb: undefined,
        sentencePattern: undefined,
        sortOrder: 1,
      });
    });
  });
});
