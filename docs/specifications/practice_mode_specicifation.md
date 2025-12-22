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
| english | String | 英文（問題・回答のいずれかとして使用） |
| japanese | String | 日本語訳（問題・回答のいずれかとして使用） |
| sortOrder | Int | 出題順序を制御するための値 |

### 7.2 初期データ
以下のデータを登録し、`sortOrder` 順（先頭から）に出題します。

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

### 7.3 学習フローと操作
- **問題表示**:
    - 先頭から1問ずつ問題を出題します。
    - デフォルトでは英文が問題として表示されます。
- **正誤判定**:
    - ユーザーが入力した文字列が、その問題の「回答（Result）」と一致した場合に「正解」と表示します。
    - 正解した場合、自動的にまたはアクションを介して次の問題へ遷移します。
- **言語切り替え (English/Japanese Toggle)**:
    - 画面上の切り替えボタンにより、「問題」として出す言語を切り替えることができます。
    - **英文から和文へ**: 問題文が「英文」から「和文」に切り替わります（回答は英文になります）。
    - **和文から英文へ**: 問題文が「和文」から「英文」に切り替わります（回答は英文になります）。

