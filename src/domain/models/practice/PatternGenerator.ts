import { PracticeState, SentenceType, Subject, Tense } from './types';

export class PatternGenerator {
  static generate(state: PracticeState): string {
    const { verbType, sentenceType, subject, tense } = state;

    if (verbType === 'be') {
      return this.generateBeVerb(sentenceType, subject, tense);
    } else {
      return this.generateDoVerb(sentenceType, subject, tense);
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

  private static generateDoVerb(sentenceType: SentenceType, subject: Subject, tense: Tense): string {
    const subjectText = this.getSubjectText(subject);

    if (tense === 'future') {
        if (sentenceType === 'positive') return `${subjectText} will do`;
        if (sentenceType === 'negative') return `${subjectText} won't do`;
        if (sentenceType === 'question') return `Will ${subjectText} do`;
    }

    if (sentenceType === 'positive') {
        // Past: I did
        // Present: I do / He does
        if (tense === 'past') return `${subjectText} did`;
        if (tense === 'present') {
            if (subject === 'third_s') return `${subjectText} does`;
            return `${subjectText} do`;
        }
    } else if (sentenceType === 'negative') {
        if (tense === 'past') return `${subjectText} didn't do`;
        if (tense === 'present') {
            if (subject === 'third_s') return `${subjectText} doesn't do`;
            return `${subjectText} don't do`;
        }
    } else if (sentenceType === 'question') {
         if (tense === 'past') return `Did ${subjectText} do`;
         if (tense === 'present') {
            if (subject === 'third_s') return `Does ${subjectText} do`;
            return `Do ${subjectText} do`;
         }
    }

    return '';
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
