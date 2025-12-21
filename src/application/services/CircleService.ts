import { ICircleRepository } from '../../domain/models/circles/ICircleRepository';
import { IUserRepository } from '../../domain/models/users/IUserRepository';
import { PrismaCircleRepository } from '../../infrastructure/repositories/PrismaCircleRepository';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { Circle } from '../../domain/models/circles/Circle';
import { CircleFullSpecification } from '../../domain/models/circles/CircleFullSpecification';

export class CircleService {
  private circleRepository: ICircleRepository;
  private userRepository: IUserRepository;

  constructor(
    circleRepository?: ICircleRepository,
    userRepository?: IUserRepository
  ) {
    this.circleRepository = circleRepository || new PrismaCircleRepository();
    this.userRepository = userRepository || new PrismaUserRepository();
  }

  async create(name: string, ownerId: string): Promise<string> {
    const owner = await this.userRepository.find(ownerId);
    if (!owner) throw new Error("Owner not found");

    const id = crypto.randomUUID();
    const circle = new Circle(id, name, owner.id, []);
    
    // Name duplication check? 
    const existing = await this.circleRepository.findByName(name);
    if (existing) throw new Error("Circle already exists");

    await this.circleRepository.save(circle);
    return id;
  }

  async get(id: string) {
    const circle = await this.circleRepository.find(id);
    if (!circle) throw new Error("Circle not found");
    
    const owner = await this.userRepository.find(circle.ownerId);
    
    return {
      id: circle.id,
      name: circle.name,
      ownerId: circle.ownerId,
      ownerName: owner?.name,
      members: circle.members,
    };
  }

  async getAll(): Promise<{ id: string; name: string; ownerId: string }[]> {
    // In efficient impl, this should query DB view or use pagination.
    // For now, simple list.
    // Repo doesn't have findAll? I need to add it to generic or just use prisma directly here if 'Clean' allows, 
    // but strictly should use Repo.
    // I'll add findAll to PrismaCircleRepository if needed or just use prisma for "Query Service" separation.
    // I'll add findAll to Repo for simplicity.
    const circles = await (this.circleRepository as any).findAll(); 
    return circles.map((c: Circle) => ({
      id: c.id,
      name: c.name,
      ownerId: c.ownerId,
    }));
  }

  async join(circleId: string, memberId: string): Promise<void> {
    const circle = await this.circleRepository.find(circleId);
    if (!circle) throw new Error("Circle not found");

    const member = await this.userRepository.find(memberId);
    if (!member) throw new Error("Member not found");

    const spec = new CircleFullSpecification(this.userRepository);
    await circle.join(member, spec);

    await this.circleRepository.save(circle);
  }

  async update(id: string, name: string): Promise<void> {
    const circle = await this.circleRepository.find(id);
    if (!circle) throw new Error("Circle not found");

    const existing = await this.circleRepository.findByName(name);
    if (existing && existing.id !== id) throw new Error("Circle name already exists");

    circle.changeName(name);
    await this.circleRepository.save(circle);
  }

  async delete(id: string): Promise<void> {
    const circle = await this.circleRepository.find(id);
    if (!circle) return;

    await this.circleRepository.delete(circle);
  }
}
