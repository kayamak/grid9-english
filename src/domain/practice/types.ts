import { Word } from '@/domain/shared/entities/Word';
import { SentencePattern } from './vo/SentencePattern';

export type VerbType = 'do' | 'be';
export type SentenceType = 'positive' | 'negative' | 'question';
export type Subject = 'first_s' | 'first_p' | 'second' | 'second_p' | 'third_s' | 'third_p';
export type Tense = 'past' | 'present' | 'future';
export type FiveSentencePattern = 'SV' | 'SVC' | 'SVO' | 'SVOO' | 'SVOC';
export type NumberForm = 'none' | 'a' | 'an' | 'plural' | 'the' | 'my' | 'our' | 'your' | 'his' | 'her' | 'their' | 'no_article' | 'adjective';

export interface IPattern {
  verbType: VerbType;
  verb: string;
  sentenceType: SentenceType;
  subject: Subject;
  tense: Tense;
  fiveSentencePattern?: FiveSentencePattern;
  object?: string;
  numberForm?: NumberForm;
  beComplement?: string;
}

export { Word, SentencePattern };

// Content types
export type Verb = string;
export type Object = string;
export type BeComplement = string;

// Alias for UI State (Migration path)
export type PracticeState = {
  verbType: VerbType;
  verb: Verb;
  sentenceType: SentenceType;
  subject: Subject;
  tense: Tense;
  fiveSentencePattern?: FiveSentencePattern;
  object?: Object;
  numberForm?: NumberForm;
  beComplement?: BeComplement;
};

