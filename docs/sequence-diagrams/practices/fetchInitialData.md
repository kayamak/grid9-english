# Fetch Initial Word Data Sequence

```mermaid
sequenceDiagram
    participant Parent as ServerComponent (Page)
    participant Action as ServerActions (words.ts)
    participant Page as PracticeContainer (Client)
    participant Hook as usePractice (Hook)

    Note over Parent: Server Side Rendering / Fetching
    
    par Fetch Words Categories
        Parent->>Action: getNounWords()
        Action-->>Parent: Nouns[]
    and
        Parent->>Action: getVerbWords()
        Action-->>Parent: Verbs[]
    and
        Parent->>Action: getAdjectiveWords()
        Action-->>Parent: Adjs[]
    and
        Parent->>Action: getAdverbWords()
        Action-->>Parent: Adverbs[]
    end

    Parent->>Page: Render <PracticeContainer initialWords={...} />
    
    Page->>Hook: usePractice(initialWords, ...)
    Hook->>Hook: useMemo / useEffect
    Hook->>Hook: Reconstruct Word Objects (Word.reconstruct)
    Hook->>Hook: setWords(reconstructed)
    
    Hook-->>Page: Return words state
    Page->>Page: Render UI
```
