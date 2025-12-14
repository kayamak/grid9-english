import { PracticeState, SentenceType, Subject, Tense } from './types';

export class PatternGenerator {
  static generate(state: PracticeState): string {
    const { verbType, sentenceType, subject, tense } = state;

    if (verbType === 'be') {
      return this.generateBeVerb(sentenceType, subject, tense);
    } else {
      // Use state.verb if available, otherwise default to 'live' if not set (though types enforce it now)
      // or if for some reason it's 'be' but type is 'do' (should be handled by state management, but good for safety)
      const verb = (state.verb && state.verb !== 'be') ? state.verb : 'live'; 
      return this.generateDoVerb(sentenceType, subject, tense, verb);
    }
  }

  private static generateBeVerb(sentenceType: SentenceType, subject: Subject, tense: Tense): string {
    const subjectText = this.getSubjectText(subject);
    let verb = '';

    if (tense === 'past') {
      if (subject === 'first_s' || subject === 'third_s') {
        verb = 'was';
      } else {
        verb = 'were';
      }
    } else if (tense === 'present') {
      if (subject === 'first_s') {
        verb = 'am';
      } else if (subject === 'third_s') {
        verb = 'is';
      } else {
        verb = 'are';
      }
    } else if (tense === 'future') {
       // Future Be: will be
       if (sentenceType === 'positive') return `${subjectText} will be`;
       if (sentenceType === 'negative') return `${subjectText} won't be`;
       if (sentenceType === 'question') return `Will ${subjectText} be`;
    }

    if (sentenceType === 'positive') {
      return `${subjectText} ${verb}`;
    } else if (sentenceType === 'negative') {
        if (tense === 'past') {
             if (subject === 'first_s' || subject === 'third_s') return `${subjectText} wasn't`;
             return `${subjectText} weren't`;
        }
        if (tense === 'present') {
            if (subject === 'first_s') return `${subjectText}'m not`;
            if (subject === 'third_s') return `${subjectText} isn't`;
            return `${subjectText} aren't`;
        }
    } else if (sentenceType === 'question') {
      return `${verb.charAt(0).toUpperCase() + verb.slice(1)} ${subjectText}`;
    }
    
    return '';
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
      case 'third_s': return 'he'; // default to he
      case 'third_p': return 'they';
      default: return '';
    }
  }
}
