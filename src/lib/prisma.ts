import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

const globalForPrisma = global as unknown as { prisma_: PrismaClient };

const url = process.env.APP_ENV === 'staging' ? process.env.TURSO_DATABASE_URL : process.env.DATABASE_URL;
let prismaClient: PrismaClient;

if (url?.startsWith('file:')) {
  prismaClient = new PrismaClient({
    log: ['query'],
  });
} else {
  const adapter = new PrismaLibSQL({
    url: url!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  prismaClient = new PrismaClient({
    adapter,
    log: ['query'],
    datasources: adapter ? undefined : {
      db: {
        url,
      },
    },
  });
}

export const prisma = globalForPrisma.prisma_ || prismaClient;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_ = prisma;
