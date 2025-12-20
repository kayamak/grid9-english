import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { config } from 'dotenv';

// Load environment variables
config();

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding VerbWord data...');

  // Do Verbs - SV Pattern (Intransitive)
  const doVerbSV = [
    { value: 'do', label: 'do (する)', sortOrder: 1 },
    { value: 'live', label: 'live (住む)', sortOrder: 2 },
    { value: 'go', label: 'go (行く)', sortOrder: 3 },
    { value: 'arrive', label: 'arrive (着く)', sortOrder: 4 },
    { value: 'talk', label: 'talk (話す)', sortOrder: 5 },
    { value: 'run', label: 'run (走る)', sortOrder: 6 },
    { value: 'walk', label: 'walk (歩く)', sortOrder: 7 },
    { value: 'smile', label: 'smile (笑う)', sortOrder: 8 },
    { value: 'laugh', label: 'laugh (笑う)', sortOrder: 9 },
  ];

  for (const verb of doVerbSV) {
    await prisma.verbWord.upsert({
      where: { value: verb.value },
      update: {},
      create: {
        value: verb.value,
        label: verb.label,
        verbType: 'do',
        sentencePattern: 'SV',
        sortOrder: verb.sortOrder,
      },
    });
  }

  // Do Verbs - SVO Pattern (Transitive)
  const doVerbSVO = [
    { value: 'do', label: 'do (する)', sortOrder: 1 },
    { value: 'have', label: 'have (持つ)', sortOrder: 2 },
    { value: 'know', label: 'know (知る)', sortOrder: 3 },
    { value: 'get', label: 'get (獲得する)', sortOrder: 4 },
    { value: 'make', label: 'make (作る)', sortOrder: 5 },
    { value: 'catch', label: 'catch (捕まえる)', sortOrder: 6 },
    { value: 'love', label: 'love (愛する)', sortOrder: 7 },
    { value: 'like', label: 'like (気に入る)', sortOrder: 8 },
    { value: 'take', label: 'take (取る、持っていく)', sortOrder: 9 },
    { value: 'see', label: 'see (見える)', sortOrder: 10 },
    { value: 'hear', label: 'hear (聞こえる)', sortOrder: 11 },
    { value: 'play', label: 'play (遊ぶ、演奏する)', sortOrder: 12 },
    { value: 'sing', label: 'sing (歌う)', sortOrder: 13 },
    { value: 'study', label: 'study (勉強する)', sortOrder: 14 },
    { value: 'teach', label: 'teach (教える)', sortOrder: 15 },
    { value: 'read', label: 'read (読む)', sortOrder: 16 },
    { value: 'write', label: 'write (書く)', sortOrder: 17 },
    { value: 'drink', label: 'drink (飲む)', sortOrder: 18 },
    { value: 'eat', label: 'eat (食べる)', sortOrder: 19 },
    { value: 'cook', label: 'cook (料理する)', sortOrder: 20 },
    { value: 'drive', label: 'drive (運転する)', sortOrder: 21 },
  ];

  for (const verb of doVerbSVO) {
    // Skip 'do' as it's already created in SV section
    if (verb.value === 'do') continue;
    
    await prisma.verbWord.create({
      data: {
        value: verb.value,
        label: verb.label,
        verbType: 'do',
        sentencePattern: 'SVO',
        sortOrder: verb.sortOrder,
      },
    });
  }

  // Be Verbs (Complements and Adjectives)
  const beVerbs = [
    { value: 'be', label: 'be (である)', sortOrder: 1 },
    { value: 'something', label: 'something (何か)', sortOrder: 2 },
    // Nouns
    { value: 'carpenter', label: 'carpenter (大工)', sortOrder: 3 },
    { value: 'hairdresser', label: 'hairdresser (美容師)', sortOrder: 4 },
    { value: 'nurse', label: 'nurse (看護師)', sortOrder: 5 },
    { value: 'teacher', label: 'teacher (先生)', sortOrder: 6 },
    { value: 'chef', label: 'chef (シェフ)', sortOrder: 7 },
    { value: 'farmer', label: 'farmer (農家)', sortOrder: 8 },
    { value: 'photographer', label: 'photographer (写真家)', sortOrder: 9 },
    // Adjectives
    { value: 'happy', label: 'happy (幸せ)', sortOrder: 10 },
    { value: 'sleepy', label: 'sleepy (眠い)', sortOrder: 11 },
    { value: 'angry', label: 'angry (怒った)', sortOrder: 12 },
    { value: 'tired', label: 'tired (疲れた)', sortOrder: 13 },
    { value: 'fine', label: 'fine (元気)', sortOrder: 14 },
  ];

  for (const verb of beVerbs) {
    await prisma.verbWord.upsert({
      where: { value: verb.value },
      update: {},
      create: {
        value: verb.value,
        label: verb.label,
        verbType: 'be',
        sentencePattern: null,
        sortOrder: verb.sortOrder,
      },
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
