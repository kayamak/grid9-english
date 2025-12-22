import { User } from '../users/User';
import { CircleFullSpecification } from './CircleFullSpecification';

export class Circle {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _ownerId: string,
    private _members: string[]
  ) {
    if (!_id) throw new Error("Id cannot be null");
    if (!_name) throw new Error("Name cannot be null");
    if (!_ownerId) throw new Error("OwnerId cannot be null");
    if (!_members) throw new Error("Members cannot be null");
  }

  static create(id: string, name: string, ownerId: string): Circle {
    return new Circle(id, name, ownerId, []);
  }

  static reconstruct(id: string, name: string, ownerId: string, members: string[]): Circle {
    return new Circle(id, name, ownerId, members);
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get ownerId(): string { return this._ownerId; }
  get members(): string[] { return [...this._members]; } // Defensive copy

  async join(member: User, fullSpec: CircleFullSpecification): Promise<void> {
    if (!member) throw new Error("Member cannot be null");
    
    // Check constraint
    const isFull = await fullSpec.isSatisfiedBy(this);
    if (isFull) {
      throw new Error("Circle is full");
    }

    if (this._members.includes(member.id)) {
      throw new Error("Member is already in the circle");
    }

    this._members.push(member.id);
  }

  countMembers(): number {
    return this._members.length + (this._ownerId ? 1 : 0);
  }

  changeName(name: string): void {
    if (!name) throw new Error("Name cannot be null");
    this._name = name;
  }
}
