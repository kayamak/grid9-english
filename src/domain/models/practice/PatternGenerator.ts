import { PracticeState, SentenceType, Subject, Tense } from './types';

export class PatternGenerator {
  static generate(state: PracticeState): string {
    const { verbType, sentenceType, subject, tense } = state;
    let rawSentence = '';

    if (verbType === 'be') {
      const verb = (state.verb && state.verb !== 'do' && state.verb !== 'live') ? state.verb : 'be';
      // Wait, if I switch type, state.verb might be 'do' until reset.
      // But page.tsx resets it.
      // Safe logic: check if verb is valid for be?
      // For now, trust state or just pass it if not generic 'be'.
      // Actually, 'live' is default for Do, 'be' or 'carpenter' for Be.
      // Let's passed state.verb. The specific method will check if it's 'be'.
      rawSentence = this.generateBeVerb(sentenceType, subject, tense, state.verb);
    } else {
      // Use state.verb if available, otherwise default to 'live' if not set (though types enforce it now)
      // or if for some reason it's 'be' but type is 'do' (should be handled by state management, but good for safety)
      const verb = (state.verb && state.verb !== 'be') ? state.verb : 'live'; 
      rawSentence = this.generateDoVerb(sentenceType, subject, tense, verb);
    }

    if (!rawSentence) return '';

    const firstChar = rawSentence.charAt(0).toUpperCase();
    const rest = rawSentence.slice(1);
    const punctuation = sentenceType === 'question' ? '?' : '.';

    return `${firstChar}${rest}${punctuation}`;
  }

  private static generateBeVerb(sentenceType: SentenceType, subject: Subject, tense: Tense, verbBase: string = 'be'): string {
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
    } else if (tense === 'future') {
       // Future Be: will be
       // Logic handled below for full sentence construction usually, but let's separate standard "be" form vs auxiliary
    }

    // 2. Determine Complement (Noun/Adjective) with articles/pluralization
    // If verbBase is 'be' (default), we just use empty or generic?
    // Let's assume if it's 'be', we treat it as empty or specific logic needed?
    // User flow: 'be' is not an option in dropdown. 'carpenter' is.
    // If verbBase IS 'be', maybe show nothing extra?
    // Spec doesn't say. Assuming 'be' shouldn't happen if UI works right, 
    // but if it does, let's just not append complement.
    
    let complement = '';
    if (verbBase !== 'be') {
        complement = this.formatBeComplement(verbBase, subject);
    }

    // 3. Construct Sentence
    if (tense === 'future') {
        if (sentenceType === 'positive') return `${subjectText} will be ${complement}`;
        if (sentenceType === 'negative') return `${subjectText} won't be ${complement}`;
        if (sentenceType === 'question') return `Will ${subjectText} be ${complement}`;
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
      // Capitalize first letter of beVerb handled here?
      // beVerb for Question is start.
      const capBeVerb = beVerb.charAt(0).toUpperCase() + beVerb.slice(1);
      return `${capBeVerb} ${subjectText} ${complement}`;
    }
    
    return '';
  }

  private static formatBeComplement(base: string, subject: Subject): string {
    const isPluralSubject = subject === 'first_p' || subject === 'third_p' || subject === 'second_p'; 

    const nouns = ['carpenter', 'hairdresser', 'nurse', 'teacher', 'chef', 'farmer', 'photographer'];
    
    if (nouns.includes(base)) {
        // It's a noun
        if (isPluralSubject) { 
            // Pluralize
            // All current nouns just add 's'
            return base + 's';
        } else {
            // Singular: add a/an
            // All current nouns start with consonant -> 'a'
            return `a ${base}`;
        }
    }
    
    // Adjectives (happy, etc) -> return as is
    return base;
  }

  private static generateDoVerb(sentenceType: SentenceType, subject: Subject, tense: Tense, verbBase: string): string {
    const subjectText = this.getSubjectText(subject);

    if (tense === 'future') {
        if (sentenceType === 'positive') return `${subjectText} will ${verbBase}`;
        if (sentenceType === 'negative') return `${subjectText} won't ${verbBase}`;
        if (sentenceType === 'question') return `Will ${subjectText} ${verbBase}`;
    }

    if (sentenceType === 'positive') {
        // Past: I did -> I lived / went
        // Present: I do / He does -> I live / He lives
        if (tense === 'past') {
            const pastForm = this.getPastForm(verbBase);
            return `${subjectText} ${pastForm}`;
        }
        if (tense === 'present') {
            if (subject === 'third_s') {
                const thirdPersonForm = this.getThirdPersonForm(verbBase);
                return `${subjectText} ${thirdPersonForm}`;
            }
            return `${subjectText} ${verbBase}`;
        }
    } else if (sentenceType === 'negative') {
        if (tense === 'past') return `${subjectText} didn't ${verbBase}`;
        if (tense === 'present') {
            if (subject === 'third_s') return `${subjectText} doesn't ${verbBase}`;
            return `${subjectText} don't ${verbBase}`;
        }
    } else if (sentenceType === 'question') {
         if (tense === 'past') return `Did ${subjectText} ${verbBase}`;
         if (tense === 'present') {
            if (subject === 'third_s') return `Does ${subjectText} ${verbBase}`;
            return `Do ${subjectText} ${verbBase}`;
         }
    }

    return '';
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
        default: return verb + 'ed';
    }
  }

  private static getThirdPersonForm(verb: string): string {
     switch (verb) {
        case 'do': return 'does';
        case 'go': return 'goes';
        case 'wash': return 'washes'; // example if added later
        case 'catch': return 'catches';
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
}
