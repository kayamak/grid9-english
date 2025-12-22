import { describe, it, expect } from 'vitest';
import { PatternGenerator } from './PatternGenerator';
import { SentencePattern, Word } from '../types';

// Mock noun data
const mockNouns = [
  Word.reconstruct({ id: '1', value: 'soccer', type: 'noun', numberForm: 'none', label: '' }), 
  Word.reconstruct({ id: '2', value: 'cats', type: 'noun', numberForm: 'plural', label: '' }),
  Word.reconstruct({ id: '3', value: 'dog', type: 'noun', numberForm: 'singular', label: '' }), 
];

// Mock verb data with custom past form and third person form
const mockVerbs = [
    Word.reconstruct({ id: '1', value: 'customverb', type: 'verb', pastForm: 'customverbed_past', thirdPersonForm: 'customverb_3p', label: '' }),
    Word.reconstruct({ id: '2', value: 'sing', type: 'verb', pastForm: 'sang', thirdPersonForm: 'sings', label: '' }),
    Word.reconstruct({ id: '3', value: 'study', type: 'verb', pastForm: 'studied', thirdPersonForm: 'studies', label: '' }),
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
                beComplement: 'here'
            });
            expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('I am here.');
        });

        it('should generate Past Negative SV sentence', () => {
             const state = SentencePattern.create({
                verbType: 'be',
                verb: 'be',
                sentenceType: 'negative',
                subject: 'third_p', // They
                tense: 'past',
                fiveSentencePattern: 'SV',
                beComplement: 'there'
            });
            expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('They weren\'t there.');
        });
        
         it('should generate Future Question SV sentence', () => {
             const state = SentencePattern.create({
                verbType: 'be',
                verb: 'be',
                sentenceType: 'question',
                subject: 'second', // You
                tense: 'future',
                fiveSentencePattern: 'SV',
                beComplement: 'busy'
            });
            expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('Will you be busy?');
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
                    beComplement: 'happy'
                });
                expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('He is happy.');
            });

             it('should handle Countable Noun (Singular subject -> a/an)', () => {
                  const state = SentencePattern.create({
                    verbType: 'be',
                    verb: 'be',
                    sentenceType: 'positive',
                    subject: 'third_s', // He
                    tense: 'present',
                    fiveSentencePattern: 'SVC',
                    beComplement: 'dog'
                });
                expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('He is a dog.');
             });
             
             it('should handle Countable Noun (Plural subject -> add s)', () => {
                  const state = SentencePattern.create({
                    verbType: 'be',
                    verb: 'be',
                    sentenceType: 'positive',
                    subject: 'third_p', // They
                    tense: 'present',
                    fiveSentencePattern: 'SVC',
                    beComplement: 'dog'
                });
                expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('They are dogs.');
             });
             
             it('should handle Uncountable Noun (no article)', () => {
                  const state = SentencePattern.create({
                    verbType: 'be',
                    verb: 'be',
                    sentenceType: 'positive',
                    subject: 'first_s', // I
                    tense: 'present',
                    fiveSentencePattern: 'SVC',
                    beComplement: 'soccer'
                });
                expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('I am soccer.');
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
                numberForm: 'none'
            });
            expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('I play soccer.');
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
                numberForm: 'a'
            });
            expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('He likes a pizza.');
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
                numberForm: 'an'
            });

            expect(PatternGenerator.generate(stateEat, mockNouns, mockVerbs)).toBe('We didn\'t eat an apple.');
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
                numberForm: 'no_article'
            });
            expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('Will you study English?');
        });

        it('should use pastForm from provided verbWords if available', () => {
            const state = SentencePattern.create({
                verbType: 'do',
                verb: 'customverb',
                sentenceType: 'positive',
                subject: 'first_s',
                tense: 'past',
                fiveSentencePattern: 'SV'
            });
            // Should use 'customverbed_past' from mockVerbs
            expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('I customverbed_past.');
        });

        it('should use thirdPersonForm from provided verbWords if available', () => {
            const state = SentencePattern.create({
                verbType: 'do',
                verb: 'customverb',
                sentenceType: 'positive',
                subject: 'third_s',
                tense: 'present',
                fiveSentencePattern: 'SV'
            });
            // Should use 'customverb_3p' from mockVerbs
            expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('He customverb_3p.');
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
                numberForm: 'none'
            });
            // 'watch' is not in mockVerbs, ends in 'ch' -> 'watches'
            expect(PatternGenerator.generate(state, mockNouns, mockVerbs)).toBe('He watches tv.');
        });
    });
});
