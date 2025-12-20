import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const verbType = searchParams.get('verbType');
    const sentencePattern = searchParams.get('sentencePattern');

    // Build where clause
    const where: {
      verbType?: string;
      sentencePattern?: string | null;
    } = {};

    if (verbType) {
      where.verbType = verbType;
    }

    if (sentencePattern) {
      where.sentencePattern = sentencePattern;
    }

    // Fetch verb words from database
    const verbWords = await prisma.verbWord.findMany({
      where,
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return NextResponse.json(verbWords);
  } catch (error) {
    console.error('Error fetching verb words:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verb words' },
      { status: 500 }
    );
  }
}
