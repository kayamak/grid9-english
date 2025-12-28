import { NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/prisma/client';

export async function GET() {
  try {
    // Fetch adverb words from database
    const adverbWords = await prisma.adverbWord.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return NextResponse.json(adverbWords);
  } catch (error) {
    console.error('Error fetching adverb words:', error);
    return NextResponse.json(
      { error: 'Failed to fetch adverb words' },
      { status: 500 }
    );
  }
}
