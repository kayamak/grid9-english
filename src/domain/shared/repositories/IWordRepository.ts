import { Word } from '../entities/Word';

export interface IWordRepository {
  getNounWords(): Promise<Word[]>;
  getVerbWords(): Promise<Word[]>;
  getAdjectiveWords(): Promise<Word[]>;
  getAdverbWords(): Promise<Word[]>;
}
