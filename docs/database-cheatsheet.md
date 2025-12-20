# Turso & Prisma チートシート

このプロジェクトでよく使うTursoとPrismaのコマンド集です。

## 🚀 クイックスタート

```bash
# Prismaクライアント生成
npx prisma generate

# シード実行
npx tsx prisma/seed.ts

# データベース一覧
turso db list
```

---

## 📊 Turso コマンド

### データベース管理

```bash
# データベース一覧
turso db list

# データベース作成
turso db create [database-name]

# データベース削除
turso db destroy [database-name]

# データベース情報
turso db show [database-name]
```

### 認証トークン

```bash
# トークン作成
turso db tokens create grid9-english-db

# トークン一覧
turso db tokens list grid9-english-db

# トークン無効化
turso db tokens revoke grid9-english-db [token-name]
```

### データベースシェル

```bash
# シェル起動
turso db shell grid9-english-db

# SQLを直接実行
turso db shell grid9-english-db "SELECT * FROM AdjectiveWord;"

# 複数行SQL実行
turso db shell grid9-english-db "
  SELECT * FROM AdjectiveWord 
  WHERE sortOrder > 3 
  ORDER BY sortOrder;
"
```

---

## 🗄️ よく使うSQLクエリ

### テーブル情報

```bash
# テーブル一覧
turso db shell grid9-english-db "SELECT name FROM sqlite_master WHERE type='table';"

# テーブル構造確認
turso db shell grid9-english-db "PRAGMA table_info(AdjectiveWord);"

# インデックス一覧
turso db shell grid9-english-db "SELECT name FROM sqlite_master WHERE type='index';"
```

### データ操作

```bash
# 全データ取得（ソート付き）
turso db shell grid9-english-db "SELECT * FROM AdjectiveWord ORDER BY sortOrder;"

# 件数確認
turso db shell grid9-english-db "SELECT COUNT(*) FROM AdjectiveWord;"

# 条件付き検索
turso db shell grid9-english-db "SELECT * FROM AdjectiveWord WHERE value = 'happy';"

# LIKE検索
turso db shell grid9-english-db "SELECT * FROM AdjectiveWord WHERE label LIKE '%幸せ%';"

# データ挿入
turso db shell grid9-english-db "
  INSERT INTO AdjectiveWord (id, value, label, sortOrder) 
  VALUES ('abc123', 'excited', 'excited (興奮した)', 6);
"

# データ更新
turso db shell grid9-english-db "
  UPDATE AdjectiveWord 
  SET label = 'happy (幸福)' 
  WHERE value = 'happy';
"

# データ削除
turso db shell grid9-english-db "DELETE FROM AdjectiveWord WHERE value = 'excited';"

# 全データ削除
turso db shell grid9-english-db "DELETE FROM AdjectiveWord;"
```

---

## 🔧 Prisma コマンド

### クライアント生成

```bash
# Prismaクライアント生成
npx prisma generate

# 生成 + 型チェック
npx prisma generate && tsc --noEmit
```

### スキーマ管理

```bash
# スキーマのフォーマット
npx prisma format

# スキーマの検証
npx prisma validate

# スキーマの可視化（Prisma Studio）
npx prisma studio
```

### データベース操作

```bash
# スキーマをデータベースにプッシュ（開発時）
# ⚠️ Tursoでは動作しない場合があるため、手動SQL推奨
npx prisma db push

# マイグレーション作成
# ⚠️ Tursoでは動作しない場合があるため、手動SQL推奨
npx prisma migrate dev --name [migration-name]
```

---

## 🌱 シード操作

### シード実行

```bash
# シード実行
npx tsx prisma/seed.ts

# シード実行（詳細ログ）
DEBUG=* npx tsx prisma/seed.ts
```

### データリセット + シード

```bash
# 1. データ全削除
turso db shell grid9-english-db "DELETE FROM AdjectiveWord;"
turso db shell grid9-english-db "DELETE FROM NounWord;"
turso db shell grid9-english-db "DELETE FROM VerbWord;"

# 2. シード再実行
npx tsx prisma/seed.ts
```

---

## 📦 テーブル別クエリ

### VerbWord

```bash
# 全動詞取得
turso db shell grid9-english-db "SELECT * FROM VerbWord ORDER BY sortOrder;"

# Do動詞のみ
turso db shell grid9-english-db "SELECT * FROM VerbWord WHERE verbType = 'do';"

# SVO動詞のみ
turso db shell grid9-english-db "SELECT * FROM VerbWord WHERE sentencePattern = 'SVO';"

# Be動詞のみ
turso db shell grid9-english-db "SELECT * FROM VerbWord WHERE verbType = 'be';"
```

### NounWord

```bash
# 全名詞取得
turso db shell grid9-english-db "SELECT * FROM NounWord ORDER BY sortOrder;"

# 不可算名詞のみ
turso db shell grid9-english-db "SELECT * FROM NounWord WHERE numberForm = 'none';"

# 単数形（a）のみ
turso db shell grid9-english-db "SELECT * FROM NounWord WHERE numberForm = 'a';"

# 複数形のみ
turso db shell grid9-english-db "SELECT * FROM NounWord WHERE numberForm = 'plural';"
```

### AdjectiveWord

```bash
# 全形容詞取得
turso db shell grid9-english-db "SELECT * FROM AdjectiveWord ORDER BY sortOrder;"

# 特定の形容詞検索
turso db shell grid9-english-db "SELECT * FROM AdjectiveWord WHERE value = 'happy';"
```

---

## 🛠️ テーブル作成SQL

### AdjectiveWord

```sql
CREATE TABLE IF NOT EXISTS AdjectiveWord (
    id TEXT PRIMARY KEY NOT NULL,
    value TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    sortOrder INTEGER NOT NULL
);
```

### VerbWord

```sql
CREATE TABLE IF NOT EXISTS VerbWord (
    id TEXT PRIMARY KEY NOT NULL,
    value TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    verbType TEXT NOT NULL,
    sentencePattern TEXT,
    sortOrder INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS VerbWord_verbType_sentencePattern_idx 
ON VerbWord(verbType, sentencePattern);
```

### NounWord

```sql
CREATE TABLE IF NOT EXISTS NounWord (
    id TEXT PRIMARY KEY NOT NULL,
    value TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    numberForm TEXT NOT NULL,
    sortOrder INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS NounWord_numberForm_idx 
ON NounWord(numberForm);
```

---

## 🔍 デバッグ用クエリ

### データ整合性チェック

```bash
# 重複チェック
turso db shell grid9-english-db "
  SELECT value, COUNT(*) as count 
  FROM AdjectiveWord 
  GROUP BY value 
  HAVING count > 1;
"

# NULL値チェック
turso db shell grid9-english-db "
  SELECT * FROM AdjectiveWord 
  WHERE value IS NULL OR label IS NULL;
"

# sortOrder重複チェック
turso db shell grid9-english-db "
  SELECT sortOrder, COUNT(*) as count 
  FROM AdjectiveWord 
  GROUP BY sortOrder 
  HAVING count > 1;
"
```

### 統計情報

```bash
# 各テーブルの件数
turso db shell grid9-english-db "
  SELECT 
    'VerbWord' as table_name, COUNT(*) as count FROM VerbWord
  UNION ALL
  SELECT 
    'NounWord' as table_name, COUNT(*) as count FROM NounWord
  UNION ALL
  SELECT 
    'AdjectiveWord' as table_name, COUNT(*) as count FROM AdjectiveWord;
"
```

---

## 🚨 トラブルシューティング

### Prismaクライアントが見つからない

```bash
# 解決策
npx prisma generate
```

### 認証エラー

```bash
# 新しいトークンを生成
turso db tokens create grid9-english-db

# .envファイルを更新
# TURSO_AUTH_TOKEN="新しいトークン"
```

### スキーマ変更が反映されない

```bash
# 1. Prismaクライアント再生成
npx prisma generate

# 2. 開発サーバー再起動
# Ctrl+C で停止後、再度起動
npm run dev
```

### データが表示されない

```bash
# データ確認
turso db shell grid9-english-db "SELECT COUNT(*) FROM AdjectiveWord;"

# データがない場合、シード実行
npx tsx prisma/seed.ts
```

---

## 📚 関連ドキュメント

- [詳細ガイド](./database-guide.md)
- [ER図](./er-diagram.md)
