
import { describe, it, expect, vi } from 'vitest';
import { Circle } from './Circle';
import { User } from '../users/User';
import { CircleFullSpecification } from './CircleFullSpecification';

describe('Circle', () => {
  it('should create a circle instance', () => {
    const circle = new Circle('c1', 'My Circle', 'owner1', []);
    expect(circle.id).toBe('c1');
    expect(circle.name).toBe('My Circle');
    expect(circle.ownerId).toBe('owner1');
    expect(circle.members).toEqual([]);
  });

  it('should throw error if created with null values', () => {
     expect(() => new Circle('', 'Name', 'owner', [])).toThrow('Id cannot be null');
     expect(() => new Circle('id', '', 'owner', [])).toThrow('Name cannot be null');
     expect(() => new Circle('id', 'Name', '', [])).toThrow('OwnerId cannot be null');
  });

  it('should count members correctly', () => {
    const circle = new Circle('c1', 'My Circle', 'owner1', ['m1', 'm2']);
    // owner + 2 members = 3
    expect(circle.countMembers()).toBe(3);
  });

  it('should change name', () => {
    const circle = new Circle('c1', 'Old Name', 'owner1', []);
    circle.changeName('New Name');
    expect(circle.name).toBe('New Name');
  });

  describe('join', () => {
    it('should add member if not full', async () => {
      const circle = new Circle('c1', 'My Circle', 'owner1', []);
      const user = new User('u1', 'User 1', 'Normal');
      
      // Mock specification to always return false (not full)
      const mockSpec = {
        isSatisfiedBy: vi.fn().mockResolvedValue(false)
      } as unknown as CircleFullSpecification;

      await circle.join(user, mockSpec);
      
      expect(circle.members).toContain('u1');
      expect(circle.members.length).toBe(1);
    });

    it('should throw error if circle is full', async () => {
       const circle = new Circle('c1', 'My Circle', 'owner1', []);
       const user = new User('u1', 'User 1', 'Normal');

       // Mock specification to always return true (full)
       const mockSpec = {
         isSatisfiedBy: vi.fn().mockResolvedValue(true)
       } as unknown as CircleFullSpecification;

       await expect(circle.join(user, mockSpec)).rejects.toThrow('Circle is full');
       expect(circle.members).toHaveLength(0);
    });
  });
});
