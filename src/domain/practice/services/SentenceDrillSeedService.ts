import { SentenceDrill } from "../entities/SentenceDrill";
import { ISentenceDrillRepository } from "../repositories/ISentenceDrillRepository";

export class SentenceDrillSeedService {
  constructor(private readonly repository: ISentenceDrillRepository) {}

  async execute(): Promise<number> {
    const sentenceDrills = [
      // DO_SV
      { sentencePattern: 'DO_SV', english: 'You live.', japanese: 'あなたは住んでいます。', sortOrder: 1 },
      { sentencePattern: 'DO_SV', english: 'I ran.', japanese: '私は走りました。', sortOrder: 2 },
      { sentencePattern: 'DO_SV', english: 'They won\'t laugh.', japanese: '彼らは笑わないでしょう。', sortOrder: 3 },
      { sentencePattern: 'DO_SV', english: 'I didn\'t smile', japanese: '私は微笑みませんでした。', sortOrder: 4 },
      { sentencePattern: 'DO_SV', english: 'Will he live?', japanese: '彼は住むでしょうか？', sortOrder: 5 },
      { sentencePattern: 'DO_SV', english: 'Do we arrive?', japanese: '私たちは到着しますか？', sortOrder: 6 },
      { sentencePattern: 'DO_SV', english: 'He walks.', japanese: '彼は歩きます。', sortOrder: 7 },
      { sentencePattern: 'DO_SV', english: 'You won\'t go.', japanese: 'あなたは行かないでしょう。', sortOrder: 8 },
      { sentencePattern: 'DO_SV', english: 'Did you talk?', japanese: 'あなたたちは話しましたか？', sortOrder: 9 },
      { sentencePattern: 'DO_SV', english: 'You don\'t run.', japanese: 'あなたは走りません。', sortOrder: 10 },
      { sentencePattern: 'DO_SV', english: 'They will arrive.', japanese: '彼らは到着するでしょう。', sortOrder: 11 },
      { sentencePattern: 'DO_SV', english: 'Did I laugh?', japanese: '私は笑いましたか？', sortOrder: 12 },
      { sentencePattern: 'DO_SV', english: 'Does he talk?', japanese: '彼は会話しますか？', sortOrder: 13 },
      { sentencePattern: 'DO_SV', english: 'We walk.', japanese: '私たちは歩きます。', sortOrder: 14 },
      // BE_SVC
      { sentencePattern: 'BE_SVC', english: 'I was a carpenter.', japanese: '私は木工でした。', sortOrder: 15 },
      { sentencePattern: 'BE_SVC', english: 'I will be a hairdresser.', japanese: '私は美容師になるつもりです。', sortOrder: 16 },
      { sentencePattern: 'BE_SVC', english: 'Are they nurses?', japanese: '彼らはは看護師ですか？', sortOrder: 17 },
      { sentencePattern: 'BE_SVC', english: 'I\'m not a nurse.', japanese: '私は看護師ではありません。', sortOrder: 18 },
      { sentencePattern: 'BE_SVC', english: 'You were a teacher.', japanese: 'あなたは教師でした。', sortOrder: 19 },
      { sentencePattern: 'BE_SVC', english: 'Are you teachers?', japanese: 'あなたは先生ですか？', sortOrder: 20 },
      { sentencePattern: 'BE_SVC', english: 'You aren\'t chefs.', japanese: 'あなたたちはシェフではありません。', sortOrder: 21 },
      { sentencePattern: 'BE_SVC', english: 'Will you be a chef?', japanese: 'あなたはシェフになるつもりですか？', sortOrder: 22 },
      { sentencePattern: 'BE_SVC', english: 'Will he be a carpenter?', japanese: '彼は木工になるつもりですか？', sortOrder: 23 },
      { sentencePattern: 'BE_SVC', english: 'I wasn\'t a hairdresser.', japanese: '私は美容師ではありませんでした。', sortOrder: 24 },
      { sentencePattern: 'BE_SVC', english: 'I am a farmer.', japanese: '私は農夫です。', sortOrder: 25 },
      { sentencePattern: 'BE_SVC', english: 'He won\'t be a farmer.', japanese: '彼は農夫になるつもりはありません。', sortOrder: 26 },
      { sentencePattern: 'BE_SVC', english: 'He isn\'t a photographer.', japanese: '彼は写真家ではありません。', sortOrder: 27 },
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
      { sentencePattern: 'DO_SVO', english: 'You had a dog.', japanese: 'あなたは犬を飼っていました。', sortOrder: 40 },
      { sentencePattern: 'DO_SVO', english: 'You will know the story.', japanese: 'あなたは物語を知るでしょう。', sortOrder: 41 },
      { sentencePattern: 'DO_SVO', english: 'I don\'t know the soccer player.', japanese: '私はサッカー選手を知りません。', sortOrder: 42 },
      { sentencePattern: 'DO_SVO', english: 'Will he get a gold medal?', japanese: '彼は金メダルを取るでしょうか？', sortOrder: 43 },
      { sentencePattern: 'DO_SVO', english: 'I will get my passport.', japanese: '私は自分のパスポートを取得します。', sortOrder: 44 },
      { sentencePattern: 'DO_SVO', english: 'He will make a chair.', japanese: '彼は椅子を作るつもりです。', sortOrder: 45 },
      { sentencePattern: 'DO_SVO', english: 'He caught butterflies.', japanese: '彼は蝶を捕まえました。', sortOrder: 46 },
      { sentencePattern: 'DO_SVO', english: 'We love our parents.', japanese: '私たちは自分たちの両親を愛しています。', sortOrder: 47 },
      { sentencePattern: 'DO_SVO', english: 'Do you like fruit?', japanese: 'あなたはフルーツが好きですか？', sortOrder: 48 },
      { sentencePattern: 'DO_SVO', english: 'I will take the key.', japanese: '私は鍵を持っていくつもりです。', sortOrder: 49 },
      { sentencePattern: 'DO_SVO', english: 'Will we take a taxi?', japanese: '私たちはタクシーで行くのでしょうか？', sortOrder: 50 },
      { sentencePattern: 'DO_SVO', english: 'Did they see the airplane?', japanese: '彼らには空飛ぶ機を見たのですか？', sortOrder: 51 },
      { sentencePattern: 'DO_SVO', english: 'Did you hear the sound?', japanese: '彼らにはその音が聞こえましたか？', sortOrder: 52 },
      { sentencePattern: 'DO_SVO', english: 'They don\'t play soccer.', japanese: '彼らはサッカーをやりません。', sortOrder: 53 },
      { sentencePattern: 'DO_SVO', english: 'Will you play the violin?', japanese: 'あなたにはバイオリンを演奏するつもりですか？', sortOrder: 54 },
      { sentencePattern: 'DO_SVO', english: 'We won\'t sing a song.', japanese: '私たちは歌を歌うつもりはありません。', sortOrder: 55 },
      { sentencePattern: 'DO_SVO', english: 'Did you study English?', japanese: 'あなたは英語を勉強しましたか？', sortOrder: 56 },
      { sentencePattern: 'DO_SVO', english: 'He doesn\'t teach English.', japanese: '彼は英語を教えていません。', sortOrder: 57 },
      { sentencePattern: 'DO_SVO', english: 'He reads a newspaper.', japanese: '彼は新聞を読みます。', sortOrder: 58 },
      { sentencePattern: 'DO_SVO', english: 'I wrote a letter.', japanese: '私は手紙を書きました。', sortOrder: 59 },
      { sentencePattern: 'DO_SVO', english: 'You don\'t drink coffee.', japanese: 'あなたはコーヒーを飲みません。', sortOrder: 60 },
      { sentencePattern: 'DO_SVO', english: 'He eats pizza.', japanese: '彼はピザを食べます。', sortOrder: 61 },
      { sentencePattern: 'DO_SVO', english: 'He won\'t cook dinner.', japanese: '彼は夕食を作るつもりはありません。', sortOrder: 62 },
      { sentencePattern: 'DO_SVO', english: 'I drove my car.', japanese: '私は車を運転しました。', sortOrder: 63 },
    ];

    let count = 0;
    for (const drill of sentenceDrills) {
      const entity = SentenceDrill.create({
        id: `drill-${drill.sortOrder}`,
        sentencePattern: drill.sentencePattern,
        english: drill.english,
        japanese: drill.japanese,
        sortOrder: drill.sortOrder,
      });
      await this.repository.save(entity);
      count++;
    }

    return count;
  }
}
