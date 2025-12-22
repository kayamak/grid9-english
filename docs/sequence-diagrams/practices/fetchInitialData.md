# Fetch Initial Word Data Sequence

```mermaid
sequenceDiagram
    participant Page as PracticePage
    participant Repo as ApiWordRepository
    participant API as API Routes (/api/*)
    participant DB as Database (via Prisma)

    Page->>Page: Component Mount (useEffect)
    
    par Fetch Nouns
        Page->>Repo: getNounWords()
        Repo->>API: GET /api/noun-words
        API->>DB: prisma.nounWord.findMany()
        DB-->>API: noun records
        API-->>Repo: JSON Data
        Repo-->>Page: Word[]
    and Fetch Verbs
        Page->>Repo: getVerbWords()
        Repo->>API: GET /api/verb-words
        API->>DB: prisma.verbWord.findMany()
        DB-->>API: verb records
        API-->>Repo: JSON Data
        Repo-->>Page: Word[]
    and Fetch Adjectives
        Page->>Repo: getAdjectiveWords()
        Repo->>API: GET /api/adjective-words
        API->>DB: prisma.adjectiveWord.findMany()
        DB-->>API: adjective records
        API-->>Repo: JSON Data
        Repo-->>Page: Word[]
    and Fetch Adverbs
        Page->>Repo: getAdverbWords()
        Repo->>API: GET /api/adverb-words
        API->>DB: prisma.adverbWord.findMany()
        DB-->>API: adverb records
        API-->>Repo: JSON Data
        Repo-->>Page: Word[]
    end

    Page->>Page: Refresh UI with loaded words
```
