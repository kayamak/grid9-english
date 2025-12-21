export interface VerbWord {
  id: string;
  value: string;
  label: string;
  verbType: string;
  sentencePattern: string | null;
  pastForm?: string | null;
  sortOrder: number;
}
