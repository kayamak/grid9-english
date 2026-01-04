# Fetch Drills Sequence

## シーケンス図

```mermaid
sequenceDiagram
    participant PageComp as PracticePage (Server Component)
    participant Action as ServerActions (drills.ts)
    participant Container as PracticeContainer (Client)
    participant Hook as usePractice (Hook)
    participant Session as QuestSession (Domain Entity)

    Note over PageComp: Server Side Rendering

    PageComp->>Action: getSentenceDrills()
    Action-->>PageComp: Drill[] returns

    PageComp->>Container: Render <PracticeContainer allDrills={...} />
    Container->>Hook: usePractice(..., allDrills)

    Hook->>Hook: useEffect [isQuestMode, currentLevel, allDrills]

    alt isQuestMode (クエストモード)
        Hook->>Hook: 現在のレベルに基づいてドリルをフィルタリング
        Note right of Hook: レベル1,4,7: DO_SV<br/>レベル2,5,8: DO_SVO<br/>レベル3,6,9: BE_SVC

        alt Level <= 3
            Hook->>Hook: 先頭10件を取得
        else Level > 3
            Hook->>Hook: ランダムにシャッフルして10件取得
        end

        Hook->>Session: start(currentLevel, selectedDrills)
        Session-->>Hook: questSession (新規セッション開始)

        Hook->>Hook: setDrills(selectedDrills)
        Hook->>Hook: setTimeLeft(session.getTimeLimit())
    else isFreeMode or Others
        Hook->>Hook: Pattern指定があればフィルタリング
        Hook->>Hook: setDrills(filteredDrills)
    end

    Hook-->>Container: drills, questSession, timeLeft を提供
    Container->>Container: UIレンダリング
```

## 詳細説明

このシーケンス図は、練習問題（Drill）のデータ取得から、それがクライアントサイドでどのように初期処理され、プレイ可能な状態になるかを示しています。

### 1. データ取得 (Server Side)

Next.jsのApp Routerを使用しているため、`PracticePage`（サーバーコンポーネント）でデータの取得が行われます。
`getSentenceDrills` アクションを通じて、データベースや定数ファイルから全ての問題データを取得し、それを `PracticeContainer` クライアントコンポーネントにプロップスとして渡します。

### 2. 初期化とフィルタリング (Client Side)

`PracticeContainer` は受け取ったドリルデータを `usePractice` フックに渡します。
フック内では、現在のモード（クエストモードかトレーニングモードか）とプレイヤーのレベルに応じて、適切な問題セットを構築します。

- **クエストモード:**
  - レベルに応じた文法パターン（SV, SVO, SVCなど）でフィルタリングします。
  - レベルが上がると、ランダムな出題になるロジックが含まれています（Level > 3）。
  - `QuestSession.start` を呼び出し、ゲームセッション（正解数管理や進行管理を行うオブジェクト）を作成します。
- **フリーモード:**
  - ユーザーが指定したパターン、あるいは全件表示など、自由な設定でリストを作成します。

### 3. セッション開始

クエストモードの場合、フィルタリングされた10問を用いてセッションが開始され、残り時間（TimeLimit）もレベルに応じて設定されます。これにより、ユーザーは即座にプレイを開始できます。
