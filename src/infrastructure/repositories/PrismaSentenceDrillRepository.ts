import { ISentenceDrillRepository } from '@/domain/practice/repositories/ISentenceDrillRepository';
import { SentenceDrill } from '@/domain/practice/entities/SentenceDrill';
import { prisma } from '@/infrastructure/prisma/client';

export class PrismaSentenceDrillRepository implements ISentenceDrillRepository {
  async findAll(): Promise<SentenceDrill[]> {
    const data = await prisma.sentenceDrill.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return data.map(
      (d: {
        id: string;
        sentencePattern: string;
        english: string;
        japanese: string;
        sortOrder: number;
      }) =>
        SentenceDrill.reconstruct({
          id: d.id,
          sentencePattern: d.sentencePattern,
          english: d.english,
          japanese: d.japanese,
          sortOrder: d.sortOrder,
        })
    );
  }

  async findByPattern(pattern: string): Promise<SentenceDrill[]> {
    const data = await prisma.sentenceDrill.findMany({
      where: {
        sentencePattern: pattern,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return data.map(
      (d: {
        id: string;
        sentencePattern: string;
        english: string;
        japanese: string;
        sortOrder: number;
      }) =>
        SentenceDrill.reconstruct({
          id: d.id,
          sentencePattern: d.sentencePattern,
          english: d.english,
          japanese: d.japanese,
          sortOrder: d.sortOrder,
        })
    );
  }

  async findUniquePatterns(): Promise<string[]> {
    const data = await prisma.sentenceDrill.groupBy({
      by: ['sentencePattern'],
    });
    return data.map((d: { sentencePattern: string }) => d.sentencePattern);
  }

  async save(drill: SentenceDrill): Promise<void> {
    await prisma.sentenceDrill.upsert({
      where: { id: drill.id },
      update: {
        sentencePattern: drill.sentencePattern,
        english: drill.english,
        japanese: drill.japanese,
        sortOrder: drill.sortOrder,
      },
      create: {
        id: drill.id,
        sentencePattern: drill.sentencePattern,
        english: drill.english,
        japanese: drill.japanese,
        sortOrder: drill.sortOrder,
      },
    });
  }

  async count(): Promise<number> {
    return prisma.sentenceDrill.count();
  }
}
