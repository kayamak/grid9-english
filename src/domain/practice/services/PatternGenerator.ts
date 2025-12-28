import { SentenceType, Subject, Tense, FiveSentencePattern, Object, NumberForm, BeComplement, Word, SentencePattern } from '../types';

/**
 * Domain Service: PatternGenerator
 * Responsible for generating the string representation of a sentence pattern
 * based on the Domain Rules.
 */
export class PatternGenerator {
  static generate(pattern: SentencePattern, nounWords: Word[] = [], verbWords: Word[] = []): string {
    const { verbType, sentenceType, subject, tense } = pattern;
    let rawSentence = '';

    if (verbType === 'be') {
      const fiveSentencePattern = pattern.fiveSentencePattern || 'SV';
      const beComplement = pattern.beComplement || 'here';
      const numberForm = pattern.numberForm || 'a';
      rawSentence = this.generateBeVerb(sentenceType, subject, tense, fiveSentencePattern, beComplement, numberForm, nounWords);
    } else {
      // Use pattern.verb if available, otherwise default to 'live'
      const verb = (pattern.verb && pattern.verb !== 'be') ? pattern.verb : 'live'; 
      const fiveSentencePattern = pattern.fiveSentencePattern || 'SVO';
      const object = pattern.object || 'something';
      const numberForm = pattern.numberForm || 'a';
      rawSentence = this.generateDoVerb(sentenceType, subject, tense, verb, fiveSentencePattern, object, numberForm, verbWords);
    }

    if (!rawSentence) return '';

    const firstChar = rawSentence.charAt(0).toUpperCase();
    const rest = rawSentence.slice(1);
    const punctuation = sentenceType === 'question' ? '?' : '.';

    return `${firstChar}${rest}${punctuation}`;
  }

  private static generateBeVerb(sentenceType: SentenceType, subject: Subject, tense: Tense, pattern: FiveSentencePattern, beComplement: BeComplement, numberForm: NumberForm, nounWords: Word[]): string {
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
      complement = this.formatBeComplement(beComplement, subject, numberForm, nounWords);
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

  private static formatBeComplement(base: string, subject: Subject, numberForm: NumberForm, nounWords: Word[]): string {
    const isPluralSubject = subject === 'first_p' || subject === 'third_p' || subject === 'second_p'; 
    
    // Handle 'something' - it's a pronoun, no article or pluralization
    if (base === 'something') {
        return 'something';
    }

    // Find if the base word is in our list of nouns
    const foundNoun = nounWords.find(n => n.value === base);
    
    if (foundNoun) {
        // It's a noun
        
        // 1. Determine the core noun form (singular or plural)
        let nounText = base;
        const isUncountable = foundNoun.numberForm === 'none';
        const isAlreadyPlural = foundNoun.numberForm === 'plural';

        if (isPluralSubject && !isUncountable && !isAlreadyPlural) {
            // Pluralize if subject is plural and noun is singular countable
            nounText = base + 's';
        }

        // 2. Add article/determiner based on numberForm
        if (numberForm === 'the') {
            return `the ${nounText}`;
        }
        if (['my', 'our', 'your', 'his', 'her', 'their'].includes(numberForm)) {
            return `${numberForm} ${nounText}`;
        }
        if (numberForm === 'plural') {
            return nounText;
        }
        if (numberForm === 'none' || numberForm === 'no_article') {
            return nounText;
        }
        if (numberForm === 'a' || numberForm === 'an' || numberForm === 'adjective') {
            // For Be verbs, if subject is plural, we don't use a/an even if numberForm says so
            if (isPluralSubject || isUncountable || isAlreadyPlural) {
                return nounText;
            }
            // Singular: determine a/an based on phonetics (simplified)
            const firstChar = nounText.charAt(0).toLowerCase();
            const vowels = ['a', 'e', 'i', 'o', 'u'];
            const article = vowels.includes(firstChar) ? 'an' : 'a';
            return `${article} ${nounText}`;
        }
        
        // Default fallback if numberForm is unexpected
        return nounText;
    }
    
    // Adjectives (happy, etc) -> return as is
    return base;
  }

  private static generateDoVerb(sentenceType: SentenceType, subject: Subject, tense: Tense, verbBase: string, pattern: FiveSentencePattern = 'SVO', object: Object = 'something', numberForm: NumberForm = 'a', verbWords: Word[] = []): string {
    const subjectText = this.getSubjectText(subject);
    let complement = this.getPatternComplement(pattern, subject, object, numberForm);

    // Handle verb-specific adverbs for SV patterns
    if (pattern === 'SV') {
      const foundVerb = verbWords.find(v => v.value.toLowerCase() === verbBase.toLowerCase());
      if (foundVerb) {
        // Handle both entity (getter) and POJO (property)
        const adv = (foundVerb as any).adverb || (foundVerb as any)._adverb;
        if (adv) {
          complement = adv;
        }
      }
    }

    if (tense === 'future') {
        if (sentenceType === 'positive') return `${subjectText} will ${verbBase}${complement ? ' ' + complement : ''}`;
        if (sentenceType === 'negative') return `${subjectText} won't ${verbBase}${complement ? ' ' + complement : ''}`;
        if (sentenceType === 'question') return `Will ${subjectText} ${verbBase}${complement ? ' ' + complement : ''}`;
    }

    if (sentenceType === 'positive') {
        if (tense === 'past') {
            const pastForm = this.getPastForm(verbBase, verbWords);
            return `${subjectText} ${pastForm}${complement ? ' ' + complement : ''}`;
        }
        if (tense === 'present') {
            if (subject === 'third_s') {
                const thirdPersonForm = this.getThirdPersonForm(verbBase, verbWords);
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
    switch (pattern) {
      case 'SV':
        return '';
      case 'SVO':
        if (numberForm === 'none') {
          return object;
        } else if (numberForm === 'a') {
          return `a ${object}`;
        } else if (numberForm === 'an') {
          return `an ${object}`;
        } else if (numberForm === 'the') {
          return `the ${object}`;
        } else if (numberForm === 'plural') {
          return object;
        } else if (['my', 'our', 'your', 'his', 'her', 'their'].includes(numberForm)) {
          return `${numberForm} ${object}`;
        } else if (numberForm === 'no_article') {
          return object;
        }
        return object;
      case 'SVOO':
      case 'SVOC':
      case 'SVC':
        return '';
      default:
        return '';
    }
  }

  private static getPastForm(verb: string, verbWords: Word[]): string {
    const foundVerb = verbWords.find(v => v.value === verb);
    if (foundVerb && foundVerb.pastForm) {
        return foundVerb.pastForm;
    }
    // Fallback if not found or pastForm missing: assume regular verb
    return verb + 'ed';
  }

  private static getThirdPersonForm(verb: string, verbWords: Word[]): string {
    const foundVerb = verbWords.find(v => v.value === verb);
    if (foundVerb && foundVerb.thirdPersonForm) {
        return foundVerb.thirdPersonForm;
    }
    
    // Fallback: simplified rules
    if (verb.endsWith('ch') || verb.endsWith('sh') || verb.endsWith('s') || verb.endsWith('x') || verb.endsWith('o')) {
        return verb + 'es';
    }
    if (verb.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(verb.charAt(verb.length - 2))) {
        return verb.slice(0, -1) + 'ies';
    }
    return verb + 's';
  }

  private static getSubjectText(subject: Subject): string {
    switch (subject) {
      case 'first_s': return 'I';
      case 'first_p': return 'we'; 
      case 'second': return 'you';
      case 'second_p': return 'you';
      case 'third_s': return 'he'; 
      case 'third_p': return 'they';
      default: return '';
    }
  }
}
