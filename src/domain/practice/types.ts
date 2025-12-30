import { Word, WordProps } from '@/domain/shared/entities/Word';
import { SentencePattern } from './vo/SentencePattern';

export type VerbType = 'do' | 'be';
export type SentenceType = 'positive' | 'negative' | 'question';
export type Subject = 'first_s' | 'first_p' | 'second' | 'second_p' | 'third_s' | 'third_p';
export type Tense = 'past' | 'present' | 'future';
export type FiveSentencePattern = 'SV' | 'SVC' | 'SVO' | 'SVOO' | 'SVOC';
export type NumberForm = 'none' | 'a' | 'an' | 'plural' | 'the' | 'my' | 'our' | 'your' | 'his' | 'her' | 'their' | 'no_article' | 'adjective';

// Content types
export type Verb = string;
export type Object = string;
export type BeComplement = string;

export { Word, type WordProps, SentencePattern };

