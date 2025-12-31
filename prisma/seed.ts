import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { config } from 'dotenv';

// Load environment variables
config();

import path from 'path';

const url_raw = process.env.LOCAL_DATABASE_URL!;
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
    { value: 'do', label: 'do (する)', sortOrder: 1, pastForm: 'did', thirdPersonForm: 'does', adverb: 'well' },
    { value: 'live', label: 'live (住む)', sortOrder: 2, pastForm: 'lived', thirdPersonForm: 'lives', adverb: 'here' },
    { value: 'go', label: 'go (行く)', sortOrder: 3, pastForm: 'went', thirdPersonForm: 'goes', adverb: 'there' },
    { value: 'arrive', label: 'arrive (着く)', sortOrder: 4, pastForm: 'arrived', thirdPersonForm: 'arrives', adverb: 'late' },
    { value: 'talk', label: 'talk (話す)', sortOrder: 5, pastForm: 'talked', thirdPersonForm: 'talks', adverb: 'loudly' },
    { value: 'run', label: 'run (走る)', sortOrder: 6, pastForm: 'ran', thirdPersonForm: 'runs', adverb: 'fast' },
    { value: 'walk', label: 'walk (歩く)', sortOrder: 7, pastForm: 'walked', thirdPersonForm: 'walks', adverb: 'slowly' },
    { value: 'smile', label: 'smile (笑う)', sortOrder: 8, pastForm: 'smiled', thirdPersonForm: 'smiles', adverb: 'happily' },
    { value: 'laugh', label: 'laugh (笑う)', sortOrder: 9, pastForm: 'laughed', thirdPersonForm: 'laughs', adverb: 'loudly' },
  ];

  for (const verb of doVerbSV) {
    await prisma.doVerbWord.upsert({
      where: { value: verb.value },
      update: {
        pastForm: verb.pastForm,
        thirdPersonForm: verb.thirdPersonForm,
      },
      create: {
        value: verb.value,
        label: verb.label,
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
    { value: 'drive', label: 'ride (乗る)', sortOrder: 21, pastForm: 'rode', thirdPersonForm: 'rides' },
  ];

  for (const verb of doVerbSVO) {
    // Skip 'do' as it's already created in SV section
    if (verb.value === 'do') continue;
    
    await prisma.doVerbWord.upsert({
      where: { value: verb.value },
      update: {
        pastForm: verb.pastForm,
        thirdPersonForm: verb.thirdPersonForm,
      },
      create: {
        value: verb.value,
        label: verb.label,
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
    // RPG Jobs
    { value: 'warrior', label: 'warrior (戦士)', sortOrder: 3 },
    { value: 'mage', label: 'mage (魔法使い)', sortOrder: 4 },
    { value: 'cleric', label: 'cleric (僧侶)', sortOrder: 5 },
    { value: 'sage', label: 'sage (賢者)', sortOrder: 6 },
    { value: 'merchant', label: 'merchant (商人)', sortOrder: 7 },
    { value: 'villager', label: 'villager (村人)', sortOrder: 8 },
    { value: 'thief', label: 'thief (盗賊)', sortOrder: 9 },
  ];

  for (const verb of beVerbs) {
    await prisma.beVerbWord.upsert({
      where: { value: verb.value },
      update: {},
      create: {
        value: verb.value,
        label: verb.label,
        sortOrder: verb.sortOrder,
      },
    });
  }


  console.log('Seeding NounWord data...');

  // Noun Words - RPG Themed
  const nounWords = [
    { value: 'something', label: 'something (何か)', numberForm: 'none', sortOrder: 1 },
    { value: 'wolf', label: 'wolf (オオカミ)', numberForm: 'a', sortOrder: 2 },
    { value: 'wolves', label: 'wolves (オオカミ)', numberForm: 'plural', sortOrder: 3 },
    { value: 'legend', label: 'legend (伝説)', numberForm: 'a', sortOrder: 4 },
    { value: 'legends', label: 'legends (伝説)', numberForm: 'plural', sortOrder: 5 },
    { value: 'hero', label: 'hero (勇者)', numberForm: 'a', sortOrder: 6 },
    { value: 'heroes', label: 'heroes (勇者)', numberForm: 'plural', sortOrder: 7 },
    { value: 'treasure', label: 'treasure (財宝)', numberForm: 'a', sortOrder: 8 },
    { value: 'treasures', label: 'treasures (財宝)', numberForm: 'plural', sortOrder: 9 },
    { value: 'parchment', label: 'parchment (羊皮紙)', numberForm: 'a', sortOrder: 10 },
    { value: 'parchments', label: 'parchments (羊皮紙)', numberForm: 'plural', sortOrder: 11 },
    { value: 'throne', label: 'throne (玉座)', numberForm: 'a', sortOrder: 12 },
    { value: 'thrones', label: 'thrones (玉座)', numberForm: 'plural', sortOrder: 13 },
    { value: 'fairy', label: 'fairy (妖精)', numberForm: 'a', sortOrder: 14 },
    { value: 'fairies', label: 'fairies (妖精)', numberForm: 'plural', sortOrder: 15 },
    { value: 'ancestors', label: 'ancestors (先祖)', numberForm: 'plural', sortOrder: 16 },
    { value: 'herb', label: 'herb (薬草)', numberForm: 'a', sortOrder: 17 },
    { value: 'herbs', label: 'herbs (薬草)', numberForm: 'plural', sortOrder: 18 },
    { value: 'key', label: 'key (鍵)', numberForm: 'a', sortOrder: 19 },
    { value: 'keys', label: 'keys (鍵)', numberForm: 'plural', sortOrder: 20 },
    { value: 'wagon', label: 'wagon (馬車)', numberForm: 'a', sortOrder: 21 },
    { value: 'wagons', label: 'wagons (馬車)', numberForm: 'plural', sortOrder: 22 },
    { value: 'dragon', label: 'dragon (ドラゴン)', numberForm: 'a', sortOrder: 23 },
    { value: 'dragons', label: 'dragons (ドラゴン)', numberForm: 'plural', sortOrder: 24 },
    { value: 'sound', label: 'sound (音)', numberForm: 'a', sortOrder: 25 },
    { value: 'sounds', label: 'sounds (音)', numberForm: 'plural', sortOrder: 26 },
    { value: 'swordplay', label: 'swordplay (剣術)', numberForm: 'none', sortOrder: 27 },
    { value: 'lute', label: 'lute (リュート)', numberForm: 'a', sortOrder: 28 },
    { value: 'lutes', label: 'lutes (リュート)', numberForm: 'plural', sortOrder: 29 },
    { value: 'song', label: 'song (歌)', numberForm: 'a', sortOrder: 30 },
    { value: 'songs', label: 'songs (歌)', numberForm: 'plural', sortOrder: 31 },
    { value: 'magic', label: 'magic (魔法)', numberForm: 'none', sortOrder: 32 },
    { value: 'scroll', label: 'scroll (巻物)', numberForm: 'a', sortOrder: 33 },
    { value: 'scrolls', label: 'scrolls (巻物)', numberForm: 'plural', sortOrder: 34 },
    { value: 'letter', label: 'letter (手紙)', numberForm: 'a', sortOrder: 35 },
    { value: 'letters', label: 'letters (手紙)', numberForm: 'plural', sortOrder: 36 },
    { value: 'potion', label: 'potion (ポーション)', numberForm: 'none', sortOrder: 37 },
    { value: 'bread', label: 'bread (パン)', numberForm: 'none', sortOrder: 38 },
    { value: 'meat', label: 'meat (肉)', numberForm: 'none', sortOrder: 39 },
    { value: 'meats', label: 'meats (肉)', numberForm: 'plural', sortOrder: 40 },
    { value: 'feast', label: 'feast (宴)', numberForm: 'none', sortOrder: 41 },
    { value: 'horse', label: 'horse (馬)', numberForm: 'a', sortOrder: 42 },
    { value: 'horses', label: 'horses (馬)', numberForm: 'plural', sortOrder: 43 },
    { value: 'water', label: 'water (水)', numberForm: 'none', sortOrder: 44 },
    { value: 'music', label: 'music (音楽)', numberForm: 'none', sortOrder: 45 },
    { value: 'information', label: 'information (情報)', numberForm: 'none', sortOrder: 46 },
    { value: 'advice', label: 'advice (助言)', numberForm: 'none', sortOrder: 47 },
    { value: 'knowledge', label: 'knowledge (知識)', numberForm: 'none', sortOrder: 48 },
    // Jobs
    { value: 'warrior', label: 'warrior (戦士)', numberForm: 'a', sortOrder: 49 },
    { value: 'warriors', label: 'warriors (戦士)', numberForm: 'plural', sortOrder: 50 },
    { value: 'mage', label: 'mage (魔法使い)', numberForm: 'a', sortOrder: 51 },
    { value: 'mages', label: 'mages (魔法使い)', numberForm: 'plural', sortOrder: 52 },
    { value: 'cleric', label: 'cleric (僧侶)', numberForm: 'a', sortOrder: 53 },
    { value: 'clerics', label: 'clerics (僧侶)', numberForm: 'plural', sortOrder: 54 },
    { value: 'sage', label: 'sage (賢者)', numberForm: 'a', sortOrder: 55 },
    { value: 'sages', label: 'sages (賢者)', numberForm: 'plural', sortOrder: 56 },
    { value: 'merchant', label: 'merchant (商人)', numberForm: 'a', sortOrder: 57 },
    { value: 'merchants', label: 'merchants (商人)', numberForm: 'plural', sortOrder: 58 },
    { value: 'villager', label: 'villager (村人)', numberForm: 'a', sortOrder: 59 },
    { value: 'villagers', label: 'villagers (村人)', numberForm: 'plural', sortOrder: 60 },
    { value: 'thief', label: 'thief (盗賊)', numberForm: 'a', sortOrder: 61 },
    { value: 'thieves', label: 'thieves (盗賊)', numberForm: 'plural', sortOrder: 62 },
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
    { value: 'angry', label: 'angry (怒った)', sortOrder: 1 },
    { value: 'fine', label: 'fine (元気)', sortOrder: 2 },
    { value: 'happy', label: 'happy (幸せ)', sortOrder: 3 },
    { value: 'sad', label: 'sad (悲しい)', sortOrder: 4 },
    { value: 'sleepy', label: 'sleepy (眠い)', sortOrder: 5 },
    { value: 'tired', label: 'tired (疲れた)', sortOrder: 6 },
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

  // Adverb Words - RPG Themed Locations
  const adverbWords = [
    { value: 'here', label: 'here (ここに)', sortOrder: 1 },
    { value: 'there', label: 'there (そこに)', sortOrder: 2 },
    { value: 'in the castle', label: 'in the castle (城に)', sortOrder: 3 },
    { value: 'in the village', label: 'in the village (村に)', sortOrder: 4 },
    { value: 'in the forest', label: 'in the forest (森に)', sortOrder: 5 },
    { value: 'in the cave', label: 'in the cave (洞窟に)', sortOrder: 6 },
    { value: 'at the inn', label: 'at the inn (宿屋に)', sortOrder: 7 },
    { value: 'at the shop', label: 'at the shop (店に)', sortOrder: 8 },
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
    // DO_SV
    { sentencePattern: 'DO_SV', english: 'You live here.', japanese: 'あなたはここに住んでいます。', sortOrder: 1 },
    { sentencePattern: 'DO_SV', english: 'I ran fast.', japanese: '私は速く走りました。', sortOrder: 2 },
    { sentencePattern: 'DO_SV', english: 'They won\'t laugh loudly.', japanese: '彼らは大声で笑わないでしょう。', sortOrder: 3 },
    { sentencePattern: 'DO_SV', english: 'I didn\'t smile happily.', japanese: '私は幸せそうに微笑みませんでした。', sortOrder: 4 },
    { sentencePattern: 'DO_SV', english: 'Will he live here?', japanese: '彼はここに住むでしょうか？', sortOrder: 5 },
    { sentencePattern: 'DO_SV', english: 'Do we arrive late?', japanese: '私たちは遅れて到着しますか？', sortOrder: 6 },
    { sentencePattern: 'DO_SV', english: 'He walks slowly.', japanese: '彼はゆっくり歩きます。', sortOrder: 7 },
    { sentencePattern: 'DO_SV', english: 'You won\'t go there.', japanese: 'あなたはそこに行かないでしょう。', sortOrder: 8 },
    { sentencePattern: 'DO_SV', english: 'Did you talk loudly?', japanese: 'あなたたちは大声で話しましたか？', sortOrder: 9 },
    { sentencePattern: 'DO_SV', english: 'You don\'t run fast.', japanese: 'あなたは速く走りません。', sortOrder: 10 },
    { sentencePattern: 'DO_SV', english: 'They will arrive late.', japanese: '彼らは遅れて到着するでしょう。', sortOrder: 11 },
    { sentencePattern: 'DO_SV', english: 'Did I laugh loudly?', japanese: '私は大声で笑いましたか？', sortOrder: 12 },
    { sentencePattern: 'DO_SV', english: 'Does he talk loudly?', japanese: '彼は大声で話しますか？', sortOrder: 13 },
    { sentencePattern: 'DO_SV', english: 'We walk slowly.', japanese: '私たちはゆっくり歩きます。', sortOrder: 14 },
    // BE_SVC
    { sentencePattern: 'BE_SVC', english: 'I was a warrior.', japanese: '私は戦士でした。', sortOrder: 15 },
    { sentencePattern: 'BE_SVC', english: 'I will be a mage.', japanese: '私は魔法使いになるつもりです。', sortOrder: 16 },
    { sentencePattern: 'BE_SVC', english: 'Are they clerics?', japanese: '彼らは僧侶ですか？', sortOrder: 17 },
    { sentencePattern: 'BE_SVC', english: 'I\'m not a cleric.', japanese: '私は僧侶ではありません。', sortOrder: 18 },
    { sentencePattern: 'BE_SVC', english: 'You were a sage.', japanese: 'あなたは賢者でした。', sortOrder: 19 },
    { sentencePattern: 'BE_SVC', english: 'Are you sages?', japanese: 'あなたは賢者ですか？', sortOrder: 20 },
    { sentencePattern: 'BE_SVC', english: 'You aren\'t merchants.', japanese: 'あなたたちは商人ではありません。', sortOrder: 21 },
    { sentencePattern: 'BE_SVC', english: 'Will you be a merchant?', japanese: 'あなたは商人になるつもりですか？', sortOrder: 22 },
    { sentencePattern: 'BE_SVC', english: 'Will he be a warrior?', japanese: '彼は戦士になるつもりですか？', sortOrder: 23 },
    { sentencePattern: 'BE_SVC', english: 'I wasn\'t a mage.', japanese: '私は魔法使いではありませんでした。', sortOrder: 24 },
    { sentencePattern: 'BE_SVC', english: 'I am a villager.', japanese: '私は村人です。', sortOrder: 25 },
    { sentencePattern: 'BE_SVC', english: 'He won\'t be a villager.', japanese: '彼は村人になるつもりはありません。', sortOrder: 26 },
    { sentencePattern: 'BE_SVC', english: 'He isn\'t a thief.', japanese: '彼は盗賊ではありません。', sortOrder: 27 },
    { sentencePattern: 'BE_SVC', english: 'We will be happy.', japanese: '私たちは幸せになるでしょう。', sortOrder: 28 },
    { sentencePattern: 'BE_SVC', english: 'We weren\'t happy.', japanese: '私たちは幸せではありませんでした。', sortOrder: 29 },
    { sentencePattern: 'BE_SVC', english: 'Are you sleepy?', japanese: 'あなたは眠いですか？', sortOrder: 30 },
    { sentencePattern: 'BE_SVC', english: 'They were sleepy.', japanese: '彼らは眠かった。', sortOrder: 31 },
    { sentencePattern: 'BE_SVC', english: 'You won\'t be sleepy.', japanese: 'あなたは眠くならないでしょう。', sortOrder: 32 },
    { sentencePattern: 'BE_SVC', english: 'Were you angry?', japanese: 'あなたたちは怒っていましたか？', sortOrder: 33 },
    { sentencePattern: 'BE_SVC', english: 'They will be tired.', japanese: '彼らは疲れているでしょう。', sortOrder: 34 },
    { sentencePattern: 'BE_SVC', english: 'He wasn\'t tired.', japanese: '彼は疲れていませんでした。', sortOrder: 35 },
    { sentencePattern: 'BE_SVC', english: 'We are angry.', japanese: '私たちは怒っています。', sortOrder: 36 },
    { sentencePattern: 'BE_SVC', english: 'Is he fine?', japanese: '彼は元気ですか？', sortOrder: 37 },
    { sentencePattern: 'BE_SVC', english: 'You will be fine.', japanese: 'あなたは元気になるでしょう。', sortOrder: 38 },
    { sentencePattern: 'BE_SVC', english: 'He was sad.', japanese: '彼は悲しかった。', sortOrder: 39 },
    // DO_SVO
    { sentencePattern: 'DO_SVO', english: 'You had a wolf.', japanese: 'あなたはオオカミを飼っていました。', sortOrder: 40 },
    { sentencePattern: 'DO_SVO', english: 'You will know the legend.', japanese: 'あなたは伝説を知るでしょう。', sortOrder: 41 },
    { sentencePattern: 'DO_SVO', english: 'I don\'t know the hero.', japanese: '私はその勇者を知りません。', sortOrder: 42 },
    { sentencePattern: 'DO_SVO', english: 'Will he get a treasure?', japanese: '彼は財宝を手に入れるでしょうか？', sortOrder: 43 },
    { sentencePattern: 'DO_SVO', english: 'I will get my parchment.', japanese: '私は自分の羊皮紙を手に入れます。', sortOrder: 44 },
    { sentencePattern: 'DO_SVO', english: 'He will make a throne.', japanese: '彼は玉座を作るつもりです。', sortOrder: 45 },
    { sentencePattern: 'DO_SVO', english: 'He caught fairies.', japanese: '彼は妖精を捕まえました。', sortOrder: 46 },
    { sentencePattern: 'DO_SVO', english: 'We love our ancestors.', japanese: '私たちは自分たちの先祖を愛しています。', sortOrder: 47 },
    { sentencePattern: 'DO_SVO', english: 'Do you like herbs?', japanese: 'あなたは薬草が好きですか？', sortOrder: 48 },
    { sentencePattern: 'DO_SVO', english: 'I will take the key.', japanese: '私は鍵を持っていくつもりです。', sortOrder: 49 },
    { sentencePattern: 'DO_SVO', english: 'Will we take a wagon?', japanese: '私たちは馬車で行くのでしょうか？', sortOrder: 50 },
    { sentencePattern: 'DO_SVO', english: 'Did they see the dragon?', japanese: '彼らはドラゴンを見たのですか？', sortOrder: 51 },
    { sentencePattern: 'DO_SVO', english: 'Did you hear the sound?', japanese: 'あなたはその音が聞こえましたか？', sortOrder: 52 },
    { sentencePattern: 'DO_SVO', english: 'They don\'t play swordplay.', japanese: '彼らは剣術をしません。', sortOrder: 53 },
    { sentencePattern: 'DO_SVO', english: 'Will you play the lute?', japanese: 'あなたはリュートを演奏するつもりですか？', sortOrder: 54 },
    { sentencePattern: 'DO_SVO', english: 'We won\'t sing a song.', japanese: '私たちは歌を歌うつもりはありません。', sortOrder: 55 },
    { sentencePattern: 'DO_SVO', english: 'Did you study magic?', japanese: 'あなたは魔法を勉強しましたか？', sortOrder: 56 },
    { sentencePattern: 'DO_SVO', english: 'He doesn\'t teach magic.', japanese: '彼は魔法を教えていません。', sortOrder: 57 },
    { sentencePattern: 'DO_SVO', english: 'He reads a scroll.', japanese: '彼は巻物を読みます。', sortOrder: 58 },
    { sentencePattern: 'DO_SVO', english: 'I wrote a letter.', japanese: '私は手紙を書きました。', sortOrder: 59 },
    { sentencePattern: 'DO_SVO', english: 'You don\'t drink potion.', japanese: 'あなたはポーションを飲みません。', sortOrder: 60 },
    { sentencePattern: 'DO_SVO', english: 'He eats bread.', japanese: '彼はパンを食べます。', sortOrder: 61 },
    { sentencePattern: 'DO_SVO', english: 'He won\'t cook feast.', japanese: '彼は宴を料理するつもりはありません。', sortOrder: 62 },
    { sentencePattern: 'DO_SVO', english: 'I rode my horse.', japanese: '私は馬に乗りました。', sortOrder: 63 },
  ];

  for (const drill of sentenceDrills) {
    await prisma.sentenceDrill.upsert({
      where: { id: `drill-${drill.sortOrder}` },
      update: {
        sentencePattern: drill.sentencePattern,
        english: drill.english,
        japanese: drill.japanese,
        sortOrder: drill.sortOrder,
      },
      create: {
        id: `drill-${drill.sortOrder}`,
        sentencePattern: drill.sentencePattern,
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
