import { IWordRepository } from '../../domain/repositories/IWordRepository';
import { Word } from '../../domain/models/practice/types';

export class ApiWordRepository implements IWordRepository {
  async getNounWords(): Promise<Word[]> {
    const response = await fetch('/api/noun-words');
    if (!response.ok) {
      throw new Error('Failed to fetch noun words');
    }
    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      type: 'noun',
    }));
  }

  async getAdjectiveWords(): Promise<Word[]> {
    const response = await fetch('/api/adjective-words');
    if (!response.ok) {
      throw new Error('Failed to fetch adjective words');
    }
    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      type: 'adjective',
    }));
  }

  async getAdverbWords(): Promise<Word[]> {
    const response = await fetch('/api/adverb-words');
    if (!response.ok) {
      throw new Error('Failed to fetch adverb words');
    }
    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      type: 'adverb',
    }));
  }
}
