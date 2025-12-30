import { IWordRepository } from '@/domain/shared/repositories/IWordRepository';
import { Word, WordType } from '@/domain/shared/entities/Word';
import { prisma } from '@/infrastructure/prisma/client';
import { DoVerbWord, BeVerbWord } from '@prisma/client';

export class PrismaWordRepository implements IWordRepository {
  async getNounWords(): Promise<Word[]> {
    const data = await prisma.nounWord.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return data.map((item) => Word.reconstruct({
      id: item.id,
      value: item.value,
      label: item.label,
      type: 'noun' as WordType,
      numberForm: item.numberForm,
      sortOrder: item.sortOrder,
    }));
  }

  async getVerbWords(type?: 'do' | 'be', pattern?: string): Promise<Word[]> {
    let beVerbs: BeVerbWord[] = [];
    let doVerbs: DoVerbWord[] = [];

    if (!type || type === 'be') {
      beVerbs = await prisma.beVerbWord.findMany({
        orderBy: { sortOrder: 'asc' },
      });
    }

    if (!type || type === 'do') {
      doVerbs = await prisma.doVerbWord.findMany({
        where: pattern ? { sentencePattern: pattern } : {},
        orderBy: { sortOrder: 'asc' },
      });
    }

    // Create a unified structure for mapping
    const combined = [
      ...beVerbs.map((v) => ({ ...v, type: 'verb' as WordType, pastForm: undefined, thirdPersonForm: undefined, adverb: undefined, sentencePattern: undefined })),
      ...doVerbs.map((v) => ({ ...v, type: 'verb' as WordType })),
    ].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    return combined.map((item) => Word.reconstruct({
      id: item.id,
      value: item.value,
      label: item.label,
      type: 'verb' as WordType,
      sortOrder: item.sortOrder,
      pastForm: item.pastForm || undefined,
      thirdPersonForm: item.thirdPersonForm || undefined,
      adverb: item.adverb || undefined,
      sentencePattern: item.sentencePattern || undefined,
    }));
  }

  async getAdjectiveWords(): Promise<Word[]> {
    const data = await prisma.adjectiveWord.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return data.map((item) => Word.reconstruct({
      id: item.id,
      value: item.value,
      label: item.label,
      type: 'adjective' as WordType,
      sortOrder: item.sortOrder,
    }));
  }

  async getAdverbWords(): Promise<Word[]> {
    const data = await prisma.adverbWord.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return data.map((item) => Word.reconstruct({
      id: item.id,
      value: item.value,
      label: item.label,
      type: 'adverb' as WordType,
      sortOrder: item.sortOrder,
    }));
  }
}
