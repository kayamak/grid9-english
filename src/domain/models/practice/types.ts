export type VerbType = 'do' | 'be';
export type SentenceType = 'positive' | 'negative' | 'question';
export type Subject = 'first_s' | 'first_p' | 'second' | 'second_p' | 'third_s' | 'third_p';
export type Tense = 'past' | 'present' | 'future';
export type FiveSentencePattern = 'SV' | 'SVC' | 'SVO' | 'SVOO' | 'SVOC';
export type NumberForm = 'singular' | 'plural';

export type Verb = 
  | 'be' | 'do' // Defaults
  | 'live' | 'go' | 'arrive' | 'talk' | 'run' | 'walk' | 'smile' | 'laugh' // Do verbs (SV - intransitive)
  | 'have' | 'know' | 'get' | 'make' | 'catch' | 'love' | 'like' | 'take' | 'see' // Do verbs (SVO - transitive)
  | 'play' | 'sing' | 'study' | 'teach' | 'read' | 'write' | 'drink' | 'eat' | 'cook' | 'drive' // Do verbs (SVO - transitive, continued)
  | 'something' | 'carpenter' | 'hairdresser' | 'nurse' | 'teacher' | 'chef' | 'farmer' | 'photographer' // Be Nouns
  | 'happy' | 'sleepy' | 'angry' | 'tired' | 'fine'; // Be Adjectives

export type Object = 
  | 'something' | 'dog' | 'dogs' | 'story' | 'stories' | 'soccer player' | 'soccer players' 
  | 'gold medal' | 'gold medals' | 'passport' | 'passports' | 'chair' | 'chairs' 
  | 'butterfly' | 'butterflies' | 'parents' | 'fruit' | 'fruits' | 'key' | 'keys' 
  | 'taxi' | 'taxis' | 'airplay' | 'airplays' | 'sound' | 'sounds' | 'soccker' 
  | 'violin' | 'violins' | 'song' | 'songs' | 'English' | 'newspaper' | 'newspapers' 
  | 'letter' | 'letters' | 'coffee' | 'pizza' | 'pizzas' | 'dinner' | 'dinners' 
  | 'car' | 'cars';

export interface PracticeState {
  verbType: VerbType;
  verb: Verb;
  sentenceType: SentenceType;
  subject: Subject;
  tense: Tense;
  fiveSentencePattern?: FiveSentencePattern; // Optional: only used for Do verbs
  object?: Object; // Optional: only used for SVO pattern
  numberForm?: NumberForm; // Optional: only used for SVO pattern
}
