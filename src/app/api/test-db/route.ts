import { NextResponse } from 'next/server';
import { PrismaUserRepository } from '@/infrastructure/repositories/PrismaUserRepository';
import { PrismaSentenceDrillRepository } from '@/infrastructure/repositories/PrismaSentenceDrillRepository';
import { DatabaseDiagnosticsService } from '@/domain/shared/services/DatabaseDiagnosticsService';

export async function GET() {
  try {
    const userRepository = new PrismaUserRepository();
    // Not used for this specific method but required for service
    const sentenceDrillRepository = new PrismaSentenceDrillRepository();
    
    const service = new DatabaseDiagnosticsService(sentenceDrillRepository, userRepository);
    const result = await service.testConnection();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to connect to Turso database',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
