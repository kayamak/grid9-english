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
        Service->>Service: formatBeComplement(...)
    else Verb Type is 'do'
        Service->>Service: generateDoVerb(...)
        Service->>Service: getPastForm / getThirdPersonForm (...)
    end
    
    Service-->>UseCase: generatedText (string)
    UseCase-->>Page: generatedText
    
    Page->>Page: Render text to UI
```
