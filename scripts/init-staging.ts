import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { config } from 'dotenv';
import { execSync } from 'child_process';

// Load environment variables
config();

const authToken = process.env.TURSO_AUTH_TOKEN;
let url = process.env.DATABASE_URL;

// Since this is 'init-staging', prefer the Turso URL if configured
if (process.env.TURSO_DATABASE_URL) {
    url = process.env.TURSO_DATABASE_URL;
}

if (!url) {
    console.error('DATABASE_URL or TURSO_DATABASE_URL is not set.');
    process.exit(1);
}

// 1. Generate the SQL script using prisma migrate diff
// We diff against 'empty' to get the full CREATE ddl.
// Note: This approach is primarily for Initialization. 
// For structural updates (migrations), a more complex diff strategy against the actual DB is needed,
// but currently Prisma CLI has trouble connecting to libsql:// URLs directly with the sqlite provider.
console.log('Generating schema SQL...');
let sqlContent = '';
try {
    sqlContent = execSync(
        'npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script',
        { encoding: 'utf-8' }
    );
} catch (e) {
    console.error('Failed to generate SQL schema:', e);
    process.exit(1);
}

// 2. Initialize Prisma Client
let prisma: PrismaClient;

if (url.startsWith('file:')) {
    console.log('Using local SQLite file.');
    prisma = new PrismaClient({ datasources: { db: { url } } });
} else {
    console.log('Using LibSQL adapter (Turso).');
    const adapter = new PrismaLibSql({
        url,
        authToken,
    });
    prisma = new PrismaClient({ adapter });
}

// 3. Execute the SQL
async function main() {
    const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    console.log(`Found ${statements.length} statements to execute.`);

    for (const statement of statements) {
        try {
            await prisma.$executeRawUnsafe(statement);
        } catch (e: any) {
            // Ignore "Table already exists" or "Index already exists" errors to make this script idempotent-ish for initialization
            if (e.message && (e.message.includes('already exists'))) {
                // Formatting statement for log to avoid clutter
                const summary = statement.split('\n')[0].substring(0, 50);
                console.log(`Skipping (already exists): ${summary}...`);
            } else {
                console.error(`Failed to execute: ${statement.substring(0, 50)}...`, e);
            }
        }
    }
    console.log('Schema initialization completed.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
