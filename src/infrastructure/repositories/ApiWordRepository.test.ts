import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiWordRepository } from './ApiWordRepository';

describe('ApiWordRepository', () => {
  let repository: ApiWordRepository;

  beforeEach(() => {
    repository = new ApiWordRepository();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('should fetch noun words', async () => {
    const mockData = [
      { id: '1', value: 'soccer', label: 'サッカー', numberForm: 'none' },
    ];
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const words = await repository.getNounWords();

    expect(fetch).toHaveBeenCalledWith('/api/noun-words');
    expect(words).toHaveLength(1);
    expect(words[0].value).toBe('soccer');
    expect(words[0].type).toBe('noun');
  });

  it('should throw error if fetch noun words fails', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
    } as Response);

    await expect(repository.getNounWords()).rejects.toThrow('Failed to fetch noun words');
  });

  it('should fetch verb words', async () => {
    const mockData = [
      { id: '2', value: 'play', label: '遊ぶ', pastForm: 'played' },
    ];
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const words = await repository.getVerbWords();

    expect(fetch).toHaveBeenCalledWith('/api/verb-words');
    expect(words[0].value).toBe('play');
    expect(words[0].type).toBe('verb');
  });
});
