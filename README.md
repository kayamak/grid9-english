# Grid9 English

Grid9 Englishプロジェクトへようこそ。このプロジェクトは、英語学習を支援するためのWebアプリケーションです。

## 📖 ドキュメント構成

プロジェクトの詳細な仕様や技術的なガイドは、`docs/`ディレクトリ配下の各ファイルにまとめられています。

### 📂 docs/ (ルート)

*   **[README.md](./docs/README.md)**
    *   ドキュメントの全体像と、ドキュメント更新の際のガイドラインが記載されているインデックスファイルです。
*   **[database-guide.md](./docs/database-guide.md)**
    *   データベース（Turso & Prisma）のセットアップ、マイグレーション、シードデータの投入方法についてのガイドです。
*   **[database-cheatsheet.md](./docs/database-cheatsheet.md)**
    *   日常的な開発で使用するデータベース操作のコマンド集、およびSQLクエリのクイックリファレンスです。
*   **[er-diagram.md](./docs/er-diagram.md)**
    *   Mermaid形式で記述されたデータベースのER図です。テーブル間のリレーションを確認できます。

### 📂 docs/specifications/ (仕様書)

各機能の詳細な振る舞いや要件が記載されています。

*   **[core_specicifation.md](./docs/specifications/core_specicifation.md)**
    *   プロジェクト全体のコアとなる仕様や設計方針が記載されています。
*   **[practice_mode_specicifation.md](./docs/specifications/practice_mode_specicifation.md)**
    *   英作文練習モードの具体的な動作仕様、UI構成、および実装上の考慮事項が記載されています。

### 📂 docs/sequence-diagrams/ (シーケンス図)

システムの処理フローを可視化しています。

---

## 🚀 開発の進め方

詳細は各ドキュメントを参照してください。

1.  **環境構築**: `npm install`
2.  **DBセットアップ**: [データベース管理ガイド](./docs/database-guide.md) に従い、TursoとPrismaを設定します。
3.  **サーバー起動**: `npm run dev`

ドキュメントを更新した際は、適宜この `README.md` の記述も見直してください。
