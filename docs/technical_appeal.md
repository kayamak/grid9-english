# 技術アピール：ドメイン駆動設計と徹底したテストで実現した英語学習 RPG アプリ

## 技術アピール（要約）

ドラゴンクエスト風 RPG UI の英語学習アプリを、Next.js 16（App Router / Static Export）＋ Prisma（libSQL アダプター）＋ DDD（Entity / Value Object / Specification / Repository）で設計・実装。Zustand による状態管理とカスタムフック群でゲームループを構築し、Vitest（49 ファイル）＋ Playwright E2E（4 ファイル）による自動テストと GitHub Actions CI/CD で品質を担保しています。一人で設計・実装・運用まで完結させました。

---

## システム構成と運用コスト

| レイヤー             | 使用技術                                     | 運用コスト     |
| :------------------- | :------------------------------------------- | :------------- |
| **Hosting**          | GitHub Pages (Static Export)                 | ¥0 (Free)      |
| **Framework**        | Next.js 16 / App Router / Static Export      | ¥0             |
| **Database**         | SQLite (libSQL) / Prisma 6 (Driver Adapters) | ¥0             |
| **State Management** | Zustand 5                                    | ¥0             |
| **Animation**        | Framer Motion 12                             | ¥0             |
| **Styling**          | Tailwind CSS 4                               | ¥0             |
| **Testing**          | Vitest 4 + Testing Library + Playwright      | ¥0             |
| **CI/CD**            | GitHub Actions                               | ¥0 (Free Tier) |
| **Total**            |                                              | **¥0 / 月**    |

---

## 技術的なハイライト

### 1. ドメイン駆動設計（DDD）による英文生成エンジン

**課題:** 英文の文型（SV / SVC / SVO / SVOO / SVOC）×時制（過去・現在・未来）×人称（6種）×肯定・否定・疑問の組み合わせは数百パターンに及び、ロジックが容易に混沌とします。

**解決策:** DDD の戦術的パターンを適用し、ドメインの複雑さを構造で管理しました。

```
src/domain/practice/
├── entities/
│   ├── QuestSession.ts      … 不変（Immutable）なセッション集約
│   └── SentenceDrill.ts     … 英文ドリルのエンティティ
├── vo/
│   └── SentencePattern.ts   … 文型を表す値オブジェクト（不変・自己検証）
├── spec/
│   └── SentencePatternSpecification.ts  … be動詞×SVO制約の仕様パターン
├── services/
│   └── PatternGenerator.ts  … 英文生成のドメインサービス（371行）
├── repositories/
│   └── ISentenceDrillRepository.ts      … リポジトリインタフェース
└── types.ts                 … VerbType / Subject / Tense 等の型定義
```

**ポイント:**

- **Value Object（SentencePattern）** がビジネスルールをカプセル化。`create()` 時に `SentencePatternSpecification` で不変条件（be動詞はSVO/SVOO/SVOCを取れない等）を自動検証します。
- **Entity（QuestSession）** は完全にイミュータブル。`submitAnswer()` や `nextDrill()` は常に新しいインスタンスを返し、状態遷移のバグを防ぎます。

```typescript
// QuestSession: イミュータブルな状態遷移
export class QuestSession {
  private constructor(
    private readonly _level: number,
    private readonly _drills: SentenceDrill[],
    private readonly _results: AnswerResult[],
    private readonly _currentIndex: number,
    private readonly _status: QuestStatus
  ) {}

  submitAnswer(isCorrect: boolean): QuestSession {
    const newResults = [...this._results];
    newResults[this._currentIndex] = isCorrect ? 'correct' : 'wrong';
    return new QuestSession(
      this._level,
      this._drills,
      newResults,
      this._currentIndex,
      this._status
    );
  }
}
```

### 2. レイヤードアーキテクチャによる保守性の確保

フルスタック構成でもコードの見通しを保つため、明確な責務分離を設計しました。

```
src/
├── app/                … ルーティング・ページ（Next.js App Router）
├── domain/             … ドメイン層（純粋なビジネスロジック、外部依存なし）
│   ├── practice/       … 練習ドメイン（Entity / VO / Spec / Service）
│   └── shared/         … 共有ドメイン（Word エンティティ等）
├── infrastructure/     … インフラ層（外部技術への依存）
│   ├── prisma/         … Prisma クライアント管理
│   └── repositories/   … リポジトリ実装（Prisma による永続化）
├── features/           … 機能層（UI・フック・アクション）
│   ├── home/           … ホーム画面
│   └── practice/       … 練習画面
│       ├── components/ … UI コンポーネント群
│       ├── hooks/      … カスタムフック群（状態・ロジック）
│       └── actions/    … Server Actions（データ取得）
├── components/         … 共通 UI コンポーネント
└── lib/                … ユーティリティ
```

**ポイント:** Domain 層は外部ライブラリに一切依存せず、純粋な TypeScript クラスのみで構成。Repository インターフェース（`ISentenceDrillRepository`、`IWordRepository`）を Domain 層に定義し、Infrastructure 層の `PrismaSentenceDrillRepository`・`PrismaWordRepository` が実装する**依存性逆転**を適用しています。

### 3. Zustand × カスタムフックによるゲームループ設計

**課題:** RPG 風バトル画面の状態管理（練習状態・バトルアニメーション・タイマー・BGM・クエスト進行）が複雑に絡み合い、単一の状態管理では破綻します。

**解決策:** 関心ごとにストアとフックを分離し、合成パターンで統合しました。

```
hooks/
├── usePracticeStore.ts       … 練習状態の中央ストア（Zustand）
├── useBattleStore.ts         … バトルアニメーション状態（Zustand）
├── usePractice.ts            … ライフサイクル管理フック（初期化・正解判定・遷移）
├── usePracticeActions.ts     … 操作系アクション
├── usePracticeDerivedState.ts … 派生状態の計算
├── useTimerManager.ts        … タイマー制御
├── useBGMManager.ts          … BGM 再生管理
└── useSounds.ts              … 効果音管理
```

**ポイント:** `useBattleStore` でヒーローのアタック → 画面シェイク → フラッシュ → モンスター撃破を `setTimeout` チェーンで時間差制御し、RPG 風の演出を実現しています。

```typescript
// バトルストア: アニメーション時間差制御
triggerVictoryEffect: () => {
  set({ heroAction: 'attack' });
  setTimeout(() => {
    set({ isScreenShaking: true, isScreenFlashing: true });
    set({ monsterState: 'defeated', showVictoryEffect: true });
    setTimeout(() => set({ isScreenFlashing: false }), 150);
    setTimeout(() => set({ isScreenShaking: false }), 500);
  }, 150);
};
```

### 4. 自動テストによる品質担保

Vitest + Testing Library を用いた自動テストを整備し、継続的な品質担保を実現しています。

| テスト種別               | 対象                                                                                              | 件数            |
| :----------------------- | :------------------------------------------------------------------------------------------------ | :-------------- |
| **ドメインテスト**       | Entity / VO / Spec / Service（QuestSession, SentenceDrill, SentencePattern, PatternGenerator 等） | 7 ファイル      |
| **コンポーネントテスト** | UI コンポーネント（PracticeContainer, BattleArea, AnswerArea, NineKeyPanel 等）                   | 18 ファイル     |
| **フックテスト**         | カスタムフック（usePractice, usePracticeStore, useBattleStore, useTimer 等）                      | 9 ファイル      |
| **インフラテスト**       | Repository / Prisma Client                                                                        | 3 ファイル      |
| **Server Action テスト** | データ取得アクション（drills, words）                                                             | 2 ファイル      |
| **E2E テスト**           | Playwright（ナビゲーション, オンボーディング, 練習画面）                                          | 4 ファイル      |
| **その他**               | ページ・ユーティリティ                                                                            | 10 ファイル     |
| **合計**                 |                                                                                                   | **53 ファイル** |

### 5. 堅牢な CI/CD パイプライン

GitHub Actions による自動デプロイパイプラインを構築し、以下の品質ゲートを設けています。

```
コード Push → npm ci → Prisma Client 生成 → DB セットアップ（push + seed）
→ Playwright ブラウザインストール → Unit Tests（Vitest）→ E2E Tests（Playwright）
→ Build（Static Export） → GitHub Pages デプロイ
```

**特筆すべき実装:**

- **ビルド前テスト必須:** Unit テスト・E2E テストの両方がパスしない限りデプロイに進めない品質ゲート
- **DB 自動準備:** CI 環境で `prisma db push` + `seed.ts` を実行し、テスト用データベースを自動セットアップ
- **Static Export:** `next build` で完全な静的サイトを生成し、GitHub Pages に `0 円` でホスティング

---

## 成果

| 観点       | 成果                                                                                                               |
| :--------- | :----------------------------------------------------------------------------------------------------------------- |
| **コスト** | Static Export × GitHub Pages により**月額運用コスト ¥0** を達成                                                    |
| **設計力** | DDD の戦術的パターン（Entity / VO / Specification / Repository）を適用し、英文生成の複雑なドメインロジックを構造化 |
| **保守性** | Domain / Infrastructure / Features の3層アーキテクチャと依存性逆転により、変更影響を局所化                         |
| **品質**   | 53 ファイルの自動テスト（Vitest + Playwright）+ CI/CD パイプラインで継続的な品質担保を実現                         |
| **UX**     | Framer Motion + Zustand による RPG 風バトルアニメーションでゲーミフィケーションを実現                              |

DDD の設計原則を適用した英文生成エンジンと、RPG 風ゲーミフィケーション UI を組み合わせ、技術的な深さ（ドメインモデリング・不変条件の自動検証・イミュータブル状態管理）と実用性（コストゼロ・テスト品質・エンゲージメント）を両立したアーキテクチャを実現しました。
