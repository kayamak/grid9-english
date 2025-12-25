import { prisma } from "@/infrastructure/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const patterns = await prisma.sentenceDrill.groupBy({
      by: ['sentencePattern'],
    });
    const drillsCount = await prisma.sentenceDrill.count();
    const svoSample = await prisma.sentenceDrill.findFirst({
        where: { sentencePattern: 'DO_SVO' }
    });
    
    return NextResponse.json({
      patterns: patterns.map(p => p.sentencePattern),
      drillsCount,
      svoSample,
      env: {
          APP_ENV: process.env.APP_ENV,
          DATABASE_URL_SET: !!process.env.DATABASE_URL,
          TURSO_DATABASE_URL_SET: !!process.env.TURSO_DATABASE_URL,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
