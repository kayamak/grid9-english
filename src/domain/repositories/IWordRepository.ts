import { Word } from '../models/practice/types';

export interface IWordRepository {
  getNounWords(): Promise<Word[]>;
  getAdjectiveWords(): Promise<Word[]>;
  getAdverbWords(): Promise<Word[]>;
}
