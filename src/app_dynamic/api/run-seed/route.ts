import { NextResponse } from "next/server";
export const dynamic = "force-static";

import { PrismaSentenceDrillRepository } from "@/infrastructure/repositories/PrismaSentenceDrillRepository";
import { SentenceDrillSeedService } from "@/domain/practice/services/SentenceDrillSeedService";

export async function GET() {
  try {
    const repository = new PrismaSentenceDrillRepository();
    const service = new SentenceDrillSeedService(repository);
    const seededCount = await service.execute();

    return NextResponse.json({
      success: true,
      seededCount,
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
