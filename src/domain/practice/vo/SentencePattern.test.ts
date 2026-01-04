import { describe, it, expect } from 'vitest';
import { SentencePattern } from './SentencePattern';

describe('SentencePattern', () => {
  it('should create a valid sentence pattern', () => {
    const pattern = SentencePattern.create({
      verbType: 'do',
      verb: 'run',
      sentenceType: 'positive',
      subject: 'first_s',
      tense: 'present',
    });

    expect(pattern.verbType).toBe('do');
    expect(pattern.verb).toBe('run');
    expect(pattern.fiveSentencePattern).toBe('SVO'); // Default for 'do'
  });

  it('should set correct defaults for "be" verb', () => {
    const pattern = SentencePattern.create({
      verbType: 'be',
      verb: 'is',
      sentenceType: 'positive',
      subject: 'third_s',
      tense: 'present',
    });

    expect(pattern.fiveSentencePattern).toBe('SV');
    expect(pattern.numberForm).toBe('a');
  });

  it('should set correct defaults for "do" verb', () => {
    const pattern = SentencePattern.create({
      verbType: 'do',
      verb: 'play',
      sentenceType: 'positive',
      subject: 'first_s',
      tense: 'present',
    });

    expect(pattern.fiveSentencePattern).toBe('SVO');
    expect(pattern.numberForm).toBe('none');
  });

  it('should throw error for invalid be verb pattern', () => {
    expect(() => {
      SentencePattern.create({
        verbType: 'be',
        verb: 'be',
        sentenceType: 'positive',
        subject: 'third_s',
        tense: 'present',
        fiveSentencePattern: 'SVO',
      });
    }).toThrow('Invalid sentence pattern');
  });

  it('should rotate subject correctly', () => {
    const pattern = SentencePattern.create({
      verbType: 'do',
      verb: 'run',
      sentenceType: 'positive',
      subject: 'first_s',
      tense: 'present',
    });

    const rotated = pattern.rotateSubject();
    expect(rotated.subject).toBe('first_p');

    const rotatedAgain = rotated.rotateSubject();
    expect(rotatedAgain.subject).toBe('first_s');
  });

  it('should toggle sentence type', () => {
    const pattern = SentencePattern.create({
      verbType: 'do',
      verb: 'run',
      sentenceType: 'positive',
      subject: 'first_s',
      tense: 'present',
    });

    const toggled = pattern.toggleSentenceType('negative');
    expect(toggled.sentenceType).toBe('negative');
  });

  it('should change tense', () => {
    const pattern = SentencePattern.create({
      verbType: 'do',
      verb: 'run',
      sentenceType: 'positive',
      subject: 'first_s',
      tense: 'present',
    });

    const changed = pattern.changeTense('past');
    expect(changed.tense).toBe('past');
  });

  it('should expose all properties via getters', () => {
    const pattern = SentencePattern.create({
      verbType: 'be',
      verb: 'is',
      sentenceType: 'positive',
      subject: 'third_s',
      tense: 'present',
      fiveSentencePattern: 'SV',
      object: 'an apple',
      numberForm: 'a',
      beComplement: 'happy',
    });

    expect(pattern.verbType).toBe('be');
    expect(pattern.verb).toBe('is');
    expect(pattern.sentenceType).toBe('positive');
    expect(pattern.subject).toBe('third_s');
    expect(pattern.tense).toBe('present');
    expect(pattern.fiveSentencePattern).toBe('SV');
    expect(pattern.object).toBe('an apple');
    expect(pattern.numberForm).toBe('a');
    expect(pattern.beComplement).toBe('happy');
  });

  it('should convert to plain object correctly', () => {
    const props = {
      verbType: 'do' as const,
      verb: 'run',
      sentenceType: 'positive' as const,
      subject: 'first_s' as const,
      tense: 'present' as const,
      fiveSentencePattern: 'SVO' as const,
      object: 'something',
      numberForm: 'a' as const,
      beComplement: 'here',
    };
    const pattern = SentencePattern.create(props);

    expect(pattern.toObject()).toEqual(props);
  });
});
