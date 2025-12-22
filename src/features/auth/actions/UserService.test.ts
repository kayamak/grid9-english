
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from './UserService';
import { IUserRepository } from '@/domain/users/repositories/IUserRepository';
import { User } from '@/domain/users/entities/User';

describe('UserService', () => {
    let userService: UserService;
    let mockUserRepo: IUserRepository;

    beforeEach(() => {
        mockUserRepo = {
            save: vi.fn(),
            find: vi.fn(),
            findByName: vi.fn(),
            findMany: vi.fn(),
            findAll: vi.fn(),
            delete: vi.fn(),
        } as unknown as IUserRepository;

        userService = new UserService(mockUserRepo);
    });

    describe('register', () => {
        it('should register a new user', async () => {
            vi.mocked(mockUserRepo.findByName).mockResolvedValue(null);

            const userId = await userService.register('New User');
            
            expect(userId).toBeDefined();
            expect(mockUserRepo.save).toHaveBeenCalled();
            const savedUser = vi.mocked(mockUserRepo.save).mock.calls[0][0] as User;
            expect(savedUser.name).toBe('New User');
            expect(savedUser.type).toBe('Normal');
        });

        it('should throw if user name already exists', async () => {
            const existingUser = User.reconstruct('u1', 'New User', 'Normal');
            vi.mocked(mockUserRepo.findByName).mockResolvedValue(existingUser);

            await expect(userService.register('New User')).rejects.toThrow('User already exists');
            expect(mockUserRepo.save).not.toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('should update user name', async () => {
            const user = User.reconstruct('u1', 'Old Name', 'Normal');
            vi.mocked(mockUserRepo.find).mockResolvedValue(user);
            vi.mocked(mockUserRepo.findByName).mockResolvedValue(null);

            await userService.update('u1', 'New Name');
            
            expect(user.name).toBe('New Name');
            expect(mockUserRepo.save).toHaveBeenCalledWith(user);
        });

        it('should throw if user not found', async () => {
            vi.mocked(mockUserRepo.find).mockResolvedValue(null);
            await expect(userService.update('u1', 'New Name')).rejects.toThrow('User not found');
        });

        it('should throw if new name is taken by another user', async () => {
            const user = User.reconstruct('u1', 'Old Name', 'Normal');
            const otherUser = User.reconstruct('u2', 'New Name', 'Normal');
            
            vi.mocked(mockUserRepo.find).mockResolvedValue(user);
            vi.mocked(mockUserRepo.findByName).mockResolvedValue(otherUser);

            await expect(userService.update('u1', 'New Name')).rejects.toThrow('User name already exists');
        });
    });
});
