
import { describe, it, expect, vi } from 'vitest';
import { CircleFullSpecification } from '@/domain/circles/spec/CircleFullSpecification';
import { Circle } from '@/domain/circles/entities/Circle';
import { IUserRepository } from '@/domain/users/repositories/IUserRepository';
import { User } from '@/domain/users/entities/User';

describe('CircleFullSpecification', () => {
  const mockUserRepository = {
    findMany: vi.fn(),
  } as unknown as IUserRepository;

  const spec = new CircleFullSpecification(mockUserRepository);

  it('should return false if members count is less than 30', async () => {
    // 29 members + 1 owner = 30? Wait, let's check checking logic.
    // Spec says: if (membersCount < 30) return false.
    // So if membersCount is 29, it returns false.
    
    // Create circle with 28 members + owner = 29 total
    const members = Array.from({ length: 28 }, (_, i) => `m${i}`);
    const circle = Circle.reconstruct('c1', 'My Circle', 'owner1', members);
    
    expect(circle.countMembers()).toBe(29);
    
    const result = await spec.isSatisfiedBy(circle);
    expect(result).toBe(false);
    expect(mockUserRepository.findMany).not.toHaveBeenCalled();
  });

  it('should return true if members count >= 30 and limit is 30 (low premium count)', async () => {
    // 29 members + 1 owner = 30 total.
    // No premiums. Limit should be 30.
    // 30 >= 30 -> true (it is full)
    
    const members = Array.from({ length: 29 }, (_, i) => `m${i}`);
    const circle = Circle.reconstruct('c1', 'My Circle', 'owner1', members); // Total 30
    
    // Mock users: all Normal
    const mockUsers = [
        User.reconstruct('owner1', 'Owner', 'Normal'),
        ...members.map(id => User.reconstruct(id, id, 'Normal'))
    ];
    vi.mocked(mockUserRepository.findMany).mockResolvedValue(mockUsers);

    const result = await spec.isSatisfiedBy(circle);
    expect(result).toBe(true); // Full because 30 >= 30
  });

  it('should return false if members count is 30 but limit is 50 (high premium count)', async () => {
    // 29 members + 1 owner = 30 total.
    // > 10 premiums. Limit should be 50.
    // 30 < 50 -> false (not full)

    const members = Array.from({ length: 29 }, (_, i) => `m${i}`);
    const circle = Circle.reconstruct('c1', 'My Circle', 'owner1', members); // Total 30

    // Mock users: 15 Premium, rest Normal
    const mockUsers = [
        User.reconstruct('owner1', 'Owner', 'Premium'), // 1
        ...members.slice(0, 14).map(id => User.reconstruct(id, id, 'Premium')), // 14
        ...members.slice(14).map(id => User.reconstruct(id, id, 'Normal')) // Rest
    ]; 
    // Total 15 premiums > 10 -> Max is 50.
    
    vi.mocked(mockUserRepository.findMany).mockResolvedValue(mockUsers);
    
    const result = await spec.isSatisfiedBy(circle);
    expect(result).toBe(false); // Not full because 30 < 50
  });

  it('should return true if members count is 50 and limit is 50', async () => {
      // 49 members + 1 owner = 50 total.
      // > 10 premiums.
      // 50 >= 50 -> true (full)
      
      const members = Array.from({ length: 49 }, (_, i) => `m${i}`);
      const circle = Circle.reconstruct('c1', 'My Circle', 'owner1', members);
      
      const mockUsers = [
          User.reconstruct('owner1', 'Owner', 'Premium'), // 1
          ...members.slice(0, 14).map(id => User.reconstruct(id, id, 'Premium')), // 14
          ...members.slice(14).map(id => User.reconstruct(id, id, 'Normal'))
      ];
      
      vi.mocked(mockUserRepository.findMany).mockResolvedValue(mockUsers);

      const result = await spec.isSatisfiedBy(circle);
      expect(result).toBe(true);
  });
});
