export type VerbType = 'do' | 'be';
export type SentenceType = 'positive' | 'negative' | 'question';
export type Subject = 'first_s' | 'first_p' | 'second' | 'second_p' | 'third_s' | 'third_p';
export type Tense = 'past' | 'present' | 'future';
export type FiveSentencePattern = 'SV' | 'SVC' | 'SVO' | 'SVOO' | 'SVOC';
export type NumberForm = 'none' | 'a' | 'an' | 'plural' | 'the' | 'my' | 'our' | 'your' | 'his' | 'her' | 'their' | 'no_article' | 'adjective';

// Content types are now dynamic, resolved from database
export type Verb = string;
export type Object = string;
export type BeComplement = string;

export interface PracticeState {
  verbType: VerbType;
  verb: Verb;
  sentenceType: SentenceType;
  subject: Subject;
  tense: Tense;
  fiveSentencePattern?: FiveSentencePattern; // Optional: only used for Do verbs and Be verbs
  object?: Object; // Optional: only used for SVO pattern
  numberForm?: NumberForm; // Optional: only used for SVO pattern
  beComplement?: BeComplement; // Optional: only used for Be verbs SV and SVC patterns
}
