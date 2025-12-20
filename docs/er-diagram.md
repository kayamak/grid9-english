# ER Diagram

## User & Circle

```mermaid
erDiagram
    User ||--o{ Circle : "owns"
    User }|..|{ Circle : "is member of"

    User {
        String id PK
        String name
        String type
    }

    Circle {
        String id PK
        String name
        String ownerId FK
    }
```

## Word Tables (Practice Mode)

```mermaid
erDiagram
    VerbWord {
        String id PK
        String value UK "unique"
        String label
        String verbType "do | be"
        String sentencePattern "SV | SVO | SVC | null"
        Int sortOrder
    }

    NounWord {
        String id PK
        String value UK "unique"
        String label
        String numberForm "none | a | an | plural"
        Int sortOrder
    }

    AdjectiveWord {
        String id PK
        String value UK "unique"
        String label
        Int sortOrder
    }
```

## Notes

- **VerbWord**: 動詞データ（Do動詞とBe動詞）
- **NounWord**: 名詞データ（目的語・補語として使用）
- **AdjectiveWord**: 形容詞データ（Be動詞の補語として使用）
- これらのテーブルは独立しており、リレーションはありません
