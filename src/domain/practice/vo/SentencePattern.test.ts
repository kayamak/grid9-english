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
});
