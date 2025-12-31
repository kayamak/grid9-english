import { NextResponse } from "next/server";
export const dynamic = "force-static";

import { PrismaSentenceDrillRepository } from "@/infrastructure/repositories/PrismaSentenceDrillRepository";
import { PrismaUserRepository } from "@/infrastructure/repositories/PrismaUserRepository";
import { DatabaseDiagnosticsService } from "@/domain/shared/services/DatabaseDiagnosticsService";

export async function GET() {
  try {
    // Instantiate dependencies
    const sentenceDrillRepository = new PrismaSentenceDrillRepository();
    // We need user repo just to satisfy the service constructor, or we could make it optional
    // Ideally we should inject dependencies. Here we instantiate them.
    const userRepository = new PrismaUserRepository();
    
    const service = new DatabaseDiagnosticsService(sentenceDrillRepository, userRepository);
    const status = await service.checkCombinedStatus();
    
    return NextResponse.json(status);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

