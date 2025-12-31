# ドキュメント索引

このディレクトリには、Grid9 Englishプロジェクトの技術ドキュメントが含まれています。

## 📚 ドキュメント一覧

### データベース関連

- **[データベース管理ガイド](./database-guide.md)** 📖
  - Turso & Prismaの詳細な使い方
  - スキーマ管理、マイグレーション、シード
  - トラブルシューティング

- **[データベースチートシート](./database-cheatsheet.md)** ⚡
  - よく使うコマンドのクイックリファレンス
  - Turso SQLクエリ集
  - Prismaコマンド集

- **[ER図](./er-diagram.md)** 🗂️
  - データベーススキーマの可視化
  - テーブル構造の概要

### 仕様書

- **[specifications/](./specifications/)** 📋
  - 機能仕様書
  - 練習モードの仕様

### シーケンス図

- **[sequence-diagrams/](./sequence-diagrams/)** 🔄
  - システムフローの可視化
  - 各機能のシーケンス図

---

## 🚀 クイックスタート

### データベース操作

#### 🏠 ローカル環境 (SQLite)

標準の `DATABASE_URL` (`file:./dev.db`) を使用します。

```bash
# Prismaクライアント生成
npx prisma generate

# マイグレーション実行
npx prisma migrate dev

# シード実行
npx tsx prisma/seed.ts

# データ確認
npx prisma studio
```

#### ☁️ ステージング環境 (Turso)

ステージング環境への操作を行う場合は、`DATABASE_URL` を `TURSO_DATABASE_URL` で上書きします。

```bash
# シード実行 (Staging DB)
DATABASE_URL=$TURSO_DATABASE_URL TURSO_AUTH_TOKEN=$TURSO_AUTH_TOKEN npx tsx prisma/seed.ts

# Turso CLI でのデータ確認
turso db shell grid9-english-db "SELECT * FROM AdjectiveWord;"
```

### 新しいテーブルの追加

1. `prisma/schema.prisma` にモデルを追加
2. `npx prisma generate` でクライアント生成
3. Tursoでテーブル作成（SQLを直接実行）
4. `prisma/seed.ts` にシードデータを追加
5. `npx tsx prisma/seed.ts` でシード実行

詳細は [データベース管理ガイド](./database-guide.md) を参照してください。

---

## 📝 ドキュメント更新ガイドライン

### ドキュメントを更新すべきタイミング

- ✅ 新しいテーブルやモデルを追加したとき
- ✅ データベーススキーマを変更したとき
- ✅ 新しい機能を実装したとき
- ✅ 重要な設定変更を行ったとき

### 更新すべきドキュメント

| 変更内容 | 更新すべきドキュメント |
|---------|---------------------|
| テーブル追加 | ER図、データベースガイド |
| 機能追加 | specifications/ 配下の仕様書 |
| よく使うコマンド追加 | チートシート |
| システムフロー変更 | シーケンス図 |

---

## 🛠️ 便利なツール

### Mermaid図の編集

- [Mermaid Live Editor](https://mermaid.live/)
- ER図やシーケンス図をリアルタイムプレビュー

### Prisma Studio

```bash
npx prisma studio
```

データベースをGUIで確認・編集できます。

---

## 📞 サポート

ドキュメントに関する質問や改善提案は、プロジェクトのIssueで受け付けています。
