import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = global as unknown as { prisma_: PrismaClient };

import path from 'path';

const url_raw =
  process.env.APP_ENV === 'staging'
    ? process.env.TURSO_DATABASE_URL
    : process.env.DATABASE_URL || 'file:./dev.db';

let url = url_raw;
if (url?.startsWith('file:')) {
  const dbPath = url.replace('file:', '');
  const absolutePath = path.isAbsolute(dbPath)
    ? dbPath
    : path.join(process.cwd(), 'prisma', dbPath.replace(/^\.\//, ''));
  url = `file:${absolutePath}`;
}

let prismaClient: PrismaClient;

if (url?.startsWith('file:')) {
  prismaClient = new PrismaClient({
    datasources: {
      db: {
        url,
      },
    },
    log: ['query'],
  });
} else {
  const adapter = new PrismaLibSql({
    url: url!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  prismaClient = new PrismaClient({
    adapter,
    log: ['query'],
    datasources: adapter
      ? undefined
      : {
          db: {
            url,
          },
        },
  });
}

export const prisma = globalForPrisma.prisma_ || prismaClient;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_ = prisma;
