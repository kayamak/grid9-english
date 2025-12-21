import { PracticeState, SentenceType, Subject, Tense, FiveSentencePattern, Object, NumberForm, BeComplement } from './types';

export class PatternGenerator {
  static generate(state: PracticeState, nounWords: { value: string; numberForm: string; }[] = []): string {
    const { verbType, sentenceType, subject, tense } = state;
    let rawSentence = '';

    if (verbType === 'be') {
      const pattern = state.fiveSentencePattern || 'SV';
      const beComplement = state.beComplement || 'here';
      rawSentence = this.generateBeVerb(sentenceType, subject, tense, pattern, beComplement, nounWords);
    } else {
      // Use state.verb if available, otherwise default to 'live' if not set (though types enforce it now)
      // or if for some reason it's 'be' but type is 'do' (should be handled by state management, but good for safety)
      const verb = (state.verb && state.verb !== 'be') ? state.verb : 'live'; 
      const pattern = state.fiveSentencePattern || 'SVO';
      const object = state.object || 'something';
      const numberForm = state.numberForm || 'a';
      rawSentence = this.generateDoVerb(sentenceType, subject, tense, verb, pattern, object, numberForm);
    }

    if (!rawSentence) return '';

    const firstChar = rawSentence.charAt(0).toUpperCase();
    const rest = rawSentence.slice(1);
    const punctuation = sentenceType === 'question' ? '?' : '.';

    return `${firstChar}${rest}${punctuation}`;
  }

  private static generateBeVerb(sentenceType: SentenceType, subject: Subject, tense: Tense, pattern: FiveSentencePattern, beComplement: BeComplement, nounWords: { value: string; numberForm: string; }[]): string {
    const subjectText = this.getSubjectText(subject);
    let beVerb = '';

    // 1. Determine the Be-verb form (am, is, are, was, were)
    if (tense === 'past') {
      if (subject === 'first_s' || subject === 'third_s') {
        beVerb = 'was';
      } else {
        beVerb = 'were';
      }
    } else if (tense === 'present') {
      if (subject === 'first_s') {
        beVerb = 'am';
      } else if (subject === 'third_s') {
        beVerb = 'is';
      } else {
        beVerb = 'are';
      }
    }

    // 2. Format complement based on pattern
    let complement = '';
    if (pattern === 'SV') {
      // SV pattern: use adverbial phrase directly (no formatting needed)
      complement = beComplement;
    } else if (pattern === 'SVC') {
      // SVC pattern: format complement (noun/adjective) with articles
      complement = this.formatBeComplement(beComplement, subject, nounWords);
    }

    // 3. Construct Sentence
    if (tense === 'future') {
        if (sentenceType === 'positive') return `${subjectText} will be ${complement}`;
        if (sentenceType === 'negative') return `${subjectText} won't be ${complement}`;
        if (sentenceType === 'question') return `will ${subjectText} be ${complement}`;
    }

    if (sentenceType === 'positive') {
      return `${subjectText} ${beVerb} ${complement}`;
    } else if (sentenceType === 'negative') {
        if (tense === 'past') {
             if (subject === 'first_s' || subject === 'third_s') return `${subjectText} wasn't ${complement}`;
             return `${subjectText} weren't ${complement}`;
        }
        if (tense === 'present') {
            if (subject === 'first_s') return `${subjectText}'m not ${complement}`;
            if (subject === 'third_s') return `${subjectText} isn't ${complement}`;
            return `${subjectText} aren't ${complement}`;
        }
    } else if (sentenceType === 'question') {
      const capBeVerb = beVerb.charAt(0).toUpperCase() + beVerb.slice(1);
      return `${capBeVerb} ${subjectText} ${complement}`;
    }
    
    return '';
  }

  private static formatBeComplement(base: string, subject: Subject, nounWords: { value: string; numberForm: string; }[]): string {
    const isPluralSubject = subject === 'first_p' || subject === 'third_p' || subject === 'second_p'; 
    
    // Handle 'something' - it's a pronoun, no article or pluralization
    if (base === 'something') {
        return 'something';
    }

    // Find if the base word is in our list of nouns
    const foundNoun = nounWords.find(n => n.value === base);
    
    if (foundNoun) {
        // It's a noun
        
        // If the noun itself is already plural (e.g. "dogs"), don't add 's'
        if (foundNoun.numberForm === 'plural') {
             return base;
        }

        // If noun is 'none' (uncountable) -> return as is (e.g. "soccer")
        // But the user might want "I like soccer". "Something is soccer".
        // If subject is plural "We are soccer players". "We are soccer".
        // Uncountable means no plural form usually.
        if (foundNoun.numberForm === 'none') {
             return base;
        }

        if (isPluralSubject) { 
            // Pluralize
            // Only if it's singular countable (which involves "a", "an" or similar in numberForm? usually "a"/"an")
            return base + 's';
        } else {
            // Singular: add a/an
            const firstChar = base.charAt(0).toLowerCase();
            const vowels = ['a', 'e', 'i', 'o', 'u'];
            const article = vowels.includes(firstChar) ? 'an' : 'a';
            return `${article} ${base}`;
        }
    }
    
    // Adjectives (happy, etc) -> return as is
    return base;
  }

  private static generateDoVerb(sentenceType: SentenceType, subject: Subject, tense: Tense, verbBase: string, pattern: FiveSentencePattern = 'SVO', object: Object = 'something', numberForm: NumberForm = 'a'): string {
    const subjectText = this.getSubjectText(subject);
    const complement = this.getPatternComplement(pattern, subject, object, numberForm);

    if (tense === 'future') {
        if (sentenceType === 'positive') return `${subjectText} will ${verbBase}${complement ? ' ' + complement : ''}`;
        if (sentenceType === 'negative') return `${subjectText} won't ${verbBase}${complement ? ' ' + complement : ''}`;
        if (sentenceType === 'question') return `Will ${subjectText} ${verbBase}${complement ? ' ' + complement : ''}`;
    }

    if (sentenceType === 'positive') {
        // Past: I did -> I lived / went
        // Present: I do / He does -> I live / He lives
        if (tense === 'past') {
            const pastForm = this.getPastForm(verbBase);
            return `${subjectText} ${pastForm}${complement ? ' ' + complement : ''}`;
        }
        if (tense === 'present') {
            if (subject === 'third_s') {
                const thirdPersonForm = this.getThirdPersonForm(verbBase);
                return `${subjectText} ${thirdPersonForm}${complement ? ' ' + complement : ''}`;
            }
            return `${subjectText} ${verbBase}${complement ? ' ' + complement : ''}`;
        }
    } else if (sentenceType === 'negative') {
        if (tense === 'past') return `${subjectText} didn't ${verbBase}${complement ? ' ' + complement : ''}`;
        if (tense === 'present') {
            if (subject === 'third_s') return `${subjectText} doesn't ${verbBase}${complement ? ' ' + complement : ''}`;
            return `${subjectText} don't ${verbBase}${complement ? ' ' + complement : ''}`;
        }
    } else if (sentenceType === 'question') {
         if (tense === 'past') return `Did ${subjectText} ${verbBase}${complement ? ' ' + complement : ''}`;
         if (tense === 'present') {
            if (subject === 'third_s') return `Does ${subjectText} ${verbBase}${complement ? ' ' + complement : ''}`;
            return `Do ${subjectText} ${verbBase}${complement ? ' ' + complement : ''}`;
         }
    }

    return '';
  }

  private static getPatternComplement(pattern: FiveSentencePattern, subject: Subject, object: Object = 'something', numberForm: NumberForm = 'a'): string {
    // For now, provide simple examples for SV and SVO patterns
    switch (pattern) {
      case 'SV':
        // Subject + Verb (intransitive verb, no object)
        // Example: "I live", "He runs"
        // No complement needed for SV pattern
        return '';
      case 'SVO':
        // Subject + Verb + Object
        // Use the selected object from state
        // Apply article based on numberForm selection
        if (numberForm === 'none') {
          // No article (for uncountable nouns or when user selects 'none')
          return object;
        } else if (numberForm === 'a') {
          // Indefinite article 'a'
          return `a ${object}`;
        } else if (numberForm === 'an') {
          // Indefinite article 'an'
          return `an ${object}`;
        } else if (numberForm === 'the') {
          // Definite article 'the'
          return `the ${object}`;
        } else if (numberForm === 'plural') {
          // Plural form (no article needed, object should already be plural)
          return object;
        } else if (['my', 'our', 'your', 'his', 'her', 'their'].includes(numberForm)) {
          // Possessive determiners
          return `${numberForm} ${object}`;
        } else if (numberForm === 'no_article') {
          // No article/determiner - just the bare noun
          return object;
        }
        return object;
      case 'SVOO':
      case 'SVOC':
      case 'SVC':
        // Not implemented yet
        return '';
      default:
        return '';
    }
  }

  private static getPastForm(verb: string): string {
    switch (verb) {
        case 'live': return 'lived';
        case 'do': return 'did';
        case 'go': return 'went';
        case 'arrive': return 'arrived';
        case 'talk': return 'talked';
        case 'run': return 'ran';
        case 'walk': return 'walked';
        case 'smile': return 'smiled';
        case 'laugh': return 'laughed';
        case 'have': return 'had';
        case 'know': return 'knew';
        case 'get': return 'got';
        case 'make': return 'made';
        case 'catch': return 'caught';
        case 'love': return 'loved';
        case 'like': return 'liked';
        case 'take': return 'took';
        case 'see': return 'saw';
        case 'hear': return 'heard';
        case 'play': return 'played';
        case 'sing': return 'sang';
        case 'study': return 'studied';
        case 'teach': return 'taught';
        case 'read': return 'read';
        case 'write': return 'wrote';
        case 'drink': return 'drank';
        case 'eat': return 'ate';
        case 'cook': return 'cooked';
        case 'drive': return 'drove';
        default: return verb + 'ed';
    }
  }

  private static getThirdPersonForm(verb: string): string {
     switch (verb) {
        case 'do': return 'does';
        case 'go': return 'goes';
        case 'wash': return 'washes'; // example if added later
        case 'catch': return 'catches';
        case 'study': return 'studies';
        case 'teach': return 'teaches';
        default: return verb + 's';
     }
  }

  private static getSubjectText(subject: Subject): string {
    switch (subject) {
      case 'first_s': return 'I';
      case 'first_p': return 'we'; // or We? usually lowercase if not start, but "We weren't" is start.
      // Let's standardize on keeping it lowercase unless it's definitely start, but `generate` function handles capitalization?
      // "Does he" -> "he" is lower. "We weren't" -> "We" is upper.
      // So subject text should be lower (except I), and capitalization happens at usage.
      case 'second': return 'you';
      case 'second_p': return 'you';
      case 'third_s': return 'he'; // default to he
      case 'third_p': return 'they';
      default: return '';
    }
  }

  private static addArticle(object: string): string {
    // Determine if we need "a" or "an" based on the first letter
    const firstChar = object.charAt(0).toLowerCase();
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const article = vowels.includes(firstChar) ? 'an' : 'a';
    return `${article} ${object}`;
  }
}
