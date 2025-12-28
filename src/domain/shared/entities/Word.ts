export type WordType = 'noun' | 'verb' | 'adjective' | 'adverb';

export class Word {
  private constructor(
    private readonly _id: string,
    private readonly _value: string,
    private readonly _label: string,
    private readonly _type: WordType,
    private readonly _numberForm?: string,
    private readonly _pastForm?: string,
    private readonly _thirdPersonForm?: string,
    private readonly _adverb?: string,
    private readonly _sortOrder?: number
  ) {
    if (!_id) throw new Error('Word ID is required');
    if (!_value) throw new Error('Word value is required');
  }

  static create(props: {
    id: string;
    value: string;
    label: string;
    type: WordType;
    numberForm?: string;
    pastForm?: string;
    thirdPersonForm?: string;
    adverb?: string;
    sortOrder?: number;
  }): Word {
    return new Word(
      props.id,
      props.value,
      props.label,
      props.type,
      props.numberForm,
      props.pastForm,
      props.thirdPersonForm,
      props.adverb,
      props.sortOrder
    );
  }

  static reconstruct(props: {
    id: string;
    value: string;
    label: string;
    type: WordType;
    numberForm?: string;
    pastForm?: string;
    thirdPersonForm?: string;
    adverb?: string;
    sortOrder?: number;
  }): Word {
    return new Word(
      props.id,
      props.value,
      props.label,
      props.type,
      props.numberForm,
      props.pastForm,
      props.thirdPersonForm,
      props.adverb,
      props.sortOrder
    );
  }

  get id(): string { return this._id; }
  get value(): string { return this._value; }
  get label(): string { return this._label; }
  get type(): WordType { return this._type; }
  get numberForm(): string | undefined { return this._numberForm; }
  get pastForm(): string | undefined { return this._pastForm; }
  get thirdPersonForm(): string | undefined { return this._thirdPersonForm; }
  get adverb(): string | undefined { return this._adverb; }
  get sortOrder(): number | undefined { return this._sortOrder; }

  // Business logic (example from specs: defensive copy if needed)
  toObject() {
    return {
      id: this._id,
      value: this._value,
      label: this._label,
      type: this._type,
      numberForm: this._numberForm,
      pastForm: this._pastForm,
      thirdPersonForm: this._thirdPersonForm,
      adverb: this._adverb,
      sortOrder: this._sortOrder,
    };
  }
}
