import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PracticeContainer as PracticeContent } from '@/features/practice/components/PracticeContainer';
import React from 'react';
import { useSearchParams } from 'next/navigation';

// Mock usages
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

// Mock ApiWordRepository as a class
vi.mock('@/infrastructure/repositories/ApiWordRepository', () => {
  return {
    ApiWordRepository: class {
      getNounWords = vi.fn().mockResolvedValue([
          { id: '1', value: 'apple', label: 'りんご', numberForm: 'a' },
          { id: '2', value: 'cat', label: 'ねこ', numberForm: 'a' }
      ]);
      getVerbWords = vi.fn().mockResolvedValue([
          { id: 'v1', value: 'play', label: 'あそぶ' },
          { id: 'v2', value: 'do', label: 'する' }
      ]);
      getAdjectiveWords = vi.fn().mockResolvedValue([
           { id: 'adj1', value: 'happy', label: 'しあわせ' }
      ]);
      getAdverbWords = vi.fn().mockResolvedValue([
           { id: 'adv1', value: 'well', label: 'よく' }
      ]);
    }
  };
});

vi.mock('@/features/practice/actions/drills', () => ({
  getSentenceDrills: vi.fn().mockResolvedValue([
    { id: 'd1', english: 'I play.', japanese: 'わたしはあそぶ', sentencePattern: 'DO_SV', sortOrder: 1 }
  ]),
  getDrillQuestQuestions: vi.fn().mockResolvedValue([
    { id: 'q1', english: 'I play.', japanese: 'わたしはあそぶ', sentencePattern: 'DO_SV', sortOrder: 1 }
  ]),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('PracticeContent', () => {
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSearchParams as unknown as Mock).mockReturnValue({
      get: mockGet,
    });
    mockGet.mockReturnValue(null);
    
    // Mock global fetch
    global.fetch = vi.fn((url) => {
        if (typeof url === 'string' && url.includes('/api/verb-words')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    { value: 'do', label: 'する' },
                    { value: 'play', label: 'あそぶ' }
                ]),
            });
        }
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
        });
    }) as unknown as typeof fetch;
  });

  const defaultInitialWords = {
    nouns: [],
    verbs: [],
    adjectives: [],
    adverbs: [],
  };

  const defaultAllDrills = [
    { id: 'd1', english: 'I play.', japanese: 'わたしはあそぶ', sentencePattern: 'DO_SV', sortOrder: 1 }
  ];

  afterEach(() => {
      vi.restoreAllMocks();
  });

  it('renders the title correctly', async () => {
    render(<PracticeContent initialWords={defaultInitialWords} allDrills={defaultAllDrills} />);
    expect(await screen.findByText('ぶんしょうトレーニング')).toBeDefined();
  });

  it('renders "Drill Quest" title when mode is quest', async () => {
    mockGet.mockImplementation((key) => {
      if (key === 'mode') return 'quest';
      return null;
    });
    render(<PracticeContent initialWords={defaultInitialWords} allDrills={defaultAllDrills} />);
    expect(await screen.findByText('ドリルクエスト')).toBeDefined();
  });

  it('renders NineKeyPanel in normal mode', async () => {
    render(<PracticeContent initialWords={defaultInitialWords} allDrills={defaultAllDrills} />);
    expect(await screen.findByText('しゅるい')).toBeDefined(); 
  });

  it('updates generated sentence when state changes', async () => {
    render(<PracticeContent initialWords={defaultInitialWords} allDrills={defaultAllDrills} />);
    
    // We expect "I do." initially
    expect(await screen.findByText('I do.')).toBeDefined();

    // Find the subject '1' button and click it to rotate to plural 'we'
    const subjectBtn = screen.getByText('1');
    fireEvent.click(subjectBtn);
    
    // Expect "We do."
    expect(await screen.findByText('We do.')).toBeDefined();
  });

  it('renders Drill Quest elements when in quest mode', async () => {
    // Re-mock useSearchParams for this test specifically
    (useSearchParams as unknown as Mock).mockReturnValue({
      get: (key: string) => {
         if (key === 'mode') return 'quest';
         return null;
      },
    });
    
    render(<PracticeContent initialWords={defaultInitialWords} allDrills={defaultAllDrills} />);

    // Shows Level info - Lv1 might be split or together. Use strict regex or partial.
    // HTML: Lv1
    expect(await screen.findByText(/Lv\s*\d+/)).toBeDefined();
    
    // Shows Timer
    expect(screen.getByText('30')).toBeDefined();
  });
});
