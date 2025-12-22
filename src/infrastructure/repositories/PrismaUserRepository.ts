import { IUserRepository } from '@/domain/users/repositories/IUserRepository';
import { User, UserType } from '@/domain/users/entities/User';
import { prisma } from '@/infrastructure/prisma/client';

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
    return User.reconstruct(data.id, data.name, data.type as UserType);
  }

  async findByName(name: string): Promise<User | null> {
    const data = await prisma.user.findFirst({
      where: { name },
    });
    if (!data) return null;
    return User.reconstruct(data.id, data.name, data.type as UserType);
  }

  async findMany(ids: string[]): Promise<User[]> {
    const data = await prisma.user.findMany({
      where: { id: { in: ids } },
    });
    return data.map(d => User.reconstruct(d.id, d.name, d.type as UserType));
  }

  async findAll(): Promise<User[]> {
    const data = await prisma.user.findMany();
    return data.map(d => User.reconstruct(d.id, d.name, d.type as UserType));
  }

  async delete(user: User): Promise<void> {
    await prisma.user.delete({
      where: { id: user.id },
    });
  }
}
