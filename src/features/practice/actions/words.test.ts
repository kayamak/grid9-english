import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getNounWords,
  getVerbWords,
  getAdjectiveWords,
  getAdverbWords,
} from './words';
import { PrismaWordRepository } from '@/infrastructure/repositories/PrismaWordRepository';

// Mock the module specifically
vi.mock('@/infrastructure/repositories/PrismaWordRepository', () => ({
  PrismaWordRepository: vi.fn(),
}));

describe('words actions', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRepo: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create method mocks
    mockRepo = {
      getNounWords: vi.fn(),
      getVerbWords: vi.fn(),
      getAdjectiveWords: vi.fn(),
      getAdverbWords: vi.fn(),
    };

    // When new PrismaWordRepository() is called, return mockRepo
    (
      PrismaWordRepository as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(function () {
      return mockRepo;
    });
  });

  it('getNounWords calls repository and maps to object', async () => {
    const mockWord = { toObject: () => ({ id: '1', value: 'cat' }) };
    mockRepo.getNounWords.mockResolvedValue([mockWord]);

    const result = await getNounWords();

    expect(mockRepo.getNounWords).toHaveBeenCalled();
    expect(result).toEqual([{ id: '1', value: 'cat' }]);
  });

  it('getVerbWords calls repository with arguments', async () => {
    const mockWord = { toObject: () => ({ id: '2', value: 'run' }) };
    mockRepo.getVerbWords.mockResolvedValue([mockWord]);

    const result = await getVerbWords('do', 'SV');

    expect(mockRepo.getVerbWords).toHaveBeenCalledWith('do', 'SV');
    expect(result).toEqual([{ id: '2', value: 'run' }]);
  });

  it('getAdjectiveWords calls repository', async () => {
    const mockWord = { toObject: () => ({ id: '3', value: 'happy' }) };
    mockRepo.getAdjectiveWords.mockResolvedValue([mockWord]);

    const result = await getAdjectiveWords();

    expect(mockRepo.getAdjectiveWords).toHaveBeenCalled();
    expect(result).toEqual([{ id: '3', value: 'happy' }]);
  });

  it('getAdverbWords calls repository', async () => {
    const mockWord = { toObject: () => ({ id: '4', value: 'fast' }) };
    mockRepo.getAdverbWords.mockResolvedValue([mockWord]);

    const result = await getAdverbWords();

    expect(mockRepo.getAdverbWords).toHaveBeenCalled();
    expect(result).toEqual([{ id: '4', value: 'fast' }]);
  });
});
