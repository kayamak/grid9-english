import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const verbType = searchParams.get('verbType');
    const sentencePattern = searchParams.get('sentencePattern');

    // Build where clause and fetch
    let verbWords;
    if (verbType === 'be') {
      const beVerbs = await prisma.beVerbWord.findMany({
        orderBy: {
          sortOrder: 'asc',
        },
      });
      // Normalize to match VerbWord type
      verbWords = beVerbs.map((v: { id: string; value: string; label: string; sortOrder: number }) => ({
        ...v,
        sentencePattern: null,
      }));
    } else if (verbType === 'do') {
      let doVerbs: any[];
      if (sentencePattern) {
        doVerbs = await (prisma as any).$queryRawUnsafe(
          `SELECT * FROM DoVerbWord WHERE sentencePattern = ? ORDER BY sortOrder ASC`,
          sentencePattern
        );
      } else {
        doVerbs = await (prisma as any).$queryRawUnsafe(
          `SELECT * FROM DoVerbWord ORDER BY sortOrder ASC`
        );
      }
      verbWords = doVerbs;
    } else {
      // Fetch both and combined if verbType is not specified
      const beVerbs = await prisma.beVerbWord.findMany({
        orderBy: { sortOrder: 'asc' },
      });
      const doVerbs: any[] = await (prisma as any).$queryRawUnsafe(
        `SELECT * FROM DoVerbWord ORDER BY sortOrder ASC`
      );

      verbWords = [
        ...beVerbs.map((v: any) => ({
          ...v,
          sentencePattern: null,
        })),
        ...doVerbs,
      ].sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }

    return NextResponse.json(verbWords);
  } catch (error) {
    console.error('Error fetching verb words:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verb words' },
      { status: 500 }
    );
  }
}
