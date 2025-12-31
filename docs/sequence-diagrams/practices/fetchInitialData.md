# Fetch Initial Word Data Sequence

```mermaid
sequenceDiagram
    participant Page as PracticePage
    participant Hook as usePractice (Hook)
    participant Action as ServerActions (words.ts)
    participant Repo as PrismaWordRepository
    participant DB as Database (via Prisma)

    Page->>Hook: Component Mount
    Hook->>Hook: useEffect (Fetch Data)
    
    par Fetch Nouns
        Hook->>Action: getNounWords()
        Action->>Repo: getNounWords()
        Repo->>DB: prisma.nounWord.findMany()
        DB-->>Repo: noun records
        Repo-->>Action: Word[]
        Action-->>Hook: Word[] (as plain objects)
    and Fetch Verbs
        Hook->>Action: getVerbWords()
        Action->>Repo: getVerbWords()
        Repo->>DB: prisma.verbWord.findMany()
        DB-->>Repo: verb records
        Repo-->>Action: Word[]
        Action-->>Hook: Word[] (as plain objects)
    and Fetch Adjectives
        Hook->>Action: getAdjectiveWords()
        Action->>Repo: getAdjectiveWords()
        Repo->>DB: prisma.adjectiveWord.findMany()
        DB-->>Repo: adjective records
        Repo-->>Action: Word[]
        Action-->>Hook: Word[] (as plain objects)
    and Fetch Adverbs
        Hook->>Action: getAdverbWords()
        Action->>Repo: getAdverbWords()
        Repo->>DB: prisma.adverbWord.findMany()
        DB-->>Repo: adverb records
        Repo-->>Action: Word[]
        Action-->>Hook: Word[] (as plain objects)
    end

    Hook->>Hook: setWords(...)
    Hook-->>Page: Return words state
    Page->>Page: Refresh UI with loaded words
```
