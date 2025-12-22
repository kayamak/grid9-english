export class SentenceDrill {
  private constructor(
    private readonly _id: string,
    private readonly _english: string,
    private readonly _japanese: string,
    private readonly _sortOrder: number
  ) {
    if (!_id) throw new Error('SentenceDrill ID is required');
    if (!_english) throw new Error('English sentence is required');
    if (!_japanese) throw new Error('Japanese sentence is required');
  }

  static create(props: {
    id: string;
    english: string;
    japanese: string;
    sortOrder: number;
  }): SentenceDrill {
    return new SentenceDrill(
      props.id,
      props.english,
      props.japanese,
      props.sortOrder
    );
  }

  static reconstruct(props: {
    id: string;
    english: string;
    japanese: string;
    sortOrder: number;
  }): SentenceDrill {
    return new SentenceDrill(
      props.id,
      props.english,
      props.japanese,
      props.sortOrder
    );
  }

  get id(): string { return this._id; }
  get english(): string { return this._english; }
  get japanese(): string { return this._japanese; }
  get sortOrder(): number { return this._sortOrder; }

  toObject() {
    return {
      id: this._id,
      english: this._english,
      japanese: this._japanese,
      sortOrder: this._sortOrder,
    };
  }
}
