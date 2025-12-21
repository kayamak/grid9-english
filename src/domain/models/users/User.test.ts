
import { describe, it, expect } from 'vitest';
import { User } from './User';

describe('User', () => {
  it('should create a user', () => {
    const user = new User('u1', 'John', 'Normal');
    expect(user.id).toBe('u1');
    expect(user.name).toBe('John');
    expect(user.type).toBe('Normal');
    expect(user.isPremium).toBe(false);
  });

  it('should upgrade to premium', () => {
    const user = new User('u1', 'John', 'Normal');
    user.upgrade();
    expect(user.type).toBe('Premium');
    expect(user.isPremium).toBe(true);
  });

  it('should downgrade to normal', () => {
    const user = new User('u1', 'John', 'Premium');
    user.downgrade();
    expect(user.type).toBe('Normal');
    expect(user.isPremium).toBe(false);
  });

  it('should change name', () => {
    const user = new User('u1', 'John', 'Normal');
    user.changeName('Jane');
    expect(user.name).toBe('Jane');
  });

  it('should throw error for invalid values', () => {
       expect(() => new User('', 'Name', 'Normal')).toThrow('Id cannot be null');
       expect(() => new User('id', '', 'Normal')).toThrow('Name cannot be null');
  });
});
