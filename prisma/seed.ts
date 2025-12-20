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
  // VerbWord data is already seeded, skipping...
  // Uncomment below if you need to re-seed VerbWord data
  /*
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
    
    await prisma.verbWord.upsert({
      where: { value: `${verb.value}_SVO` }, // Use composite key to allow same verb in different patterns
      update: {},
      create: {
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
  */


  console.log('Seeding NounWord data...');

  // Noun Words - migrated from ObjectSelector.tsx
  const nounWords = [
    { value: 'something', label: 'something (何か)', numberForm: 'none', sortOrder: 1 },
    { value: 'dog', label: 'dog (犬)', numberForm: 'a', sortOrder: 2 },
    { value: 'dogs', label: 'dogs (犬)', numberForm: 'plural', sortOrder: 3 },
    { value: 'story', label: 'story (物語)', numberForm: 'a', sortOrder: 4 },
    { value: 'stories', label: 'stories (物語)', numberForm: 'plural', sortOrder: 5 },
    { value: 'soccer player', label: 'soccer player (サッカー選手)', numberForm: 'a', sortOrder: 6 },
    { value: 'soccer players', label: 'soccer players (サッカー選手)', numberForm: 'plural', sortOrder: 7 },
    { value: 'gold medal', label: 'gold medal (金メダル)', numberForm: 'a', sortOrder: 8 },
    { value: 'gold medals', label: 'gold medals (金メダル)', numberForm: 'plural', sortOrder: 9 },
    { value: 'passport', label: 'passport (パスポート)', numberForm: 'a', sortOrder: 10 },
    { value: 'passports', label: 'passports (パスポート)', numberForm: 'plural', sortOrder: 11 },
    { value: 'chair', label: 'chair (椅子)', numberForm: 'a', sortOrder: 12 },
    { value: 'chairs', label: 'chairs (椅子)', numberForm: 'plural', sortOrder: 13 },
    { value: 'butterfly', label: 'butterfly (蝶)', numberForm: 'a', sortOrder: 14 },
    { value: 'butterflies', label: 'butterflies (蝶)', numberForm: 'plural', sortOrder: 15 },
    { value: 'parents', label: 'parents (両親)', numberForm: 'plural', sortOrder: 16 },
    { value: 'fruit', label: 'fruit (果物)', numberForm: 'a', sortOrder: 17 },
    { value: 'fruits', label: 'fruits (果物)', numberForm: 'plural', sortOrder: 18 },
    { value: 'key', label: 'key (鍵)', numberForm: 'a', sortOrder: 19 },
    { value: 'keys', label: 'keys (鍵)', numberForm: 'plural', sortOrder: 20 },
    { value: 'taxi', label: 'taxi (タクシー)', numberForm: 'a', sortOrder: 21 },
    { value: 'taxis', label: 'taxis (タクシー)', numberForm: 'plural', sortOrder: 22 },
    { value: 'airplane', label: 'airplane (飛行機)', numberForm: 'an', sortOrder: 23 },
    { value: 'airplanes', label: 'airplanes (飛行機)', numberForm: 'plural', sortOrder: 24 },
    { value: 'sound', label: 'sound (音)', numberForm: 'a', sortOrder: 25 },
    { value: 'sounds', label: 'sounds (音)', numberForm: 'plural', sortOrder: 26 },
    { value: 'soccer', label: 'soccer (サッカー)', numberForm: 'none', sortOrder: 27 },
    { value: 'violin', label: 'violin (バイオリン)', numberForm: 'a', sortOrder: 28 },
    { value: 'violins', label: 'violins (バイオリン)', numberForm: 'plural', sortOrder: 29 },
    { value: 'song', label: 'song (歌)', numberForm: 'a', sortOrder: 30 },
    { value: 'songs', label: 'songs (歌)', numberForm: 'plural', sortOrder: 31 },
    { value: 'English', label: 'English (英語)', numberForm: 'none', sortOrder: 32 },
    { value: 'newspaper', label: 'newspaper (新聞)', numberForm: 'a', sortOrder: 33 },
    { value: 'newspapers', label: 'newspapers (新聞)', numberForm: 'plural', sortOrder: 34 },
    { value: 'letter', label: 'letter (手紙)', numberForm: 'a', sortOrder: 35 },
    { value: 'letters', label: 'letters (手紙)', numberForm: 'plural', sortOrder: 36 },
    { value: 'coffee', label: 'coffee (コーヒー)', numberForm: 'none', sortOrder: 37 },
    { value: 'pizza', label: 'pizza (ピザ)', numberForm: 'none', sortOrder: 38 },
    { value: 'pizza', label: 'pizza (ピザ)', numberForm: 'a', sortOrder: 39 },
    { value: 'pizzas', label: 'pizzas (ピザ)', numberForm: 'plural', sortOrder: 40 },
    { value: 'dinner', label: 'dinner (夕食)', numberForm: 'none', sortOrder: 41 },
    { value: 'car', label: 'car (車)', numberForm: 'a', sortOrder: 42 },
    { value: 'cars', label: 'cars (車)', numberForm: 'plural', sortOrder: 43 },
    { value: 'water', label: 'water (水)', numberForm: 'none', sortOrder: 44 },
    { value: 'music', label: 'music (音楽)', numberForm: 'none', sortOrder: 45 },
    { value: 'information', label: 'information (情報)', numberForm: 'none', sortOrder: 46 },
    { value: 'advice', label: 'advice (助言)', numberForm: 'none', sortOrder: 47 },
    { value: 'homework', label: 'homework (宿題)', numberForm: 'none', sortOrder: 48 },
  ];

  for (const noun of nounWords) {
    await prisma.nounWord.create({
      data: {
        value: noun.value,
        label: noun.label,
        numberForm: noun.numberForm,
        sortOrder: noun.sortOrder,
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
