export type UserType = 'Normal' | 'Premium';

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public type: UserType
  ) {
    if (!id) throw new Error("Id cannot be null");
    if (!name) throw new Error("Name cannot be null");
  }

  get isPremium(): boolean {
    return this.type === 'Premium';
  }

  changeName(name: string): void {
    if (!name) throw new Error("Name cannot be null");
    this.name = name;
  }

  upgrade(): void {
    this.type = 'Premium';
  }

  downgrade(): void {
    this.type = 'Normal';
  }
}
