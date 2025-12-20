import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection by querying users
    const users = await prisma.user.findMany({
      take: 5,
    });

    // Test database write capability
    const testUser = await prisma.user.findFirst({
      where: { id: 'test-connection' },
    });

    return NextResponse.json({
      success: true,
      message: 'Turso database connection successful!',
      data: {
        userCount: users.length,
        testUserExists: !!testUser,
        users: users.map(u => ({ id: u.id, name: u.name, type: u.type })),
      },
    });
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
