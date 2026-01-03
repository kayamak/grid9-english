# シーケンス図一覧

このドキュメントは、プロジェクト内のすべてのシーケンス図へのリンクと概要をまとめたものです。
アプリケーションの実行フロー順に記載しています。

## Practices (練習・ドリル機能)

以下の図は、練習（Practice）およびドリル機能の中核となるロジックフローを示しています。

1. **[初期データ取得シーケンス (Fetch Initial Data Sequence)](./practices/fetchInitialData.md)**
   - **実行タイミング:** ページロード時
   - **概要:** 単語データ（名詞、動詞など）の一括取得と、ドメインエンティティ（Wordオブジェクト）への再構築フローを説明します。
   - **主要コンポーネント:** `Word` (Entity), `ServerActions`, `PracticeContainer`

2. **[ドリル取得シーケンス (Fetch Drills Sequence)](./practices/fetchDrills.md)**
   - **実行タイミング:** ページロード時 (初期データ取得と並行または直後)
   - **概要:** サーバーからドリルデータを取得し、クライアント側でモード（クエスト/フリー）に応じてフィルタリングや初期化を行う流れを示します。
   - **主要コンポーネント:** `ServerActions`, `PracticeContainer`, `QuestSession`

3. **[英文生成シーケンス (Generate Pattern Sequence)](./practices/generatePattern.md)**
   - **実行タイミング:** ユーザー操作時 (主語・動詞などの変更)
   - **概要:** ユーザーが選択した文法オプションに基づいて、英文がどのように動的に生成されるかのロジックを説明します。
   - **主要コンポーネント:** `usePractice`, `PatternGenerator`

4. **[正誤判定シーケンス (Answer Verification Sequence)](./practices/answerVerification.md)**
   - **実行タイミング:** 英文生成直後 (リアルタイム判定) / タイマー終了時
   - **概要:** リアルタイムの正誤判定プロセス、勝利時の演出、およびタイムオーバー（敗北）時のフロー詳細を説明します。
   - **主要コンポーネント:** `QuestSession`, `usePractice`, `PracticeBattleArea`
