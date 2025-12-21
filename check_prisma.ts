
import { prisma } from './src/lib/prisma';

async function main() {
  try {
    console.log('Checking prisma instance...');
    if (!prisma) {
      console.error('Prisma instance is undefined');
      return;
    }
    console.log('Prisma instance found.');
    
    if (prisma.verbWord) {
      console.log('prisma.verbWord is defined.');
    } else {
      console.error('prisma.verbWord is UNDEFINED. Available models:', Object.keys(prisma).filter(k => k !== '_' && !k.startsWith('$')));
    }
  } catch (e) {
    console.error('Error during check:', e);
  }
}

main();
