import { describe, it, expect } from 'vitest';
import { PatternGenerator } from './PatternGenerator';
import { SentencePattern, Word } from '../types';

// Mock noun data
const mockNouns = [
  Word.reconstruct({
    id: '1',
    value: 'soccer',
    type: 'noun',
    numberForm: 'none',
    label: '',
  }),
  Word.reconstruct({
    id: '2',
    value: 'cats',
    type: 'noun',
    numberForm: 'plural',
    label: '',
  }),
  Word.reconstruct({
    id: '3',
    value: 'dog',
    type: 'noun',
    numberForm: 'singular',
    label: '',
  }),
];

// Mock verb data with custom past form and third person form
const mockVerbs = [
  Word.reconstruct({
    id: '1',
    value: 'customverb',
    type: 'verb',
    pastForm: 'customverbed_past',
    thirdPersonForm: 'customverb_3p',
    label: '',
  }),
  Word.reconstruct({
    id: '2',
    value: 'sing',
    type: 'verb',
    pastForm: 'sang',
    thirdPersonForm: 'sings',
    label: '',
  }),
  Word.reconstruct({
    id: '3',
    value: 'study',
    type: 'verb',
    pastForm: 'studied',
    thirdPersonForm: 'studies',
    label: '',
  }),
];

describe('PatternGenerator', () => {
  describe('Be Verb', () => {
    it('should generate simple Present Positive SV sentence', () => {
      const state = SentencePattern.create({
        verbType: 'be',
        verb: 'be',
        sentenceType: 'positive',
        subject: 'first_s', // I
        tense: 'present',
        fiveSentencePattern: 'SV',
        beComplement: 'here',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'I am here.'
      );
    });

    it('should generate Past Negative SV sentence', () => {
      const state = SentencePattern.create({
        verbType: 'be',
        verb: 'be',
        sentenceType: 'negative',
        subject: 'third_p', // They
        tense: 'past',
        fiveSentencePattern: 'SV',
        beComplement: 'there',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        "They weren't there."
      );
    });

    it('should generate Future Question SV sentence', () => {
      const state = SentencePattern.create({
        verbType: 'be',
        verb: 'be',
        sentenceType: 'question',
        subject: 'second', // You
        tense: 'future',
        fiveSentencePattern: 'SV',
        beComplement: 'busy',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'Will you be busy?'
      );
    });

    describe('SVC Pattern (Complements)', () => {
      it('should handle Adjectives (not in noun list)', () => {
        const state = SentencePattern.create({
          verbType: 'be',
          verb: 'be',
          sentenceType: 'positive',
          subject: 'third_s', // He
          tense: 'present',
          fiveSentencePattern: 'SVC',
          beComplement: 'happy',
        });
        expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
          'He is happy.'
        );
      });

      it('should handle Countable Noun (Singular subject -> a/an)', () => {
        const state = SentencePattern.create({
          verbType: 'be',
          verb: 'be',
          sentenceType: 'positive',
          subject: 'third_s', // He
          tense: 'present',
          fiveSentencePattern: 'SVC',
          beComplement: 'dog',
        });
        expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
          'He is a dog.'
        );
      });

      it('should handle Countable Noun (Plural subject -> add s)', () => {
        const state = SentencePattern.create({
          verbType: 'be',
          verb: 'be',
          sentenceType: 'positive',
          subject: 'third_p', // They
          tense: 'present',
          fiveSentencePattern: 'SVC',
          beComplement: 'dog',
        });
        expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
          'They are dogs.'
        );
      });

      it('should handle Uncountable Noun (no article)', () => {
        const state = SentencePattern.create({
          verbType: 'be',
          verb: 'be',
          sentenceType: 'positive',
          subject: 'first_s', // I
          tense: 'present',
          fiveSentencePattern: 'SVC',
          beComplement: 'soccer',
        });
        expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
          'I am soccer.'
        );
      });
    });
  });

  describe('Do Verb', () => {
    it('should generate simple Present Positive SVO sentence', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'play',
        sentenceType: 'positive',
        subject: 'first_s', // I
        tense: 'present',
        fiveSentencePattern: 'SVO',
        object: 'soccer',
        numberForm: 'none',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'I play soccer.'
      );
    });

    it('should handle Third Person Singular (Present)', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'like',
        sentenceType: 'positive',
        subject: 'third_s', // He
        tense: 'present',
        fiveSentencePattern: 'SVO',
        object: 'pizza',
        numberForm: 'a',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'He likes a pizza.'
      );
    });

    it('should handle Past Negative', () => {
      const stateEat = SentencePattern.create({
        verbType: 'do',
        verb: 'eat',
        sentenceType: 'negative',
        subject: 'first_p',
        tense: 'past',
        fiveSentencePattern: 'SVO',
        object: 'apple',
        numberForm: 'an',
      });

      expect(PatternGenerator.generate(stateEat, mockNouns, mockVerbs)).toBe(
        "We didn't eat an apple."
      );
    });

    it('should handle Future Question', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'study',
        sentenceType: 'question',
        subject: 'second', // You
        tense: 'future',
        fiveSentencePattern: 'SVO',
        object: 'English',
        numberForm: 'no_article',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'Will you study English?'
      );
    });

    it('should use pastForm from provided verbWords if available', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'customverb',
        sentenceType: 'positive',
        subject: 'first_s',
        tense: 'past',
        fiveSentencePattern: 'SV',
      });
      // Should use 'customverbed_past' from mockVerbs
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'I customverbed_past.'
      );
    });

    it('should use thirdPersonForm from provided verbWords if available', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'customverb',
        sentenceType: 'positive',
        subject: 'third_s',
        tense: 'present',
        fiveSentencePattern: 'SV',
      });
      // Should use 'customverb_3p' from mockVerbs
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'He customverb_3p.'
      );
    });

    it('should fallback to default rules for third person form if not in list', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'watch',
        sentenceType: 'positive',
        subject: 'third_s',
        tense: 'present',
        fiveSentencePattern: 'SVO',
        object: 'tv',
        numberForm: 'none',
      });
      // 'watch' is not in mockVerbs, ends in 'ch' -> 'watches'
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'He watches tv.'
      );
    });

    it('should handle SVOO pattern (returns empty complement)', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'give',
        sentenceType: 'positive',
        subject: 'first_s',
        tense: 'present',
        fiveSentencePattern: 'SVOO',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'I give.'
      );
    });

    it('should handle SVOC pattern (returns empty complement)', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'make',
        sentenceType: 'positive',
        subject: 'first_s',
        tense: 'present',
        fiveSentencePattern: 'SVOC',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'I make.'
      );
    });

    it('should fallback to regular past form if verb not in list', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'walk',
        sentenceType: 'positive',
        subject: 'first_s',
        tense: 'past',
        fiveSentencePattern: 'SV',
      });
      // 'walk' is not in mockVerbs, should add 'ed'
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'I walked.'
      );
    });

    it('should handle verb ending with y (consonant+y -> ies)', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'try',
        sentenceType: 'positive',
        subject: 'third_s',
        tense: 'present',
        fiveSentencePattern: 'SV',
      });
      // 'try' ends with consonant+y -> 'tries'
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'He tries.'
      );
    });

    it('should handle numberForm "adjective" in SVO pattern', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'like',
        sentenceType: 'positive',
        subject: 'first_s',
        tense: 'present',
        fiveSentencePattern: 'SVO',
        object: 'apple',
        numberForm: 'adjective',
      });
      // numberForm 'adjective' should fall through to default
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'I like apple.'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle SVC pattern for Be verb', () => {
      const state = SentencePattern.create({
        verbType: 'be',
        verb: 'be',
        sentenceType: 'positive',
        subject: 'first_s',
        tense: 'present',
        fiveSentencePattern: 'SVC',
        beComplement: 'happy',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'I am happy.'
      );
    });

    it('should handle numberForm "the" in Be SVC pattern', () => {
      const state = SentencePattern.create({
        verbType: 'be',
        verb: 'be',
        sentenceType: 'positive',
        subject: 'third_s',
        tense: 'present',
        fiveSentencePattern: 'SVC',
        beComplement: 'dog',
        numberForm: 'the',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'He is the dog.'
      );
    });

    it('should handle possessive numberForm in Be SVC pattern', () => {
      const state = SentencePattern.create({
        verbType: 'be',
        verb: 'be',
        sentenceType: 'positive',
        subject: 'third_s',
        tense: 'present',
        fiveSentencePattern: 'SVC',
        beComplement: 'dog',
        numberForm: 'my',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'He is my dog.'
      );
    });

    it('should handle numberForm "plural" in Be SVC pattern', () => {
      const state = SentencePattern.create({
        verbType: 'be',
        verb: 'be',
        sentenceType: 'positive',
        subject: 'third_p',
        tense: 'present',
        fiveSentencePattern: 'SVC',
        beComplement: 'dog',
        numberForm: 'plural',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'They are dogs.'
      );
    });

    it('should handle numberForm "no_article" in Be SVC pattern', () => {
      const state = SentencePattern.create({
        verbType: 'be',
        verb: 'be',
        sentenceType: 'positive',
        subject: 'third_s',
        tense: 'present',
        fiveSentencePattern: 'SVC',
        beComplement: 'dog',
        numberForm: 'no_article',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'He is dog.'
      );
    });

    it('should handle already plural nouns in Be SVC pattern', () => {
      const state = SentencePattern.create({
        verbType: 'be',
        verb: 'be',
        sentenceType: 'positive',
        subject: 'third_p',
        tense: 'present',
        fiveSentencePattern: 'SVC',
        beComplement: 'cats',
        numberForm: 'a',
      });
      // 'cats' is already plural, should not add 's' again
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'They are cats.'
      );
    });

    it('should handle verb with adverb in SV pattern', () => {
      const mockVerbsWithAdverb = [
        Word.reconstruct({
          id: '1',
          value: 'run',
          type: 'verb',
          adverb: 'quickly',
          label: '',
        }),
      ];

      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'run',
        sentenceType: 'positive',
        subject: 'first_s',
        tense: 'present',
        fiveSentencePattern: 'SV',
      });

      expect(
        PatternGenerator.generate(state, mockNouns, mockVerbsWithAdverb)
      ).toBe('I run quickly.');
    });

    it('should handle second_p subject', () => {
      const state = SentencePattern.create({
        verbType: 'be',
        verb: 'be',
        sentenceType: 'positive',
        subject: 'second_p', // You (plural)
        tense: 'present',
        fiveSentencePattern: 'SV',
        beComplement: 'here',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'You are here.'
      );
    });

    it('should handle "something" as beComplement in SVC pattern', () => {
      const state = SentencePattern.create({
        verbType: 'be',
        verb: 'be',
        sentenceType: 'positive',
        subject: 'third_s',
        tense: 'present',
        fiveSentencePattern: 'SVC',
        beComplement: 'something',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'He is something.'
      );
    });

    it('should handle unknown sentence pattern (default case)', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'test',
        sentenceType: 'positive',
        subject: 'first_s',
        tense: 'present',
        // @ts-expect-error Testing unknown pattern
        fiveSentencePattern: 'UNKNOWN_PATTERN',
      });
      // Should return empty complement for unknown pattern
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'I test.'
      );
    });

    it('should handle Do_SV pattern with adverb', () => {
      const mockVerbsWithAdverb = [
        Word.reconstruct({
          id: '1',
          value: 'sleep',
          type: 'verb',
          adverb: 'soundly',
          label: '',
        }),
      ];

      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'sleep',
        sentenceType: 'positive',
        subject: 'first_s',
        tense: 'present',
        // @ts-expect-error Testing DO_SV pattern
        fiveSentencePattern: 'DO_SV',
      });

      expect(
        PatternGenerator.generate(state, mockNouns, mockVerbsWithAdverb)
      ).toBe('I sleep soundly.');
    });

    it('should handle SVO pattern with numberForm "the"', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'like',
        sentenceType: 'positive',
        subject: 'first_s',
        tense: 'present',
        fiveSentencePattern: 'SVO',
        object: 'book',
        numberForm: 'the',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'I like the book.'
      );
    });

    it('should handle SVO pattern with numberForm "plural"', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'like',
        sentenceType: 'positive',
        subject: 'first_s',
        tense: 'present',
        fiveSentencePattern: 'SVO',
        object: 'books',
        numberForm: 'plural',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'I like books.'
      );
    });

    it('should handle SVO pattern with possessive numberForm', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'like',
        sentenceType: 'positive',
        subject: 'first_s',
        tense: 'present',
        fiveSentencePattern: 'SVO',
        object: 'car',
        numberForm: 'his',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'I like his car.'
      );
    });

    it('should handle invalid subject (default case)', () => {
      const state = SentencePattern.create({
        verbType: 'be',
        verb: 'be',
        sentenceType: 'positive',
        // @ts-expect-error Testing invalid subject
        subject: 'invalid_subject',
        tense: 'present',
        fiveSentencePattern: 'SV',
        beComplement: 'here',
      });
      // Should return ' are here.' for invalid subject (empty subject text + default 'are')
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        ' are here.'
      );
    });

    it('should handle Future Positive with SVO complement', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'eat',
        sentenceType: 'positive',
        subject: 'first_s',
        tense: 'future',
        fiveSentencePattern: 'SVO',
        object: 'apple',
        numberForm: 'an',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'I will eat an apple.'
      );
    });

    it('should handle Future Negative with SVO complement', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'eat',
        sentenceType: 'negative',
        subject: 'first_s',
        tense: 'future',
        fiveSentencePattern: 'SVO',
        object: 'apple',
        numberForm: 'an',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        "I won't eat an apple."
      );
    });

    it('should handle Present Negative for third_s', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'like',
        sentenceType: 'negative',
        subject: 'third_s',
        tense: 'present',
        fiveSentencePattern: 'SVO',
        object: 'pizza',
        numberForm: 'a',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        "He doesn't like a pizza."
      );
    });

    it('should handle Present Negative for non-third_s', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'like',
        sentenceType: 'negative',
        subject: 'first_s',
        tense: 'present',
        fiveSentencePattern: 'SVO',
        object: 'pizza',
        numberForm: 'a',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        "I don't like a pizza."
      );
    });

    it('should handle Present Question for third_s', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'like',
        sentenceType: 'question',
        subject: 'third_s',
        tense: 'present',
        fiveSentencePattern: 'SVO',
        object: 'pizza',
        numberForm: 'a',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'Does he like a pizza?'
      );
    });

    it('should handle Present Question for non-third_s', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'like',
        sentenceType: 'question',
        subject: 'first_s',
        tense: 'present',
        fiveSentencePattern: 'SVO',
        object: 'pizza',
        numberForm: 'a',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'Do I like a pizza?'
      );
    });

    it('should handle Past Question', () => {
      const state = SentencePattern.create({
        verbType: 'do',
        verb: 'eat',
        sentenceType: 'question',
        subject: 'first_s',
        tense: 'past',
        fiveSentencePattern: 'SVO',
        object: 'apple',
        numberForm: 'an',
      });
      expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe(
        'Did I eat an apple?'
      );
    });
  });
});
