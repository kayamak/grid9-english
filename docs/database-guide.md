# データベース管理ガイド (Turso & Prisma)

このプロジェクトでは、データベースとして **Turso** (libSQL)、ORMとして **Prisma** を使用しています。

## 目次

1. [環境構成](#環境構成)
2. [Prismaスキーマ管理](#prismaスキーマ管理)
3. [Tursoデータベース操作](#tursoデータベース操作)
4. [データシード](#データシード)
5. [よくある操作](#よくある操作)
6. [トラブルシューティング](#トラブルシューティング)

---

## 環境構成

### 必要な環境変数

`.env` ファイルに以下の環境変数を設定してください:

```env
DATABASE_URL="libsql://[your-database-name]-[your-username].aws-ap-northeast-1.turso.io"
TURSO_AUTH_TOKEN="your-auth-token-here"
TURSO_DATABASE_URL="libsql://[your-database-name]-[your-username].aws-ap-northeast-1.turso.io"
```

### 設定ファイル

- **`prisma/schema.prisma`**: Prismaスキーマ定義
- **`prisma.config.ts`**: Prisma設定（Turso接続情報）
- **`prisma/seed.ts`**: 初期データシード

---

## Prismaスキーマ管理

### スキーマファイルの場所

```
prisma/schema.prisma
```

### スキーマの基本構造

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model ExampleModel {
  id        String @id @default(cuid())
  value     String @unique
  label     String
  sortOrder Int
  
  @@index([sortOrder])
}
```

### 新しいモデルの追加手順

1. **`schema.prisma` にモデルを追加**

```prisma
model AdjectiveWord {
  id        String @id @default(cuid())
  value     String @unique
  label     String
  sortOrder Int
}
```

2. **Prismaクライアントを再生成**

```bash
npx prisma generate
```

3. **Tursoデータベースにテーブルを作成**

```bash
turso db shell grid9-english-db "CREATE TABLE IF NOT EXISTS AdjectiveWord (
    id TEXT PRIMARY KEY NOT NULL,
    value TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    sortOrder INTEGER NOT NULL
);"
```

4. **シードデータを追加（必要に応じて）**

`prisma/seed.ts` にデータを追加し、実行:

```bash
npx tsx prisma/seed.ts
```

---

## Tursoデータベース操作

### データベース一覧の確認

```bash
turso db list
```

### データベースシェルの起動

```bash
turso db shell grid9-english-db
```

### SQLクエリの直接実行

```bash
turso db shell grid9-english-db "SELECT * FROM AdjectiveWord;"
```

### テーブル一覧の確認

```bash
turso db shell grid9-english-db "SELECT name FROM sqlite_master WHERE type='table';"
```

### テーブル構造の確認

```bash
turso db shell grid9-english-db "PRAGMA table_info(AdjectiveWord);"
```

### データの挿入

```bash
turso db shell grid9-english-db "INSERT INTO AdjectiveWord (id, value, label, sortOrder) VALUES ('test123', 'beautiful', 'beautiful (美しい)', 6);"
```

### データの更新

```bash
turso db shell grid9-english-db "UPDATE AdjectiveWord SET label = 'beautiful (綺麗)' WHERE value = 'beautiful';"
```

### データの削除

```bash
turso db shell grid9-english-db "DELETE FROM AdjectiveWord WHERE value = 'beautiful';"
```

### テーブルの削除

```bash
turso db shell grid9-english-db "DROP TABLE IF EXISTS AdjectiveWord;"
```

---

## データシード

### シードファイルの場所

```
prisma/seed.ts
```

### シードの実行

```bash
npx tsx prisma/seed.ts
```

### シードデータの追加例

```typescript
console.log('Seeding AdjectiveWord data...');

const adjectiveWords = [
  { value: 'happy', label: 'happy (幸せ)', sortOrder: 1 },
  { value: 'sleepy', label: 'sleepy (眠い)', sortOrder: 2 },
  { value: 'angry', label: 'angry (怒った)', sortOrder: 3 },
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
```

### シードのベストプラクティス

- **`upsert`を使用**: 既存データを上書きせず、新規データのみ追加
- **`sortOrder`を設定**: UI表示順序を制御
- **`unique`制約**: 重複データを防ぐ

---

## よくある操作

### 1. 新しいテーブルを追加する

```bash
# 1. schema.prismaにモデルを追加
# 2. Prismaクライアントを再生成
npx prisma generate

# 3. Tursoにテーブルを作成
turso db shell grid9-english-db "CREATE TABLE IF NOT EXISTS YourTable (...);"

# 4. シードデータを追加（オプション）
npx tsx prisma/seed.ts
```

### 2. テーブルにカラムを追加する

```bash
# 1. schema.prismaのモデルを更新
# 2. Prismaクライアントを再生成
npx prisma generate

# 3. Tursoでカラムを追加
turso db shell grid9-english-db "ALTER TABLE YourTable ADD COLUMN newColumn TEXT;"
```

### 3. データを確認する

```bash
# 全データを表示
turso db shell grid9-english-db "SELECT * FROM AdjectiveWord ORDER BY sortOrder;"

# 件数を確認
turso db shell grid9-english-db "SELECT COUNT(*) FROM AdjectiveWord;"

# 条件付き検索
turso db shell grid9-english-db "SELECT * FROM AdjectiveWord WHERE value LIKE '%happy%';"
```

### 4. データをリセットする

```bash
# テーブルのデータを全削除
turso db shell grid9-english-db "DELETE FROM AdjectiveWord;"

# シードを再実行
npx tsx prisma/seed.ts
```

### 5. Prismaクライアントの使用（コード内）

```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });

// データ取得
const adjectives = await prisma.adjectiveWord.findMany({
  orderBy: { sortOrder: 'asc' },
});

// データ作成
await prisma.adjectiveWord.create({
  data: {
    value: 'excited',
    label: 'excited (興奮した)',
    sortOrder: 6,
  },
});

// データ更新
await prisma.adjectiveWord.update({
  where: { value: 'happy' },
  data: { label: 'happy (幸福)' },
});

// データ削除
await prisma.adjectiveWord.delete({
  where: { value: 'angry' },
});
```

---

## トラブルシューティング

### エラー: `Property 'adjectiveWord' does not exist on type 'PrismaClient'`

**原因**: Prismaクライアントが再生成されていない

**解決策**:
```bash
npx prisma generate
```

### エラー: `the URL must start with the protocol 'file:'`

**原因**: `prisma.config.ts`と`schema.prisma`の設定が不一致

**解決策**: 
- Tursoを使用する場合、`schema.prisma`では`provider = "sqlite"`のまま
- `prisma db push`の代わりに、`prisma generate`と手動でのSQL実行を使用

### エラー: `Authentication failed`

**原因**: Turso認証トークンが無効または期限切れ

**解決策**:
```bash
# 新しいトークンを生成
turso db tokens create grid9-english-db

# .envファイルのTURSO_AUTH_TOKENを更新
```

### データベース接続が遅い

**原因**: Tursoのリージョンが遠い

**解決策**:
- 最寄りのリージョンにデータベースを作成
- 本番環境では`aws-ap-northeast-1`（東京）を推奨

### シードが重複エラーになる

**原因**: `unique`制約違反

**解決策**:
- `upsert`を使用する
- または、既存データを削除してから再実行

```bash
turso db shell grid9-english-db "DELETE FROM AdjectiveWord;"
npx tsx prisma/seed.ts
```

---

## 参考リンク

- [Turso公式ドキュメント](https://docs.turso.tech/)
- [Prisma公式ドキュメント](https://www.prisma.io/docs)
- [Prisma + Turso統合ガイド](https://www.prisma.io/docs/orm/overview/databases/turso)
