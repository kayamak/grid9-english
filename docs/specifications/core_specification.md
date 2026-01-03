# Grid9English システム共通仕様 (Core Specification)

## 1. はじめに
本ドキュメントは、Grid9Englishの全体像、アーキテクチャ方針、および核心となるビジネスルールを定義します。
Next.js 15とDDD（ドメイン駆動設計）をベースとした「堅牢なシステム設計」を志向し、以下の記事の設計思想を忠実に反映しています。

- [Next.js 15とDDDで作る堅牢なシステム設計【第1部: 設計編】](https://zenn.dev/7788/articles/f58adf9ecd42da)
- [Next.js 15とDDDで作る堅牢なシステム設計【第2部: Domain層編】](https://zenn.dev/7788/articles/a485c60d0f6581)

---

## 2. アーキテクチャ概要 (Layered Architecture)
レイヤードアーキテクチャを採用し、依存関係を「プレゼンテーション → アプリケーション → ドメイン ← インフラストラクチャ」の方向に制御します（DIP: 依存性逆転の原則を適用）。

### 2.1 各層の責務
- **Presentation Layer (`src/app`, `src/components`, `src/features/*/components`, `src/features/*/hooks`)**:
    - Next.js 15のApp Router規約および、関心の分離に基づいたコンポーネント抽出。
    - Routing、Page Component、共通UIコンポーネントを担当。
    - 複雑なUIロジックや状態管理は **Custom Hook (`hooks/`)** に委譲する。
    - ビジネスロジック（永続化や外部通信）は直接持たず、Application層（Server Actions）を呼び出す。
    - **UI言語**: 日本語を基本とし、学習対象の英文のみ英語で表示する。

- **Application Layer (`src/features/*/actions`)**:
    - ユースケースをServer Actions、またはUseCaseクラスとして実装。
    - 入力バリデーション（Zod）、ドメインオブジェクトの組み立て、リポジトリへの永続化依頼を行う。
- **Domain Layer (`src/domain`)**:
    - ビジネスルールの中心。純粋なTypeScriptで実装し、フレームワークや外部ライブラリ（DB等）に依存しない。
    - エンティティ、値オブジェクト（VO）、ドメインサービス、リポジトリインターフェースを含む。
- **Infrastructure Layer (`src/infrastructure`)**:
    - DB（Prisma/Turso）や外部APIなどの技術的詳細を実装。
    - ドメイン層で定義されたインターフェースの実装（Repository Implementation）を提供する。

---

## 3. ディレクトリ構成 (Detailed Feature-based Structure)
機能（Feature）単位での凝集度を高め、スケーラビリティを確保する構成を採用します。

```text
src/
├── app/                  # プレゼンテーション層 (ルーティング & ページコンポーネント)
│   ├── layout.tsx        # 全体レイアウト
│   ├── page.tsx          # トップページ
│   └── practice/page.tsx # 各種モードページ
│
├── domain/               # ドメイン層 (純粋なロジック, サブドメインごとに構成)
│   ├── shared/
│   │   ├── entities/     # エンティティ (Word.ts等)
│   │   └── repositories/ # リポジトリインターフェース
│   └── practice/
│       ├── entities/     # エンティティ (SentenceDrill.ts, QuestSession.ts)
│       ├── vo/           # 値オブジェクト (SentencePattern.ts)
│       ├── repositories/ # リポジトリインターフェース (ISentenceDrillRepository.ts)
│       ├── services/     # ドメインサービス (PatternGenerator.ts, SentenceDrillSeedService.ts)
│       └── spec/         # 仕様パターン (SentencePatternSpecification.ts)
│
├── features/             # アプリケーション & プレゼンテーションロジック (機能単位)
│   ├── home/
│   │   └── components/   # UIコンポーネント (MainMenuなど)
│   └── practice/
│       ├── actions/      # Server Actions & ユースケースクラス
│       ├── components/   # UIコンポーネント (AnswerArea, BattleAreaなど)
│       ├── hooks/        # 複雑なUIロジック (usePractice.ts)
│       └── schemas/      # バリデーションスキーマ
│
├── infrastructure/       # インフラストラクチャ層 (技術的詳細)
│   ├── prisma/           # Prismaクライアント & スキーマロジック
│   └── repositories/     # リポジトリの実装
│
├── components/           # プレゼンテーション層 (共通コンポーネント)
│   └── ui/               # shadcn/ui コンポーネント
│
└── lib/                  # 共通ユーティリティ & 設定
```

---

## 4. ドメインモデル実装原則 (Domain implementation)

### 4.1 エンティティ (Entities)
- **識別子**: 必ず一意なIDを持つ。
- **privateコンストラクタ**: 直接の `new` を禁止し、不正な状態の生成を防ぐ。
- **ファクトリメソッド**:
    - `create()`: 新規作成用。
    - `reconstruct()`: データベースからの復元用。
- **不変条件の保護**: インスタンス生成時およびメソッド実行時に検証を行い、常にビジネスルールに適合した状態を維持する。
- **カプセル化**: プロパティは原則 `private`。外部への公開は `get` アクセサを用い、配列やオブジェクトの場合は防御的コピーを返す。
- **例**: `SentenceDrill`, `QuestSession` (クエストの進行状況、正誤判定、タイムリミット計算を保持)。

### 4.2 値オブジェクト (Value Objects)
- **不変性 (Immutable)**: 一度生成したら状態を変えない。変更時は常に新しいインスタンスを返す。
- **等価性**: `equals()` メソッドを持つ。
- **自己検証**: 不正な値での生成を許可しない。

### 4.3 リポジトリ (Repositories)
- **インターフェース**: ドメイン層で定義。
- **ドメインオブジェクトの入出力**: Application層、UI層とのやり取りは常にドメインエンティティを介する。

### 4.4 仕様パターン (Specification Pattern)
- 複雑な判定条件を `isSatisfiedBy()` として独立したクラスに抽出する。

---

## 5. ユビキタス言語 (Ubiquitous Language)

| 用語 | 英語名 | 定義 |
| :--- | :--- | :--- |
| **Grid9 (9マス)** | Grid9 | 文頭パターンを視覚化した3x3のグリッドUI。 |
| **動詞タイプ** | VerbType | Do動詞(Do) か Be動詞(Be) の区分。 |
| **文頭パターン** | SentencePattern | 主語、時制、文の種類を組み合わせた文の開始部分。 |
| **主語** | Subject | I/You/He/She/It/We/They など。 |
| **時制** | Tense | Past/Present/Future の区分。 |
| **活用形** | Form | 動詞の変化（Original/Past/PastParticiple/S-Form/Ing-Form）。 |
| **Drill Quest** | Drill Quest | RPG要素を取り入れた段階的な学習モード。 |
| **Quest Session** | Quest Session | クエストの進行状態（正誤履歴、現在の問題インデックス、ステータス）を管理するドメインオブジェクト。 |
| **文章ドリル** | Sentence Drill | 固定の例文セットを用いた英作文練習モード。 |
| **自由練習** | Free Practice | 制約なしに英文を構築できるモード。 |
| **正規化判定** | Normalization | 正誤判定時に大文字小文字の区別をなくし、句読点を除去して比較するロジック。 |
| **時限式** | Timer | クエストモードで適用される、1問ごとの制限時間。 |

---

## 6. 更新履歴
- 2025-12-22: Zenn記事に基づき全体構成を刷新。
- 2025-12-26: ソースコードの最新状態（SentenceDrill、活用形DB化、UI改善等）を反映。
- 2025-12-27: 「Drill Quest」の仕様を追加。
- 2025-12-31: プレゼンテーション層の分離（Hooks抽出、コンポーネント分割）および `QuestSession` エンティティの導入を反映。
