export interface VerbWord {
  id: string;
  value: string;
  label: string;
  sentencePattern: string | null;
  pastForm?: string | null;
  thirdPersonForm?: string | null;
  sortOrder: number;
}
