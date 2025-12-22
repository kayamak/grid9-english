import { ICircleRepository } from '../../domain/models/circles/ICircleRepository';
import { Circle } from '../../domain/models/circles/Circle';
import { prisma } from '../../lib/prisma';

export class PrismaCircleRepository implements ICircleRepository {
  async save(circle: Circle): Promise<void> {
    await prisma.circle.upsert({
      where: { id: circle.id },
      create: {
        id: circle.id,
        name: circle.name,
        ownerId: circle.ownerId,
        members: {
          connect: circle.members.map(id => ({ id })),
        },
      },
      update: {
        name: circle.name,
        // ownerId: circle.ownerId, // owner usually doesn't change
        members: {
          set: circle.members.map(id => ({ id })),
        },
      },
    });
  }

  async find(id: string): Promise<Circle | null> {
    const data = await prisma.circle.findUnique({
      where: { id },
      include: {
        members: true, // Include members to map IDs
      },
    });

    if (!data) return null;

    const memberIds = data.members.map(m => m.id);
    return Circle.reconstruct(data.id, data.name, data.ownerId, memberIds);
  }

  async findByName(name: string): Promise<Circle | null> {
    const data = await prisma.circle.findFirst({
      where: { name },
      include: {
        members: true,
      },
    });

    if (!data) return null;

    const memberIds = data.members.map(m => m.id);
    return Circle.reconstruct(data.id, data.name, data.ownerId, memberIds);
  }

  async findAll(): Promise<Circle[]> {
    const data = await prisma.circle.findMany({
      include: { members: true }
    });
    return data.map(d => Circle.reconstruct(d.id, d.name, d.ownerId, d.members.map(m => m.id)));
  }

  async delete(circle: Circle): Promise<void> {
    await prisma.circle.delete({
      where: { id: circle.id },
    });
  }
}
