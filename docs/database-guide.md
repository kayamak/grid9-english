# データベース管理ガイド (Local vs Staging)

このプロジェクトでは、開発フェーズに合わせて **Local (SQLite)** と **Staging (Turso Cloud)** の2つのデータベース環境を使い分けます。

## 目次

1. [Local 環境 (開発・オフライン)](#1-local-環境-開発オフライン)
2. [Staging 環境 (Turso Cloud)](#2-staging-環境-turso-cloud)
3. [共通: Prismaスキーマ管理](#共通-prismaスキーマ管理)
4. [トラブルシューティング](#トラブルシューティング)

---

## 1. Local 環境 (開発・オフライン)

ローカルマシン上の SQLite ファイルを使用して開発を行うデフォルトの環境です。

### 特徴
- **コマンド**: `npm run dev`
- **DBエンジン**: SQLite
- **保存先**: `project_root/prisma/dev.db`
- **メリット**: セットアップ不要、オフライン動作、高速なスキーマ変更。

### プロジェクト設定 (`.env`)
```env
# ローカルDB設定
# SQLite の場合、相対パスは「schema.prisma ファイルがあるディレクトリ」からの相対パスとなります。
DATABASE_URL="file:./dev.db"
```
> **パスの解決について**: 
> `schema.prisma` は `prisma/` フォルダにあるため、上記の設定はプロジェクトルートから見た **`prisma/dev.db`** を指します。ルートディレクトリに `dev.db` が存在していても、Prisma はそれを使用しません。

### 基本操作
- **Prisma クライアント生成**: `npx prisma generate`
- **DBリセット & シード**: `npx prisma db push --force-reset && npx prisma db seed`
- **データ確認 (Prisma Studio)**: `npx prisma studio`

---

## 2. Staging 環境 (Turso Cloud)

Turso (LibSQL) を使用した、本番に近いクラウドデータベース環境です。

### 特徴
- **コマンド**: `npm run stg`
- **DBエンジン**: Turso (LibSQL)
- **保存先**: Turso Cloud
- **メリット**: チーム間でのデータ共有、実データの確認、Next.js Edge Runtime との互換性テスト。

### プロジェクト設定 (`.env`)
`APP_ENV` は `.env` に設定せず、スクリプト (`npm run stg`) によって動的に注入されます。
```env
# Turso 接続情報
TURSO_DATABASE_URL="libsql://your-db-name.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"
```

### 基本操作
- **Turso CLI で接続**: `turso db shell grid9-english-db`
- **Staging へのシード実行**:
  ```bash
  DATABASE_URL=$TURSO_DATABASE_URL TURSO_AUTH_TOKEN=$TURSO_AUTH_TOKEN npx tsx prisma/seed.ts
  ```

### Turso でのテーブル管理
Turso 環境では `prisma db push` は使用せず、手動またはスキーマから SQL を生成して反映させます。
- **テーブル作成例**:
  ```bash
  turso db shell grid9-english-db "CREATE TABLE IF NOT EXISTS VerbWord (...);"
  ```
- **データ確認**:
  ```bash
  turso db shell grid9-english-db "SELECT * FROM VerbWord;"
  ```

---

## 共通: Prismaスキーマ管理

スキーマの変更は常に `prisma/schema.prisma` で行います。

### スキーマ変更のワークフロー
1. `prisma/schema.prisma` を編集。
2. `npx prisma generate` を実行してクライアントを更新。
3. **Local**: `npx prisma db push` で反映。
4. **Staging**: `turso db shell` で SQL を実行して反映（または migration ファイルの適用）。

### モデル構成例
```prisma
model VerbWord {
  id              String  @id @default(cuid())
  value           String  @unique
  label           String
  verbType        String  // "do" | "be"
  sentencePattern String? // "SV" | "SVO" | "SVC"
  pastForm        String?
  sortOrder       Int
}
```

---

## トラブルシューティング

### Local
- **`dev.db` が壊れた**: ファイルを削除して `npx prisma db push` を再実行。
- **型が古い**: `npx prisma generate` を実行。

### Staging (`npm run stg`)
- **接続エラー**: `.env` の `TURSO_AUTH_TOKEN` が正しいか確認（`turso db tokens create` で再発行可能）。
- **`prisma.verbWord is undefined`**: `npm run stg` を使用しているか確認（`npm run dev` では Local を見てしまいます）。
- **テーブルが存在しない**: Turso shell で `CREATE TABLE` が実行されているか確認。

---

## 参考リンク
- [Turso Docs](https://docs.turso.tech/)
- [Prisma Docs](https://www.prisma.io/docs)
