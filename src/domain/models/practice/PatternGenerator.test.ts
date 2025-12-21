
import { describe, it, expect } from 'vitest';
import { PatternGenerator } from './PatternGenerator';
import { PracticeState } from './types';

// Mock noun data
const mockNouns = [
  { id: '1', value: 'soccer', type: 'noun', numberForm: 'none', label: '' }, 
  { id: '2', value: 'cats', type: 'noun', numberForm: 'plural', label: '' },
  { id: '3', value: 'dog', type: 'noun', numberForm: 'singular', label: '' }, 
];

// Mock verb data with custom past form
const mockVerbs = [
    { id: '1', value: 'customverb', type: 'verb', pastForm: 'customverbed_past', label: '' },
    { id: '2', value: 'sing', type: 'verb', pastForm: 'sang', label: '' },
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
            expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('I am here.');
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
            expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('They weren\'t there.');
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
            expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('Will you be busy?');
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
                expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('He is happy.');
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
                expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('He is a dog.');
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
                expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('They are dogs.');
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
                expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('I am soccer.');
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
                numberForm: 'none'
            };
            expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('I play soccer.');
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
            expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('He likes a pizza.');
        });
        
         it('should handle Past Negative', () => {
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

            expect(PatternGenerator.generate(stateEat, mockNouns, mockVerbs)).toBe('We didn\'t eat an apple.');
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
            expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('Will you study English?');
        });

        // New Test Case
        it('should use pastForm from provided verbWords if available', () => {
            const state: PracticeState = {
                verbType: 'do',
                verb: 'customverb',
                sentenceType: 'positive',
                subject: 'first_s',
                tense: 'past',
                fiveSentencePattern: 'SV'
            };
            // Should use 'customverbed_past' from mockVerbs
            expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('I customverbed_past.');
        });
        
        // New Test Case
        it('should fallback to default rule/list if verb not found in list', () => {
             const state: PracticeState = {
                verbType: 'do',
                verb: 'sing',
                sentenceType: 'positive',
                subject: 'first_s',
                tense: 'past',
                fiveSentencePattern: 'SV'
            };
            // 'sing' is in mockVerbs as 'sang'.
             expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('I sang.');

             // 'unknown' is NOT in mockVerbs, fallback to +ed
             const stateUnknown: PracticeState = {
                verbType: 'do',
                verb: 'unknown',
                sentenceType: 'positive',
                subject: 'first_s',
                tense: 'past',
                fiveSentencePattern: 'SV'
            };
            expect(PatternGenerator.generate(stateUnknown, mockNouns, mockVerbs)).toBe('I unknowned.');
        });
    });
});
