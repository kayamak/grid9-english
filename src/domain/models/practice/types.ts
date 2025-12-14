export type VerbType = 'do' | 'be';
export type SentenceType = 'positive' | 'negative' | 'question';
export type Subject = 'first_s' | 'first_p' | 'second' | 'third_s' | 'third_p';
export type Tense = 'past' | 'present' | 'future';

export type Verb = 'be' | 'do' | 'live' | 'go' | 'arrive' | 'talk' | 'run' | 'walk' | 'smile' | 'laugh';

export interface PracticeState {
  verbType: VerbType;
  verb: Verb;
  sentenceType: SentenceType;
  subject: Subject;
  tense: Tense;
}
