import { IWordRepository } from '@/domain/shared/repositories/IWordRepository';
import { Word, WordType } from '@/domain/shared/entities/Word';

interface ApiWordResponse {
  id: string;
  value: string;
  label: string;
  numberForm?: string;
  pastForm?: string;
  thirdPersonForm?: string;
  adverb?: string;
  sortOrder?: number;
}

export class ApiWordRepository implements IWordRepository {
  async getNounWords(): Promise<Word[]> {
    const response = await fetch('/api/noun-words');
    if (!response.ok) {
      throw new Error('Failed to fetch noun words');
    }
    const data = await response.json();
    return data.map((item: ApiWordResponse) => Word.reconstruct({
      ...item,
      type: 'noun' as WordType,
    }));
  }

  async getVerbWords(): Promise<Word[]> {
    const response = await fetch('/api/verb-words');
    if (!response.ok) {
      throw new Error('Failed to fetch verb words');
    }
    const data = await response.json();
    return data.map((item: ApiWordResponse) => Word.reconstruct({
      ...item,
      type: 'verb' as WordType,
    }));
  }

  async getAdjectiveWords(): Promise<Word[]> {
    const response = await fetch('/api/adjective-words');
    if (!response.ok) {
      throw new Error('Failed to fetch adjective words');
    }
    const data = await response.json();
    return data.map((item: ApiWordResponse) => Word.reconstruct({
      ...item,
      type: 'adjective' as WordType,
    }));
  }

  async getAdverbWords(): Promise<Word[]> {
    const response = await fetch('/api/adverb-words');
    if (!response.ok) {
      throw new Error('Failed to fetch adverb words');
    }
    const data = await response.json();
    return data.map((item: ApiWordResponse) => Word.reconstruct({
      ...item,
      type: 'adverb' as WordType,
    }));
  }
}
