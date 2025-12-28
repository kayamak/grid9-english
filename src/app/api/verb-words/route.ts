import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/prisma/client';
import { VerbWord } from '@/types/verbWord';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const verbType = searchParams.get('verbType');
    const sentencePattern = searchParams.get('sentencePattern');

    // Build where clause and fetch
    let verbWords: VerbWord[];
    if (verbType === 'be') {
      const beVerbs = await prisma.beVerbWord.findMany({
        orderBy: {
          sortOrder: 'asc',
        },
      });
      // Normalize to match VerbWord type
      verbWords = beVerbs.map((v) => ({
        ...v,
        sentencePattern: null,
      }));
    } else if (verbType === 'do') {
      const doVerbs = await prisma.doVerbWord.findMany({
        where: sentencePattern ? { sentencePattern } : {},
        orderBy: {
          sortOrder: 'asc',
        },
      });
      verbWords = doVerbs;
    } else {
      // Fetch both and combined if verbType is not specified
      const beVerbs = await prisma.beVerbWord.findMany({
        orderBy: { sortOrder: 'asc' },
      });
      const doVerbs = await prisma.doVerbWord.findMany({
        orderBy: { sortOrder: 'asc' },
      });

      verbWords = [
        ...beVerbs.map((v) => ({
          ...v,
          sentencePattern: null,
        })),
        ...doVerbs,
      ].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
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

