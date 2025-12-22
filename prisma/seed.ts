import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { config } from 'dotenv';

// Load environment variables
config();

import path from 'path';

const url_raw = process.env.DATABASE_URL!;
let url = url_raw;

if (url.startsWith('file:')) {
  const dbPath = url.replace('file:', '');
  const absolutePath = path.isAbsolute(dbPath)
    ? dbPath
    : path.join(process.cwd(), 'prisma', dbPath.replace(/^\.\//, ''));
  url = `file:${absolutePath}`;
}

let prisma: PrismaClient;

if (url.startsWith('file:')) {
  console.log(`Using local SQLite file: ${url}`);
  prisma = new PrismaClient({
    datasources: {
      db: {
        url,
      },
    },
  });
} else {
  console.log('Using LibSQL adapter (Turso)');
  const adapter = new PrismaLibSql({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  prisma = new PrismaClient({ adapter });
}

async function main() {
  // VerbWord data is already seeded, skipping...
  // Uncomment below if you need to re-seed VerbWord data
  console.log('Seeding VerbWord data...');

  // Do Verbs - SV Pattern (Intransitive)
  const doVerbSV = [
    { value: 'do', label: 'do (する)', sortOrder: 1, pastForm: 'did', thirdPersonForm: 'does' },
    { value: 'live', label: 'live (住む)', sortOrder: 2, pastForm: 'lived', thirdPersonForm: 'lives' },
    { value: 'go', label: 'go (行く)', sortOrder: 3, pastForm: 'went', thirdPersonForm: 'goes' },
    { value: 'arrive', label: 'arrive (着く)', sortOrder: 4, pastForm: 'arrived', thirdPersonForm: 'arrives' },
    { value: 'talk', label: 'talk (話す)', sortOrder: 5, pastForm: 'talked', thirdPersonForm: 'talks' },
    { value: 'run', label: 'run (走る)', sortOrder: 6, pastForm: 'ran', thirdPersonForm: 'runs' },
    { value: 'walk', label: 'walk (歩く)', sortOrder: 7, pastForm: 'walked', thirdPersonForm: 'walks' },
    { value: 'smile', label: 'smile (笑う)', sortOrder: 8, pastForm: 'smiled', thirdPersonForm: 'smiles' },
    { value: 'laugh', label: 'laugh (笑う)', sortOrder: 9, pastForm: 'laughed', thirdPersonForm: 'laughs' },
  ];

  for (const verb of doVerbSV) {
    await prisma.verbWord.upsert({
      where: { value: verb.value },
      update: {
        pastForm: verb.pastForm,
        thirdPersonForm: verb.thirdPersonForm,
      },
      create: {
        value: verb.value,
        label: verb.label,
        verbType: 'do',
        sentencePattern: 'SV',
        sortOrder: verb.sortOrder,
        pastForm: verb.pastForm,
        thirdPersonForm: verb.thirdPersonForm,
      },
    });
  }

  // Do Verbs - SVO Pattern (Transitive)
  const doVerbSVO = [
    { value: 'do', label: 'do (する)', sortOrder: 1, pastForm: 'did', thirdPersonForm: 'does' },
    { value: 'have', label: 'have (持つ)', sortOrder: 2, pastForm: 'had', thirdPersonForm: 'has' },
    { value: 'know', label: 'know (知る)', sortOrder: 3, pastForm: 'knew', thirdPersonForm: 'knows' },
    { value: 'get', label: 'get (獲得する)', sortOrder: 4, pastForm: 'got', thirdPersonForm: 'gets' },
    { value: 'make', label: 'make (作る)', sortOrder: 5, pastForm: 'made', thirdPersonForm: 'makes' },
    { value: 'catch', label: 'catch (捕まえる)', sortOrder: 6, pastForm: 'caught', thirdPersonForm: 'catches' },
    { value: 'love', label: 'love (愛する)', sortOrder: 7, pastForm: 'loved', thirdPersonForm: 'loves' },
    { value: 'like', label: 'like (気に入る)', sortOrder: 8, pastForm: 'liked', thirdPersonForm: 'likes' },
    { value: 'take', label: 'take (取る、持っていく)', sortOrder: 9, pastForm: 'took', thirdPersonForm: 'takes' },
    { value: 'see', label: 'see (見える)', sortOrder: 10, pastForm: 'saw', thirdPersonForm: 'sees' },
    { value: 'hear', label: 'hear (聞こえる)', sortOrder: 11, pastForm: 'heard', thirdPersonForm: 'hears' },
    { value: 'play', label: 'play (遊ぶ、演奏する)', sortOrder: 12, pastForm: 'played', thirdPersonForm: 'plays' },
    { value: 'sing', label: 'sing (歌う)', sortOrder: 13, pastForm: 'sang', thirdPersonForm: 'sings' },
    { value: 'study', label: 'study (勉強する)', sortOrder: 14, pastForm: 'studied', thirdPersonForm: 'studies' },
    { value: 'teach', label: 'teach (教える)', sortOrder: 15, pastForm: 'taught', thirdPersonForm: 'teaches' },
    { value: 'read', label: 'read (読む)', sortOrder: 16, pastForm: 'read', thirdPersonForm: 'reads' },
    { value: 'write', label: 'write (書く)', sortOrder: 17, pastForm: 'wrote', thirdPersonForm: 'writes' },
    { value: 'drink', label: 'drink (飲む)', sortOrder: 18, pastForm: 'drank', thirdPersonForm: 'drinks' },
    { value: 'eat', label: 'eat (食べる)', sortOrder: 19, pastForm: 'ate', thirdPersonForm: 'eats' },
    { value: 'cook', label: 'cook (料理する)', sortOrder: 20, pastForm: 'cooked', thirdPersonForm: 'cooks' },
    { value: 'drive', label: 'drive (運転する)', sortOrder: 21, pastForm: 'drove', thirdPersonForm: 'drives' },
  ];

  for (const verb of doVerbSVO) {
    // Skip 'do' as it's already created in SV section
    if (verb.value === 'do') continue;
    
    await prisma.verbWord.upsert({
      where: { value: verb.value },
      update: {
        pastForm: verb.pastForm,
        thirdPersonForm: verb.thirdPersonForm,
      },
      create: {
        value: verb.value,
        label: verb.label,
        verbType: 'do',
        sentencePattern: 'SVO',
        sortOrder: verb.sortOrder,
        pastForm: verb.pastForm,
        thirdPersonForm: verb.thirdPersonForm,
      },
    });
  }

  // Be Verbs (Complements - Nouns only)
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
    // Occupations (for Be verb complements)
    { value: 'carpenter', label: 'carpenter (大工)', numberForm: 'a', sortOrder: 49 },
    { value: 'hairdresser', label: 'hairdresser (美容師)', numberForm: 'a', sortOrder: 50 },
    { value: 'nurse', label: 'nurse (看護師)', numberForm: 'a', sortOrder: 51 },
    { value: 'teacher', label: 'teacher (先生)', numberForm: 'a', sortOrder: 52 },
    { value: 'chef', label: 'chef (シェフ)', numberForm: 'a', sortOrder: 53 },
    { value: 'farmer', label: 'farmer (農家)', numberForm: 'a', sortOrder: 54 },
    { value: 'photographer', label: 'photographer (写真家)', numberForm: 'a', sortOrder: 55 },
  ];

  for (const noun of nounWords) {
    await prisma.nounWord.upsert({
      where: { value: noun.value },
      update: {
        label: noun.label,
        numberForm: noun.numberForm,
        sortOrder: noun.sortOrder,
      },
      create: {
        value: noun.value,
        label: noun.label,
        numberForm: noun.numberForm,
        sortOrder: noun.sortOrder,
      },
    });
  }

  console.log('Seeding AdjectiveWord data...');

  // Adjective Words - migrated from Be verb complements
  const adjectiveWords = [
    { value: 'happy', label: 'happy (幸せ)', sortOrder: 1 },
    { value: 'sleepy', label: 'sleepy (眠い)', sortOrder: 2 },
    { value: 'angry', label: 'angry (怒った)', sortOrder: 3 },
    { value: 'tired', label: 'tired (疲れた)', sortOrder: 4 },
    { value: 'fine', label: 'fine (元気)', sortOrder: 5 },
  ];

  for (const adjective of adjectiveWords) {
    await prisma.adjectiveWord.upsert({
      where: { value: adjective.value },
      update: {
        label: adjective.label,
        sortOrder: adjective.sortOrder,
      },
      create: {
        value: adjective.value,
        label: adjective.label,
        sortOrder: adjective.sortOrder,
      },
    });
  }

  console.log('Seeding AdverbWord data...');

  // Adverb Words - migrated from SV pattern location/state options
  const adverbWords = [
    { value: 'here', label: 'here (ここに)', sortOrder: 1 },
    { value: 'there', label: 'there (そこに)', sortOrder: 2 },
    { value: 'at home', label: 'at home (家に)', sortOrder: 3 },
    { value: 'at school', label: 'at school (学校に)', sortOrder: 4 },
    { value: 'in the park', label: 'in the park (公園に)', sortOrder: 5 },
    { value: 'in Tokyo', label: 'in Tokyo (東京に)', sortOrder: 6 },
    { value: 'upstairs', label: 'upstairs (上の階に)', sortOrder: 7 },
    { value: 'downstairs', label: 'downstairs (下の階に)', sortOrder: 8 },
  ];

  for (const adverb of adverbWords) {
    await prisma.adverbWord.upsert({
      where: { value: adverb.value },
      update: {
        label: adverb.label,
        sortOrder: adverb.sortOrder,
      },
      create: {
        value: adverb.value,
        label: adverb.label,
        sortOrder: adverb.sortOrder,
      },
    });
  }

  console.log('Seeding SentenceDrill data...');

  const sentenceDrills = [
    { english: 'You live.', japanese: 'あなたは住んでいます。', sortOrder: 1 },
    { english: 'I ran.', japanese: '私は走りました。', sortOrder: 2 },
    { english: 'They won\'t laugh.', japanese: '彼らは笑わないでしょう。', sortOrder: 3 },
    { english: 'I didn\'t smile', japanese: '私は微笑みませんでした。', sortOrder: 4 },
    { english: 'Will he live?', japanese: '彼は住むでしょうか？', sortOrder: 5 },
    { english: 'Do we arrive?', japanese: '私たちは到着しますか？', sortOrder: 6 },
    { english: 'He walks.', japanese: '彼は歩きます。', sortOrder: 7 },
    { english: 'You won\'t go.', japanese: 'あなたは行かないでしょう。', sortOrder: 8 },
    { english: 'Did you talk?', japanese: 'あなたたちは話しましたか？', sortOrder: 9 },
    { english: 'You don\'t run.', japanese: 'あなたは走りません。', sortOrder: 10 },
    { english: 'They will arrive.', japanese: '彼らは到着するでしょう。', sortOrder: 11 },
    { english: 'Did I laugh?', japanese: '私は笑いましたか？', sortOrder: 12 },
    { english: 'Does he talk?', japanese: '彼は会話しますか？', sortOrder: 13 },
    { english: 'We walk.', japanese: '私たちは歩きます。', sortOrder: 14 },
  ];

  for (const drill of sentenceDrills) {
    await prisma.sentenceDrill.upsert({
      where: { id: `drill-${drill.sortOrder}` },
      update: {
        english: drill.english,
        japanese: drill.japanese,
        sortOrder: drill.sortOrder,
      },
      create: {
        id: `drill-${drill.sortOrder}`,
        english: drill.english,
        japanese: drill.japanese,
        sortOrder: drill.sortOrder,
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
