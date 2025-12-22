import { ISentenceDrillRepository } from "@/domain/practice/repositories/ISentenceDrillRepository";
import { SentenceDrill } from "@/domain/practice/entities/SentenceDrill";
import { prisma } from "@/infrastructure/prisma/client";

export class PrismaSentenceDrillRepository implements ISentenceDrillRepository {
  async findAll(): Promise<SentenceDrill[]> {
    const data = await prisma.sentenceDrill.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return data.map((d: { id: string; sentencePattern: string; english: string; japanese: string; sortOrder: number }) =>
      SentenceDrill.reconstruct({
        id: d.id,
        sentencePattern: d.sentencePattern,
        english: d.english,
        japanese: d.japanese,
        sortOrder: d.sortOrder,
      })
    );
  }
}
