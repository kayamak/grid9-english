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
- **場所**: `src/domain/shared/vo/sentence-pattern.ts`
- **振る舞い**:
    - `rotateSubject()`: 主語を1→11→2→22のように回転させる。
    - `changeTense()`: 時制を切り替える。
    - **自己バリデーション**: `VerbType` が `be` の場合に不適切な `pattern` が設定されないよう、インスタンス生成時にチェックする。

### 3.2 Word (Entity)
- **場所**: `src/domain/shared/entities/word.ts`
- **特徴**:
    - 単語のスペルだけでなく、活用形（Base, Past, S-form等）をカプセル化。
    - 外部からの意図せぬ変更を防ぐため、活用形リストの取得時は「防御的コピー」を徹底する。

### 3.3 Domain Services
- **PatternGenerator**: 
    - **場所**: `src/domain/practice/services/pattern-generator.ts`
    - **責務**: 特定の `SentencePattern` と `Word` を受け取り、三単現や未来形（will）などの英文法ルールを適用して、最終的な出力文字列（`Subject + Verb + ...`）を生成する。

---

## 4. プレゼンテーション層 (Presentation Layer)
UIとユーザーインタラクション。

### 4.1 Page Component (`src/app/practice/page.tsx`)
- 原則として Server Component。
- データの初期取得やレイアウトを担当。

### 4.2 Feature Components (`src/features/practice/components/`)
- **Grid9**: 3x3のグリッド。各マスは個別の Client Component (`'use client'`)。
- **ResultDisplay**: 生成された英文を表示するコンポーネント。
- **状態管理**: マスのクリックイベントは Server Actions (`actions/`) を呼び出し、サーバーサイドで計算された結果を再レンダリングする（Next.js 15 の Streaming/Partial Prerendering 等を考慮）。

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
| id | String | CUID による一意識別子 |
| sentencePattern | String | "DO_SV" | "DO_SVO" | "DO_SVC" | "BE_SV" | "BE_SVC" |
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
7. **He caught butterflies.** / 彼の息子は蝶を捕まえました。
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
- **言語切り替え (English/Japanese Toggle)**:
    - 問題として表示する言語を切り替えることができます。
    - 切り替えに関わらず、判定は常に「構築された英文」対「課題の英文」で行われます。
- **ナビゲーション**:
    - 正解した場合、次の問題へ進むためのアクションが可能になります。
    - 全ての問題を解き終わると、最初の問題に戻ります。

