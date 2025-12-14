import { IUserRepository } from '../../domain/models/users/IUserRepository';
import { User } from '../../domain/models/users/User';
import { prisma } from '../../lib/prisma';

export class PrismaUserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        type: user.type,
      },
      create: {
        id: user.id,
        name: user.name,
        type: user.type,
      },
    });
  }

  async find(id: string): Promise<User | null> {
    const data = await prisma.user.findUnique({
      where: { id },
    });
    if (!data) return null;
    return new User(data.id, data.name, data.type as any); // Cast type
  }

  async findByName(name: string): Promise<User | null> {
    const data = await prisma.user.findFirst({
      where: { name },
    });
    if (!data) return null;
    return new User(data.id, data.name, data.type as any);
  }

  async findMany(ids: string[]): Promise<User[]> {
    const data = await prisma.user.findMany({
      where: { id: { in: ids } },
    });
    return data.map(d => new User(d.id, d.name, d.type as any));
  }

  async findAll(): Promise<User[]> {
    const data = await prisma.user.findMany();
    return data.map(d => new User(d.id, d.name, d.type as any));
  }

  async delete(user: User): Promise<void> {
    await prisma.user.delete({
      where: { id: user.id },
    });
  }
}
