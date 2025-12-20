import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Fetch adjective words from database
    const adjectiveWords = await prisma.adjectiveWord.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return NextResponse.json(adjectiveWords);
  } catch (error) {
    console.error('Error fetching adjective words:', error);
    return NextResponse.json(
      { error: 'Failed to fetch adjective words' },
      { status: 500 }
    );
  }
}
