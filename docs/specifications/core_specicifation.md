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
- **Presentation Layer (`src/app`, `src/components`)**:
    - Next.js 15のApp Router規約に従う。
    - Routing、Page Component、共通UIコンポーネントを担当。
    - ビジネスロジックは持たず、Application層（Server Actions）を呼び出す。
- **Application Layer (`src/features/*/actions`)**:
    - ユースケースをServer Actionsとして実装。
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
├── app/                  # Presentation Layer (Routing & Page Components)
│   ├── layout.tsx        # 全体レイアウト
│   ├── page.tsx          # トップページ
│   ├── (auth)/           # 認証・ユーザー管理関連ページ
│   ├── circles/          # サークル閲覧・管理ページ
│   │   ├── page.tsx      # 一覧ページ
│   │   └── [id]/         # 詳細・編集ページ
│   └── practice/         # 練習モードページ
│
├── features/             # Application Layer (Feature-based logic)
│   ├── circles/
│   │   ├── actions/      # Server Actions (createCircle.ts, updateCircle.ts)
│   │   ├── components/   # この機能に特化した UI (CircleForm.tsx, CircleList.tsx)
│   │   └── schemas/      # Zodバリデーションスキーマ (circleSchema.ts)
│   └── practice/
│       ├── actions/      # (generatePattern.ts, saveResult.ts)
│       ├── components/
│       └── schemas/
│
├── domain/               # Domain Layer (Pure logic, organized by subdomain)
│   ├── shared/           # 共通ドメイン
│   │   ├── entities/     # (Word.ts等 - private constructor + factory)
│   │   ├── vo/           # Value Objects (Immutable)
│   │   └── repositories/ # Interface definition (IWordRepository.ts)
│   ├── circles/
│   │   ├── entities/     # Circle.ts
│   │   └── repositories/ # ICircleRepository.ts
│   └── practice/
│       ├── vo/           # SentencePattern.ts
│       ├── services/     # Domain Services (複雑な計算・生成ロジック)
│       └── spec/         # Specification Pattern (PublishablePatternSpec.ts等)
│
├── infrastructure/       # Infrastructure Layer (Technical details)
│   ├── prisma/           # Prisma client & Schema logic
│   └── repositories/     # Repository implementations (PrismaWordRepository.ts等)
│
├── components/           # Presentation Layer (Common components)
│   └── ui/               # shadcn/ui components (Button.tsx, Input.tsx等)
│
├── lib/                  # Shared utilities & configurations (prisma.ts等)
└── types/                # Project-wide type definitions
```

---

## 4. ドメインモデル実装原則 (Domain implementation)

### 4.1 エンティティ (Entities)
- **識別子**: 必ず一意なIDを持つ。
- **privateコンストラクタ**: 直接の `new` を禁止し、不正な状態の生成を防ぐ。
- **ファクトリメソッド**:
    - `create()`: 新規作成用。IDの自動生成や初期状態（例：`isPublished: false`）の保証を行う。
    - `reconstruct()`: データベースからの復元用。保存されている値をそのまま詰め込む。
- **不変条件の保護**: インスタンス生成時およびメソッド実行時に検証を行い、常にビジネスルールに適合した状態を維持する。
- **カプセル化**: プロパティは原則 `private`。外部への公開は `get` アクセサを用い、配列やオブジェクトの場合は防御的コピー（`[...this._items]` 等）を返す。

### 4.2 値オブジェクト (Value Objects)
- **不変性 (Immutable)**: 一度生成したら状態を変えない。変更時は常に新しいインスタンスを返す。
- **等価性**: IDではなく、保持する「値」そのもので同一性を判定する `equals()` メソッドを持つ。
- **自己検証**: 不正な値での生成を許可しない。

### 4.3 リポジトリ (Repositories)
- **インターフェース**: ドメイン層で定義し、永続化の詳細（SQL、NoSQL、API）を隠蔽する。
- **ドメインオブジェクトの入出力**: Application層、UI層とのやり取りは常にドメインエンティティを介する。Infrastructure層でデータモデル（Prismaの型等）からドメインモデルへ変換する。

### 4.4 仕様パターン (Specification Pattern)
- 複雑なビジネスルールや判定条件を `isSatisfiedBy(entity): boolean` として独立したクラスに抽出する。

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

---

## 6. 統合時の判断ガイドライン (Integration Guidelines)

1. **Server Actionsの実装**: `features/*/actions/*.ts` に配置し、必ず `"use server"` を付与。入力を Zod で検証後、ドメイン層を呼び出す。
2. **Server/Client Componentの使い分け**: `app/` 直下は原則 Server Component。状態管理（useState/useEffect）が必要な UI 要素は `features/*/components/` 内で Client Component として抽出し、`'use client'` を宣言する。
3. **バリデーションの場所**:
    - **形式検証**: Application層（Zod）で行い、不正な形式のデータをドメイン層に渡さない。
    - **ビジネスルール検証**: Domain層（Entity/VO）で行い、ドメインの整合性を守る。

---

## 7. 更新履歴
- 2025-12-22: Zenn記事に基づき全体構成を刷新。ディレクトリ構成とドメイン実装原則を詳細化。
