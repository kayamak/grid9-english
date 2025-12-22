import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const numberForm = searchParams.get('numberForm');

    // Build where clause
    const where: {
      numberForm?: string;
    } = {};

    if (numberForm) {
      where.numberForm = numberForm;
    }

    // Fetch noun words from database
    const nounWords = await prisma.nounWord.findMany({
      where,
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return NextResponse.json(nounWords);
  } catch (error) {
    console.error('Error fetching noun words:', error);
    return NextResponse.json(
      { error: 'Failed to fetch noun words' },
      { status: 500 }
    );
  }
}
