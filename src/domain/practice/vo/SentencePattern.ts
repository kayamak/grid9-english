import { VerbType, SentenceType, Subject, Tense, FiveSentencePattern, NumberForm } from '../types';
import { SentencePatternSpecification } from '../spec/SentencePatternSpecification';

export class SentencePattern {
  private constructor(
    private readonly _verbType: VerbType,
    private readonly _verb: string,
    private readonly _sentenceType: SentenceType,
    private readonly _subject: Subject,
    private readonly _tense: Tense,
    private readonly _fiveSentencePattern: FiveSentencePattern,
    private readonly _object: string,
    private readonly _numberForm: NumberForm,
    private readonly _beComplement: string
  ) {
    this.validate();
  }

  static create(props: {
    verbType: VerbType;
    verb: string;
    sentenceType: SentenceType;
    subject: Subject;
    tense: Tense;
    fiveSentencePattern?: FiveSentencePattern;
    object?: string;
    numberForm?: NumberForm;
    beComplement?: string;
  }): SentencePattern {
    return new SentencePattern(
      props.verbType,
      props.verb,
      props.sentenceType,
      props.subject,
      props.tense,
      props.fiveSentencePattern || (props.verbType === 'be' ? 'SV' : 'SVO'),
      props.object || 'something',
      props.numberForm || (props.verbType === 'be' ? 'a' : 'none'),
      props.beComplement || 'here'
    );
  }

  private validate(): void {
    const spec = new SentencePatternSpecification();
    if (!spec.isSatisfiedBy(this)) {
      throw new Error('Invalid sentence pattern: Be verb cannot have SVO, SVOO, or SVOC patterns');
    }
  }

  // Getters
  get verbType(): VerbType { return this._verbType; }
  get verb(): string { return this._verb; }
  get sentenceType(): SentenceType { return this._sentenceType; }
  get subject(): Subject { return this._subject; }
  get tense(): Tense { return this._tense; }
  get fiveSentencePattern(): FiveSentencePattern { return this._fiveSentencePattern; }
  get object(): string { return this._object; }
  get numberForm(): NumberForm { return this._numberForm; }
  get beComplement(): string { return this._beComplement; }

  // Business Logic: rotateSubject (Invariant 1)
  rotateSubject(): SentencePattern {
    const nextSubject: Record<Subject, Subject> = {
      'first_s': 'first_p',
      'first_p': 'first_s',
      'second': 'second_p',
      'second_p': 'second',
      'third_s': 'third_p',
      'third_p': 'third_s',
    };
    return this.copyWith({ subject: nextSubject[this._subject] });
  }

  // Tense transitions
  changeTense(tense: Tense): SentencePattern {
    return this.copyWith({ tense });
  }

  // Sentence type transitions
  toggleSentenceType(type: SentenceType): SentencePattern {
    return this.copyWith({ sentenceType: type });
  }

  // Helper method for immutability
  private copyWith(props: Partial<{
    verbType: VerbType;
    verb: string;
    sentenceType: SentenceType;
    subject: Subject;
    tense: Tense;
    fiveSentencePattern: FiveSentencePattern;
    object: string;
    numberForm: NumberForm;
    beComplement: string;
  }>): SentencePattern {
    return new SentencePattern(
      props.verbType ?? this._verbType,
      props.verb ?? this._verb,
      props.sentenceType ?? this._sentenceType,
      props.subject ?? this._subject,
      props.tense ?? this._tense,
      props.fiveSentencePattern ?? this._fiveSentencePattern,
      props.object ?? this._object,
      props.numberForm ?? this._numberForm,
      props.beComplement ?? this._beComplement
    );
  }

  // To plain object for UI / Persistence
  toObject() {
    return {
      verbType: this._verbType,
      verb: this._verb,
      sentenceType: this._sentenceType,
      subject: this._subject,
      tense: this._tense,
      fiveSentencePattern: this._fiveSentencePattern,
      object: this._object,
      numberForm: this._numberForm,
      beComplement: this._beComplement,
    };
  }
}
