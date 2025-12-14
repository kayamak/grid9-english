import { User } from '../users/User';
import { CircleFullSpecification } from './CircleFullSpecification';

export class Circle {
  constructor(
    public readonly id: string,
    public name: string,
    public ownerId: string,
    public members: string[]
  ) {
    if (!id) throw new Error("Id cannot be null");
    if (!name) throw new Error("Name cannot be null");
    if (!ownerId) throw new Error("OwnerId cannot be null");
    if (!members) throw new Error("Members cannot be null");
  }

  async join(member: User, fullSpec: CircleFullSpecification): Promise<void> {
    if (!member) throw new Error("Member cannot be null");
    
    // Check constraint
    const isFull = await fullSpec.isSatisfiedBy(this);
    if (isFull) {
      throw new Error("Circle is full");
    }

    this.members.push(member.id);
  }

  countMembers(): number {
    return this.members.length + (this.ownerId ? 1 : 0);
  }

  changeName(name: string): void {
    if (!name) throw new Error("Name cannot be null");
    this.name = name;
  }
}
