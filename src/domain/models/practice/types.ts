export type VerbType = 'do' | 'be';
export type SentenceType = 'positive' | 'negative' | 'question';
export type Subject = 'first_s' | 'first_p' | 'second' | 'second_p' | 'third_s' | 'third_p';
export type Tense = 'past' | 'present' | 'future';
export type FiveSentencePattern = 'SV' | 'SVC' | 'SVO' | 'SVOO' | 'SVOC';

export type Verb = 
  | 'be' | 'do' // Defaults
  | 'live' | 'go' | 'arrive' | 'talk' | 'run' | 'walk' | 'smile' | 'laugh' // Do verbs
  | 'something' | 'carpenter' | 'hairdresser' | 'nurse' | 'teacher' | 'chef' | 'farmer' | 'photographer' // Be Nouns
  | 'happy' | 'sleepy' | 'angry' | 'tired' | 'fine'; // Be Adjectives

export interface PracticeState {
  verbType: VerbType;
  verb: Verb;
  sentenceType: SentenceType;
  subject: Subject;
  tense: Tense;
  fiveSentencePattern?: FiveSentencePattern; // Optional: only used for Do verbs
}
