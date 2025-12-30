import { Word } from '../entities/Word';

export interface IWordRepository {
  getNounWords(): Promise<Word[]>;
  getVerbWords(type?: 'do' | 'be', pattern?: string): Promise<Word[]>;
  getAdjectiveWords(): Promise<Word[]>;
  getAdverbWords(): Promise<Word[]>;
}
