import { Word } from '../models/practice/Word';

export interface IWordRepository {
  getNounWords(): Promise<Word[]>;
  getVerbWords(): Promise<Word[]>;
  getAdjectiveWords(): Promise<Word[]>;
  getAdverbWords(): Promise<Word[]>;
}
