import { IUserRepository } from '@/domain/users/repositories/IUserRepository';
import { Circle } from '@/domain/circles/entities/Circle';

export class CircleFullSpecification {
  constructor(private readonly userRepository: IUserRepository) {}

  async isSatisfiedBy(circle: Circle): Promise<boolean> {
    const membersCount = circle.countMembers();
    if (membersCount < 30) {
      return false;
    }

    const memberIds = circle.members.concat(circle.ownerId ? [circle.ownerId] : []);
    const users = await this.userRepository.findMany(memberIds);
    
    // Fallback: if user not found, treat as Normal (or throw, but simplified here)
    const premiumMemberCount = users.filter(u => u.isPremium).length;
    
    const max = premiumMemberCount > 10 ? 50 : 30;

    return membersCount >= max;
  }
}
