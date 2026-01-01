# 練習モード 機能仕様 (Practice Mode Specification)

## 1. 概要
ユーザーが9マスグリッドを操作しながら、英語の文頭パターン（Sentence Starters）をリアルタイムに生成・学習するためのインタラクティブ機能です。
この機能は `src/features/practice` に集約されます。

---

## 2. アプリケーション層 (Application Layer / Server Actions)
`src/features/practice/actions` に、画面からの操作に対応する Server Actions を定義します。

### 2.1 パターン生成・更新
- **責務**: 
    1. クライアントからのデータ（主語ID、時制、文の種類など）を `src/features/practice/schemas` の Zod スキーマで検証。
    2. ドメイン層の `SentencePattern` VO や `Word` エンティティを、入力値やリポジトリから取得・生成。
    3. ドメインサービス（`PatternGenerator`）を呼び出し、活用ルールに基づいた最終的な英文データを組み立てる。
    4. 画面表示に必要なDTO（Data Transfer Object）へ変換してクライアントに返却する。

---

## 3. ドメイン層 (Domain Layer)
ビジネスルールの核心です。`src/domain/practice` および `src/domain/shared` を使用します。

### 3.1 SentencePattern (Value Object)
- **場所**: `src/domain/practice/vo/SentencePattern.ts`
- **振る舞い**:
    - `rotateSubject()`: 主語を単数⇔複数で切り替える（I ↔ We, You ↔ You, He ↔ They）。
    - `changeTense()`: 時制を切り替える。
    - **自己バリデーション**: `VerbType` が `be` の場合に不適切な `pattern` が設定されないよう、`SentencePatternSpecification` を使用して精度高くチェックする。

### 3.2 Word (Entity)
- **場所**: `src/domain/shared/entities/Word.ts`
- **特徴**:
    - 単語のスペルだけでなく、活用形（Past, ThirdPersonForm等）をカプセル化。
    - データベースの `VerbWord` テーブルから取得した活用形を優先し、存在しない場合は規則変化（-ed, -s等）をフォールバックとして適用する。
    - 外部からの意図せぬ変更を防ぐため、`private` フィールドと `get` アクセサを使用する。

### 3.3 Domain Services
- **PatternGenerator**: 
    - **場所**: `src/domain/practice/services/PatternGenerator.ts`
    - **責務**: 特定の `SentencePattern` と `Word` を受け取り、三単現や未来形（will）などの英文法ルールを適用して、最終的な出力文字列（`Subject + Verb + ...`）を生成する。
    - **活用ロジック**: `VerbWord` に格納された `pastForm` や `thirdPersonForm` を使用。

---

## 4. プレゼンテーション層 (Presentation Layer)
UIとユーザーインタラクション。

### 4.1 Page Component (`src/app/practice/page.tsx`)
- 原則として Server Component。
- データの初期取得やレイアウトを担当。

### 4.2 Feature Components (`src/features/practice/components/`)
- **Grid9**: 3x3のグリッド。各マスは個別の Client Component (`'use client'`)。
- **ResultDisplay**: 生成された英文を表示するコンポーネント。
- **Selector Components**: 動詞や目的語の選択。選択肢は `value` に基づいてアルファベット順にソートされる。
- **状態管理**: マスのクリックイベントは Server Actions (`actions/`) を呼び出し、サーバーサイドで計算された結果を再レンダリングする。

---

## 5. インフラストラクチャ層 (Infrastructure Layer)
技術的詳細。

### 5.1 WordRepository (Prisma Implementation)
- **場所**: `src/infrastructure/repositories/prisma-word-repository.ts`
- **責務**: Prisma を介して SQLite (Turso) から単語データを取得。DBのレコードモデルから `Word` エンティティへ変換（Reconstruct）する Mapper 機能を備える。

---

## 6. 実装上の不変条件 (Invariants)
- **カプセル化**: 全てのドメインオブジェクトは `private` フィールドを持ち、状態変更は必ず明示的なメソッド経由で行う。
- **純粋性**: ドメイン層のコードには `import prisma from ...` や `import { ... } from 'next/...'` などの外部依存を一切含めない。
- **単一責任**: `src/features/practice` 外のコードは、練習モード固有の計算ロジックに依存しないようにする。

---

## 7. 文章ドリル (SentenceDrill)
特定の例文リストを用いて、英文・和文の変換練習を行う機能です。

### 7.1 データモデル
`SentenceDrill` テーブルを以下のように定義します。

| カラム名 | 型 | 説明 |
| :--- | :--- | :--- |
| id | String | CUID または `drill-{sortOrder}` 形式の識別子 |
| sentencePattern | String | "DO_SV" | "DO_SVO" | "BE_SVC" |
| english | String | 英文（問題・回答のいずれかとして使用） |
| japanese | String | 日本語訳（問題・回答のいずれかとして使用） |
| sortOrder | Int | 出題順序を制御するための値 |

### 7.2 初期データ
以下のデータを登録し、`sortOrder` 順（先頭から）に出題します。

#### 7.2.1. SVの初期データ
1. **You live.** / あなたは住んでいます。
2. **I ran.** / 私は走りました。
3. **They won't laugh.** / 彼らは笑わないでしょう。
4. **I didn't smile** / 私は微笑みませんでした。
5. **Will he live?** / 彼は住むでしょうか？
6. **Do we arrive?** / 私たちは到着しますか？
7. **He walks.** / 彼は歩きます。
8. **You won't go.** / あなたは行かないでしょう。
9. **Did you talk?** / あなたたちは話しましたか？
10. **You don't run.** / あなたは走りません。
11. **They will arrive.** / 彼らは到着するでしょう。
12. **Did I laugh?** / 私は笑いましたか？
13. **Does he talk?** / 彼は会話しますか？
14. **We walk.** / 私たちは歩きます。

#### 7.2.2. SVCの初期データ
1. **I was a carpenter.** / 私は木工でした。
2. **I will be a hairdresser.** / 私は美容師になるつもりです。
3. **Are they nurses?** / 彼らはは看護師ですか？
4. **I'm not a nurse.** / 私は看護師ではありません。
5. **You were a teacher.** / あなたは教師でした。
6. **Are you teachers?** / あなたは先生ですか？
7. **You aren't chefs.** / あなたたちはシェフではありません。
8. **Will you be a chef?** / あなたはシェフになるつもりですか？
9. **Will he be a carpenter?** / 彼は木工になるつもりですか？
10. **I wasn't a hairdresser.** / 私は美容師ではありませんでした。
11. **I am a farmer.** / 私は農夫です。
12. **He won't be a farmer.** / 彼は農夫になるつもりはありません。
13. **He isn't a photographer.** / 彼は写真家ではありません。
14. **We will be happy.** / 私たちは幸せになるでしょう。
15. **We weren't happy.** / 私たちは幸せではありませんでした。
16. **Are you sleepy?** / あなたは眠いですか？
17. **They were sleepy.** / 彼らは眠かった。
18. **You won't be sleepy.** / あなたは眠くならないでしょう。
19. **Were you angry?** / あなたたちは怒っていましたか？
20. **They will be tired.** / 彼らは疲れているでしょう。
21. **He wasn't tired.** / 彼は疲れていませんでした。
22. **We are angry.** / 私たちは怒っています。
23. **Is he fine?** / 彼は元気ですか？
24. **You will be fine.** / あなたは元気になるでしょう。
25. **He was sad.** / 彼は悲しかった。

#### 7.2.3. SVOの初期データ
1. **You had a dog.** / あなたは犬を飼っていました。
2. **You will know the story.** / あなたは物語を知るでしょう。
3. **I don't know the soccer player.** / 私はサッカー選手を知りません。
4. **Will he get a gold medal?** / 彼は金メダルを取るでしょうか？
5. **I will get my passport.** / 私は自分のパスポートを取得します。
6. **He will make a chair.** / 彼は椅子を作るつもりです。
7. **He caught butterflies.** / 彼は蝶を捕まえました。
8. **We love our parents.** / 私たちは自分たちの両親を愛しています。
9. **Do you like fruit?** / あなたはフルーツが好きですか？
10. **I will take the key.** / 私は鍵を持っていくつもりです。
11. **Will we take a taxi?** / 私たちはタクシーで行くのでしょうか？
12. **Did they see the airplane?** / 彼らには空飛ぶ機を見たのですか？
13. **Did you hear the sound?** / 彼らにはその音が聞こえましたか？
14. **They don't play soccer.** / 彼らはサッカーをやりません。
15. **Will you play the violin?** / あなたにはバイオリンを演奏するつもりですか？
16. **We won't sing a song.** / 私たちは歌を歌うつもりはありません。
17. **Did you study English?** / あなたは英語を勉強しましたか？
18. **He doesn't teach English.** / 彼は英語を教えていません。
19. **He reads a newspaper.** / 彼は新聞を読みます。
20. **I wrote a letter.** / 私は手紙を書きました。
21. **You don't drink coffee.** / あなたはコーヒーを飲みません。
22. **He eats pizza.** / 彼はピザを食べます。
23. **He won't cook dinner.** / 彼は夕食を作るつもりはありません。
24. **I drove my car.** / 私は車を運転しました。

### 7.3 学習フローと操作 (Integrated Grid Mode)
文章ドリルは、メインのパターン練習画面 (`/practice`) に統合されます。

- **モード切替とパターン選択**:
    - トップ画面の「Start Drills」セクションでは、`SentenceDrill` テーブルに登録されている `sentencePattern` ごとに選択ボタンが表示されます。
    - 各ボタンをクリックすると、その `sentencePattern` に限定された問題セットでドリルが開始されます。
    - 選択されたパターンは、URL パラメータ (`?mode=drill&pattern=DO_SVO` など) として練習画面に引き継がれます。
- **問題表示**:
    - 文章ドリルモードでは、画面上部に現在の課題（和文または英文）が表示されます。
    - **選択された `sentencePattern` が画面上に明示されます。**
- **回答方法 (重要)**:
    - **テキスト入力は行いません。**
    - ユーザーは既存の **3x3 グリッド (NineKeyPanel)** やドロップダウンを操作して、課題に合致する英文を「構築」します。
- **正誤判定**:
    - 画面に表示されている `Result` (構築された英文) が、課題の `english` と一致した場合に「正解 (Correct)」と判定します。
    - **正規化判定ルール**: 比較の際、大文字・小文字を区別せず（Lowercase）、末尾の句読点（`.`, `,`, `?`, `!`）を無視します。
- **言語切り替え (English/Japanese Toggle)**:
    - 問題として表示する言語を切り替えることができます。
    - 切り替えに関わらず、判定は常に「構築された英文」対「課題の英文」で行われます。
- **ナビゲーション**:
    - 正解した場合、次の問題へ進むためのアクションが可能になります。
    - 全ての問題を解き終わると、最初の問題に戻ります。

---

## 8. ドリルクエスト (Drill Quest)
RPGの要素を取り入れ、レベルアップを目指す学習モードです。

### 8.1 基本ルール
- **レベルシステム**: レベル1から開始します。
- **昇格条件**: 各レベルで **10問中8問以上** 正解すると、次のレベルへレベルアップします。
- **制限時間**:
    - 各問題には制限時間があります。
    - **タイムアップ（30秒経過）は不正解** 扱いとなります。
    - レベル4以降は、レベルが上がるごとに制限時間が短縮されます（後述）。

### 8.2 レベル別詳細設定
各レベルの対象パターンと出題ルールは以下の通りです。

| レベル | 対象パターン | 問題の抽出条件 | 制限時間 |
| :--- | :--- | :--- | :--- |
| **Lv 1** | DO_SV | 「Pattern Practice」の先頭10問 | 30秒 |
| **Lv 2** | DO_SVO | 「Pattern Practice」の先頭10問 | 30秒 |
| **Lv 3** | BE_SVC | 「Pattern Practice」の先頭10問 | 30秒 |
| **Lv 4** | DO_SV | ランダムに選んだ10問 | 30s - (Lv * 2) = 22秒 |
| **Lv 5** | DO_SVO | ランダムに選んだ10問 | 30s - (Lv * 2) = 20秒 |
| **Lv 6** | BE_SVC | ランダムに選んだ10問 | 30s - (Lv * 2) = 18秒 |
| **Lv 7** | DO_SV | ランダムに選んだ10問 | 30s - (Lv * 2) = 16秒 |
| **Lv 8** | DO_SVO | ランダムに選んだ10問 | 30s - (Lv * 2) = 14秒 |
| **Lv 9** | BE_SVC | ランダムに選んだ10問 | 30s - (Lv * 2) = 12秒 |
| **Lv 10** | **ALL** | 全パターンからランダムに10問 | 10秒 (固定) |

### 8.3 UI/UX の要件
- **画面レイアウト（Battle Area）**:
    - **背景画像**: モードに応じて変更します。
        - **Drill Quest**: `/assets/backgrounds/battle_bg.jpeg`
        - **Sentence Training**: `/assets/backgrounds/stadium_bg.jpeg`
        - **Free Training**: `/assets/backgrounds/dungeon.jpeg`
    - **上部オーバーレイ**:
        - **左側**: 「もどる」ボタン、現在のレベル表示、問題数進捗（例: 1/10）。
        - **右側**: タイマー残時間、10個のドットによる正誤進捗（正解：緑、不正解：赤、現在：黄点滅）。
    - **中央**:
        - **問題文**: 日本語（または英文）を表示。
        - **メッセージ**: 正解時「モンスターを　たおした！」等のメッセージ表示。
    - **下部**:
        - **アクションボタン**:
            - 回答前: 「にげる」ボタン（クリックでその問題をスキップし、不正解扱いとして次に進む）。
            - 正解後/タイムアップ後: 「つぎへすすむ」または「けっかへ」ボタン。
    - **キャラクター表示**:
        - 左側: 主語（Subject）に対応するキャラクター（勇者、魔法使い等）。
        - 右側: 動詞/パターンに対応するモンスター。
        - アイテム: 文型に応じてアイテム（スライム等）を表示。

- **状態遷移とアニメーション**:
    - **Playing**: 問題に挑戦中。
    - **Time Over (Game Over)**:
        1. タイマーが0になる。
        2. モンスターが攻撃アクション（`monster_attack.wav` 再生）。
        3. 勇者がダメージを受けるアニメーション。
        4. 勇者が倒れる（Defeated状態）。
        5. 「不正解」として処理され、結果画面遷移ボタンが表示される。
    - **Result (Success)**: 8問以上正解でクリア。
    - **Result (Failed)**: 8問未満で失敗。リトライが可能。

- **演出**:
    - **攻撃エフェクト**: 主語に応じて攻撃アクションとサウンドが変化。
    - **勝利演出**: 画面の振動（Shake）、フラッシュ、モンスター撃破アニメーション。

## 9. 音響 (Sound & Music)
各モードおよび状況に応じたBGMと効果音（SE）を再生します。

- **BGM**:
  - **Drill Quest (ドリルクエスト)**: `drill_quest_bgm.mp3`
  - **Sentence Training (ぶんしょうトレーニング)**: `free_training_bgm.mp3`
  - **Free Training (じゆうトレーニング)**: `writing_training_bgm.mp3`
  - **Defeated (敗北/ゲームオーバー時)**: `dead_bgm.mp3`
  - **再生ルール**: ループ再生、音量は控えめ（0.2 / 20%）。

- **SE (効果音)**:
  - **攻撃 (Attack)**:
      - **勇者 (Default/First Person)**: `hero_attack.wav`
      - **魔法使い (Second Person)**: `magic_attack.wav`
      - **戦士 (Third Person)**: `warrior_attack.wav`
  - **モンスター攻撃 (Time Over)**: `monster_attack.wav`


