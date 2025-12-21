
import { describe, it, expect } from 'vitest';
import { PatternGenerator } from './PatternGenerator';
import { PracticeState } from './types';

// Mock noun data
const mockNouns = [
  { value: 'soccer', numberForm: 'none' }, // Uncountable
  { value: 'cats', numberForm: 'plural' }, // Always plural
  { value: 'dog', numberForm: 'singular' }, // Countable singular
];

describe('PatternGenerator', () => {
    describe('Be Verb', () => {
        it('should generate simple Present Positive SV sentence', () => {
            const state: PracticeState = {
                verbType: 'be',
                verb: 'be',
                sentenceType: 'positive',
                subject: 'first_s', // I
                tense: 'present',
                fiveSentencePattern: 'SV',
                beComplement: 'here'
            };
            expect(PatternGenerator.generate(state, mockNouns)).toBe('I am here.');
        });

        it('should generate Past Negative SV sentence', () => {
             const state: PracticeState = {
                verbType: 'be',
                verb: 'be',
                sentenceType: 'negative',
                subject: 'third_p', // They
                tense: 'past',
                fiveSentencePattern: 'SV',
                beComplement: 'there'
            };
            expect(PatternGenerator.generate(state, mockNouns)).toBe('They weren\'t there.');
        });
        
         it('should generate Future Question SV sentence', () => {
             const state: PracticeState = {
                verbType: 'be',
                verb: 'be',
                sentenceType: 'question',
                subject: 'second', // You
                tense: 'future',
                fiveSentencePattern: 'SV',
                beComplement: 'busy'
            };
            expect(PatternGenerator.generate(state, mockNouns)).toBe('Will you be busy?'); // Adjective "busy" works as adverbial/complement roughly in this logic
        });

        describe('SVC Pattern (Complements)', () => {
             it('should handle Adjectives (not in noun list)', () => {
                const state: PracticeState = {
                    verbType: 'be',
                    verb: 'be',
                    sentenceType: 'positive',
                    subject: 'third_s', // He
                    tense: 'present',
                    fiveSentencePattern: 'SVC',
                    beComplement: 'happy'
                };
                // "happy" is not in mockNouns, treated as adjective -> no article
                expect(PatternGenerator.generate(state, mockNouns)).toBe('He is happy.');
            });

             it('should handle Countable Noun (Singular subject -> a/an)', () => {
                 const state: PracticeState = {
                    verbType: 'be',
                    verb: 'be',
                    sentenceType: 'positive',
                    subject: 'third_s', // He
                    tense: 'present',
                    fiveSentencePattern: 'SVC',
                    beComplement: 'dog'
                };
                // "dog" is in mockNouns (singular). Subject is singular -> "a dog"
                expect(PatternGenerator.generate(state, mockNouns)).toBe('He is a dog.');
             });
             
             it('should handle Countable Noun (Plural subject -> add s)', () => {
                 const state: PracticeState = {
                    verbType: 'be',
                    verb: 'be',
                    sentenceType: 'positive',
                    subject: 'third_p', // They
                    tense: 'present',
                    fiveSentencePattern: 'SVC',
                    beComplement: 'dog'
                };
                // "dog" is in mockNouns (singular). Subject is plural -> "dogs"
                expect(PatternGenerator.generate(state, mockNouns)).toBe('They are dogs.');
             });
             
             it('should handle Uncountable Noun (no article)', () => {
                 const state: PracticeState = {
                    verbType: 'be',
                    verb: 'be',
                    sentenceType: 'positive',
                    subject: 'first_s', // I
                    tense: 'present',
                    fiveSentencePattern: 'SVC',
                    beComplement: 'soccer'
                };
                // "soccer" is none -> "soccer"
                expect(PatternGenerator.generate(state, mockNouns)).toBe('I am soccer.'); // Nonsense semantically, but grammatical for this logic (Identity)
             });
        });
    });

    describe('Do Verb', () => {
         it('should generate simple Present Positive SVO sentence', () => {
            const state: PracticeState = {
                verbType: 'do',
                verb: 'play',
                sentenceType: 'positive',
                subject: 'first_s', // I
                tense: 'present',
                fiveSentencePattern: 'SVO',
                object: 'soccer',
                numberForm: 'none' // User explicitly selected none/no article
            };
            expect(PatternGenerator.generate(state, mockNouns)).toBe('I play soccer.');
        });

         it('should handle Third Person Singular (Present)', () => {
            const state: PracticeState = {
                verbType: 'do',
                verb: 'like',
                sentenceType: 'positive',
                subject: 'third_s', // He
                tense: 'present',
                fiveSentencePattern: 'SVO',
                object: 'pizza',
                numberForm: 'a'
            };
            expect(PatternGenerator.generate(state, mockNouns)).toBe('He likes a pizza.');
        });
        
         it('should handle Past Negative', () => {
            const state: PracticeState = {
                verbType: 'do',
                verb: 'go',
                sentenceType: 'negative',
                subject: 'first_p', // We
                tense: 'past',
                fiveSentencePattern: 'SVO', // "go" is usually SV but user can force SVO in this app maybe? Or just testing logic
                object: 'park', // "go park" is wrong, but "go to ...". 
                // Wait, PatternGenerator doesn't add "to". It just joins verb + object.
                // If the app expects "go to the park", the object/verb usually handles it or it's SV with adverb.
                // Let's stick to "eat apple"
            } as any; // Allow partial if needed, but PracticeState is strict.
            
            const stateEat: PracticeState = {
                verbType: 'do',
                verb: 'eat',
                sentenceType: 'negative',
                subject: 'first_p',
                tense: 'past',
                fiveSentencePattern: 'SVO',
                object: 'apple',
                numberForm: 'an'
            };

            expect(PatternGenerator.generate(stateEat, mockNouns)).toBe('We didn\'t eat an apple.');
        });
        
        it('should handle Future Question', () => {
             const state: PracticeState = {
                verbType: 'do',
                verb: 'study',
                sentenceType: 'question',
                subject: 'second', // You
                tense: 'future',
                fiveSentencePattern: 'SVO',
                object: 'English',
                numberForm: 'no_article'
            };
            expect(PatternGenerator.generate(state, mockNouns)).toBe('Will you study English?');
        });
    });
});
