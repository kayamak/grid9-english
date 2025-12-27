import { describe, it, expect } from 'vitest';
import { SentenceDrill } from './SentenceDrill';

describe('SentenceDrill', () => {
  it('should create a SentenceDrill instance', () => {
    const drill = SentenceDrill.create({
      id: '1',
      sentencePattern: 'SV',
      english: 'I run.',
      japanese: '私は走る。',
      sortOrder: 1,
    });

    expect(drill.id).toBe('1');
    expect(drill.sentencePattern).toBe('SV');
    expect(drill.english).toBe('I run.');
    expect(drill.japanese).toBe('私は走る。');
    expect(drill.sortOrder).toBe(1);
  });

  it('should throw an error if id is missing', () => {
    expect(() => {
      SentenceDrill.create({
        id: '',
        sentencePattern: 'SV',
        english: 'I run.',
        japanese: '私は走る。',
        sortOrder: 1,
      });
    }).toThrow('SentenceDrill ID is required');
  });

  it('should throw an error if sentencePattern is missing', () => {
    expect(() => {
      SentenceDrill.create({
        id: '1',
        sentencePattern: '',
        english: 'I run.',
        japanese: '私は走る。',
        sortOrder: 1,
      });
    }).toThrow('Sentence pattern is required for drill: 1');
  });

  it('should throw an error if english is missing', () => {
    expect(() => {
      SentenceDrill.create({
        id: '1',
        sentencePattern: 'SV',
        english: '',
        japanese: '私は走る。',
        sortOrder: 1,
      });
    }).toThrow('English sentence is required');
  });

  it('should throw an error if japanese is missing', () => {
    expect(() => {
      SentenceDrill.create({
        id: '1',
        sentencePattern: 'SV',
        english: 'I run.',
        japanese: '',
        sortOrder: 1,
      });
    }).toThrow('Japanese sentence is required');
  });

  it('should reconstruct from object', () => {
    const drill = SentenceDrill.reconstruct({
      id: '1',
      sentencePattern: 'SV',
      english: 'I run.',
      japanese: '私は走る。',
      sortOrder: 1,
    });

    expect(drill.toObject()).toEqual({
      id: '1',
      sentencePattern: 'SV',
      english: 'I run.',
      japanese: '私は走る。',
      sortOrder: 1,
    });
  });
});
