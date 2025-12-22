export type UserType = 'Normal' | 'Premium';

export class User {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _type: UserType
  ) {
    if (!_id) throw new Error("Id cannot be null");
    if (!_name) throw new Error("Name cannot be null");
  }

  static create(id: string, name: string): User {
    return new User(id, name, 'Normal');
  }

  static reconstruct(id: string, name: string, type: UserType): User {
    return new User(id, name, type);
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get type(): UserType { return this._type; }

  get isPremium(): boolean {
    return this._type === 'Premium';
  }

  changeName(name: string): void {
    if (!name) throw new Error("Name cannot be null");
    this._name = name;
  }

  upgrade(): void {
    this._type = 'Premium';
  }

  downgrade(): void {
    this._type = 'Normal';
  }
}
