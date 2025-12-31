# Generate Pattern Sequence

```mermaid
sequenceDiagram
    actor User
    participant Page as PracticePage
    participant UseCase as GeneratePatternUseCase
    participant Service as PatternGenerator (Domain Service)

    User->>Page: Change Pattern Options (Verb, Tense, person, etc.)
    Page->>Page: Update state (SentencePattern)
    
    note right of Page: Automatic re-render on state change
    
    Page->>UseCase: execute(state, nounWords, verbWords)
    UseCase->>Service: generate(pattern, nounWords, verbWords)
    
    Service->>Service: Determine Verb Type (be / do)
    
    alt Verb Type is 'be'
        Service->>Service: generateBeVerb(...)
        Service->>Service: Determine auxiliary / complement based on Tense/Type
        Note right of Service: Handles (am, is, are, was, were, will be)
        Service->>Service: formatBeComplement(...) (Noun/Adjective)
    else Verb Type is 'do'
        Service->>Service: generateDoVerb(...)
        Service->>Service: Determine auxiliary / form based on Tense/Type
        Note right of Service: Handles (do, does, did, will, doesn't, didn't, etc.)
        Service->>Service: getPastForm / getThirdPersonForm (...)
        Service->>Service: getPatternComplement(...) (Objects)
    end
    
    Service->>Service: Final formatting (Capitalize + Punctuation)
    Service-->>UseCase: generatedText (string)
    UseCase-->>Page: generatedText
    
    Page->>Page: Render text to UI
```
