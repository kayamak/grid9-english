# システム仕様書（コア機能）

## 1. システム概要

### 1.1 システム名称

**Grid9English** (グリッド・ナイン・イングリッシュ)

### 1.2 目的

**動詞の種類（Do/Be）**の選択、主語の**複数形**を含む文頭表現の**パターン**を、**9マスグリッド**と**ピクトグラム**を用いて視覚的かつ直感的に理解・習得することを目的とします。

### 1.3 ターゲット

初級〜中級レベルの英語学習者、特に英文の構造パターン（主語と動詞の組み合わせ）を苦手とする学習者。

---

## 2. アーキテクチャ設計方針

本プロジェクトは、保守性、テスト容易性、およびビジネスロジックの独立性を担保するため、**クリーンアーキテクチャ (Clean Architecture)** および **ドメイン駆動設計 (DDD)** の原則を採用します。

### 2.1 アーキテクチャ階層構造

システムは以下の同心円状のレイヤーで構成され、依存関係は常に「外側から内側」に向かうものとします。内側のレイヤー（Domain）は外側のレイヤー（Infrastructure, UI）について何も知りません。

1.  **Domain Layer (Enterprise Business Rules)**
    *   **役割**: アプリケーションのコアとなるビジネスロジックとルールをカプセル化します。フレームワークやUI、データベースの詳細には依存しません。
    *   **構成要素**:
        *   **Entities / Aggregates**: ビジネスルールと状態を持つオブジェクト。
        *   **Value Objects**: 計測や記述のための不変オブジェクト（例: `SentencePattern`, `Tense`）。
        *   **Repository Interfaces**: データの永続化・取得のための抽象インターフェース。

2.  **Application Layer (Application Business Rules)**
    *   **役割**: ユーザーのユースケースを実現するための進行役です。ドメインオブジェクトを操作し、入出力を変換します。
    *   **構成要素**:
        *   **Use Cases (Interactors)**: クライアントからの要求を受け取り、ドメイン層を呼び出して処理を行います（例: `GenerateSentenceUseCase`）。

3.  **Interface Adapters Layer**
    *   **役割**: 外部の世界（Web, DB等）と内部の層（Use Cases, Entities）との間のデータ変換を行います。
    *   **構成要素**:
        *   **Presenters / Controllers**: React Server Components / Client Components がこれに該当します。
        *   **Repository Implementations**: ドメイン層で定義されたリポジトリの実装（Prisma等）。

4.  **Frameworks & Drivers Layer (Infrastructure)**
    *   **役割**: 詳細な技術的要素です。
    *   **構成要素**: Next.js, Turso (SQLite), React, Tailwind CSS。

### 2.2 ドメインモデル設計 (DDD)

中核となるドメイン概念は以下の通りです。

#### Grammar Context (文法コンテキスト)

*   **SentencePattern (Value Object)**: 文の構造を定義する値オブジェクト。
    *   属性: `VerbType` (Do/Be), `FiveSentencePattern` (SV/SVC/SVO...), `SentenceType` (Positive/Negative/Question), `Subject` (Person/Number), `Tense` (Past/Present/Future).
    *   振る舞い: 指定された属性の組み合わせが文法的に有効かどうかの整合性チェック。

*   **Word (Entity)**: 単語を表すエンティティ。
    *   属性: `WordId`, `Spelling`, `PartOfSpeech` (Verb, Noun, Adjective...), `Attributes` (Countable/Uncountable, Transitive/Intransitive).

#### Practice Context (練習コンテキスト)

*   **PracticeSession (Aggregate Root)**: ユーザーの練習セッションを管理する集約ルート。
    *   現在の問題、解答状態、スコアなどを整合性を保ちながら管理します。

---

## 3. システム構成要素と責務

### 3.1 プレゼンテーション層 (UI)

*   **VerbTypeSelector**: `verbType` の状態変更をユーザーアクションとして受け取り、アプリケーション層へ伝達します。
*   **NineKeyPanel**: 9マスグリッドの描画を担当。ドメインモデルの状態（`Subject`, `Tense`, `SentenceType`）をピクトグラムとして可視化します。
*   **Active Cell Logic**: ドメインルールに基づき、UI上でどのセルを強調表示するかを決定する表示ロジック（Presenterの役割）。

### 3.2 アプリケーション層 (Use Case)

*   **GeneratePatternUseCase**:
    *   入力: ユーザーが選択した文法要素（Props）。
    *   処理: ドメインルールに基づいて妥当な英文パターンを生成する。
    *   出力: 生成された英文文字列と、UI表示用の状態。

### 3.3 インフラストラクチャ層 (Data Access)

*   **WordRepository**: データベース（Turso）から単語定義を取得し、ドメインの `Word` エンティティとして再構成して返却します。

---

## 4. コアデータモデル定義

各英文のパターンは、ドメイン層の **Value Object** として定義され、以下の属性を持ちます。

| 属性名 | 型 (Domain Type) | 許容される値 | 説明 |
| :--- | :--- | :--- | :--- |
| **`verbType`** | `VerbType` | `do`, `be` | 文頭表現が **Do動詞** か **Be動詞** か。 |
| **`fiveSentencePattern`** | `FiveSentencePattern` | `SV`, `SVC`, `SVO`, `SVOO`, `SVOC` | 第1〜第5文型。 |
| **`sentenceType`** | `SentenceType` | `positive`, `negative`, `question` | 文の形式（肯定、否定、疑問）。 |
| **`subject`** | `Subject` | `first_s`, `first_p`, `second`, `second_p`, `third_s`, `third_p` | 主語の人称と数。 |
| **`tense`** | `Tense` | `past`, `present`, `future` | 時制。 |

### 主語の分類とパネル表示記号

| Domain Value | UI Presentation | Panel Symbol |
| :--- | :--- | :--- |
| `first_s` | I | **1** |
| `first_p` | We | **11** |
| `second` | You | **2** |
| `second_p` | You | **22** |
| `third_s` | He, She, It | **3** |
| `third_p` | They | **33** |

---

## 5. コア機能仕様：9マスパネル

### 5.1 構造とピクトグラム

パネルは3行3列のグリッド形式で構成され、ドメインの状態を以下の通り可視化します。

| 行（要素） | 列1 | 列2 | 列3 |
| :---: | :---: | :---: | :---: |
| **文の種類** | 否定文 (`negative`): $\text{X}$ | 肯定文 (`positive`): $\text{O}$ | 疑問文 (`question`): $\text{?}$ |
| **主語** | 二人称: 2 | 一人称: 1 / 11 | 三人称: 3 / 33 |
| **時制** | 過去形 (`past`): ↩ | 現在形 (`present`): $\text{O}$ | 未来形 (`future`): ↪ |

### 5.2 表示ロジック

`NineKeyPanel` は、ドメイン状態を反映する **Pure Component** です。
ビジネスルールの状態遷移（例: 主語マスをクリックして単数/複数を切り替えるロジック）は、UI内部ではなく、カスタムフックまたはドメインサービス（`SubjectRotationService`等）に委譲されるべきです。
