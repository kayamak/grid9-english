# プロジェクト構成とファイル説明

このドキュメントでは、Grid9 English プロジェクトのディレクトリ構成と主要なファイルについて説明します。

## 📂 プロジェクトルート

プロジェクトのルートディレクトリにある主要なファイルとディレクトリです。

```text
/
├── .env                    # 環境変数（DB接続情報など）
├── next.config.ts          # Next.jsの設定ファイル
├── package.json            # 依存パッケージとnpmスクリプト
├── tsconfig.json           # TypeScriptの設定
├── docs/                   # ドキュメント一式
├── prisma/                 # データベーススキーマとマイグレーション
├── public/                 # 静的ファイル（画像、音声）
├── scripts/                # ユーティリティスクリプト
└── src/                    # ソースコード本体
```

---

## 🏗️ ソースコード構成 (`src/`)

このプロジェクトは **Next.js 15** を使用し、**ドメイン駆動設計 (DDD)** と **レイヤードアーキテクチャ** を採用しています。
コードは機能単位（Feature-based）で整理されています。

### `src/app/` (Presentation Layer - Routing)
Next.js App Router のページコンポーネントとルーティング定義です。

- **`layout.tsx`**: アプリケーション全体のレイアウト（フォント読み込み、メタデータ設定）。
- **`page.tsx`**: トップページ（ホームメニュー）。
- **`globals.css`**: 全体のスタイル定義（Tailwind CSS ディレクティブ、カスタムCSS変数）。
- **`practice/`**: 練習モードのルート。
  - **`page.tsx`**: 練習モードのメインページ。

### `src/features/` (Application & Interface Layers)
機能ごとにUIコンポーネント、フック、サーバーアクション（Server Actions）をまとめたディレクトリです。

#### `src/features/practice/` (練習モード機能)
- **`actions/`**: Server Actions。クライアントからのリクエストを処理し、ドメイン層を呼び出します。
- **`components/`**: 練習モード固有のUIコンポーネント。
  - **`PracticeBattleArea.tsx`**: RPG風のバトル画面UI。
  - **`PracticeAnswerArea.tsx`**: 9マスグリッドや操作ボタン。
  - **`NineKeyPanel.tsx`**: 文頭パターンを選択する3x3グリッド。
- **`hooks/`**: 複雑なUIロジックを切り出したカスタムフック。
  - **`usePractice.ts`**: 練習モードの状態管理とゲームロジック（タイマー、正誤判定連携、音再生）。
- **`schemas/`**: 入力バリデーション用のZodスキーマ。

#### `src/features/home/` (ホーム機能)
- **`components/`**: ホーム画面固有のコンポーネント。
  - **`MainMenu.tsx`**: ドラクエ風コマンドメニュー。

### `src/domain/` (Domain Layer)
ビジネスロジックの中核です。フレームワーク（Next.js）やDB（Prisma）に依存しない純粋なTypeScriptコードで記述されます。

#### `src/domain/practice/` (練習サブドメイン)
- **`entities/`**: ドメインエンティティ。
  - **`SentenceDrill.ts`**: 文章ドリルの問題データ。
  - **`QuestSession.ts`**: クエストモードの進行状態（現在地、正解数）を管理。
- **`vo/`** (Value Objects): 値オブジェクト。
  - **`SentencePattern.ts`**: 文頭パターン（主語・動詞・時制の組み合わせ）のルールと振る舞い。
- **`services/`**: ドメインサービス。
  - **`PatternGenerator.ts`**: パターンと単語から英文を生成するロジック。
- **`spec/`**: 仕様オブジェクト。
  - **`SentencePatternSpecification.ts`**: パターンの妥当性検証ルール。

#### `src/domain/shared/` (共有カーネル)
- **`entities/`**: 全体で共有されるエンティティ。
  - **`Word.ts`**: 単語（動詞、名詞、形容詞）のエンティティ。活用形などを管理。

### `src/infrastructure/` (Infrastructure Layer)
データベースアクセスなどの詳細実装です。

- **`prisma/`**: Prismaクライアントの拡張や設定。
- **`repositories/`**: ドメイン層のリポジトリインターフェースの実装。
  - **`prisma-word-repository.ts`**: DBから単語データを取得し、ドメインエンティティに変換して返す。

### `src/components/` (Shared UI)
アプリケーション全体で使われる汎用UIコンポーネント。
- **`ui/`**: shadcn/ui などの基本コンポーネント（ボタン、ダイアログなど）。

### `src/lib/`
汎用ユーティリティ。
- **`utils.ts`**: Tailwindのクラス結合など。
- **`assets.ts`**: 画像や音声ファイルのパス管理。

---

## 🛠️ その他の主要ディレクトリ

### `prisma/` (Database)
データベース関連のファイルが含まれます。
- **`schema.prisma`**: データベーススキーマ定義（Prismaスキーマ）。
- **`seed.ts`**: 初期データ投入用のシードスクリプト。
- **`migrations/`**: DBマイグレーション履歴。
- **`dev.db`**: ローカル開発用のSQLiteデータベースファイル。

### `public/` (Static Assets)
静的ファイル置き場です。
- **`assets/`**:
  - **`backgrounds/`**: 背景画像（battle_bg.jpegなど）。
  - **`sounds/`**: 効果音・BGM（hero_attack.wav, drill_quest_bgm.mp3など）。
- **`fonts/`**: フォントファイル（DotGothic16など）。

### `scripts/` (Scripts)
開発支援や運用用のスクリプトです。
- **`init-staging.ts`**: ステージング環境の初期化スクリプト。
- **`generate_sound.py`**: 音声生成用スクリプト（Python）。
- **`optimize_monsters.py`**: 画像最適化用スクリプト。

### `docs/` (Documentation)
プロジェクトのドキュメントです。
- **`specifications/`**: 仕様書。
- **`sequence-diagrams/`**: シーケンス図。
- **`database-guide.md`**: DB管理ガイド。
