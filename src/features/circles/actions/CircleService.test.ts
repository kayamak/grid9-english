
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CircleService } from './CircleService';
import { ICircleRepository } from '@/domain/circles/repositories/ICircleRepository';
import { IUserRepository } from '@/domain/users/repositories/IUserRepository';
import { User } from '@/domain/users/entities/User';
import { Circle } from '@/domain/circles/entities/Circle';

describe('CircleService', () => {
    let circleService: CircleService;
    let mockCircleRepo: ICircleRepository;
    let mockUserRepo: IUserRepository;

    beforeEach(() => {
        mockCircleRepo = {
            save: vi.fn(),
            find: vi.fn(),
            findByName: vi.fn(),
            findAll: vi.fn(),
            delete: vi.fn(),
        } as unknown as ICircleRepository;

        mockUserRepo = {
            save: vi.fn(),
            find: vi.fn(),
            findByName: vi.fn(),
            findMany: vi.fn(),
            findAll: vi.fn(),
            delete: vi.fn(),
        } as unknown as IUserRepository;

        circleService = new CircleService(mockCircleRepo, mockUserRepo);
    });

    describe('create', () => {
        it('should create a circle', async () => {
            const owner = User.reconstruct('owner1', 'Owner', 'Normal');
            vi.mocked(mockUserRepo.find).mockResolvedValue(owner);
            vi.mocked(mockCircleRepo.findByName).mockResolvedValue(null);

            const circleId = await circleService.create('My Circle', 'owner1');

            expect(circleId).toBeDefined();
            expect(mockCircleRepo.save).toHaveBeenCalled();
            // Verify save was called with correct structure
            const savedCircle = vi.mocked(mockCircleRepo.save).mock.calls[0][0] as Circle; 
            expect(savedCircle.name).toBe('My Circle');
            expect(savedCircle.ownerId).toBe('owner1');
        });

        it('should throw if owner not found', async () => {
            vi.mocked(mockUserRepo.find).mockResolvedValue(null);
            
            await expect(circleService.create('My Circle', 'owner1'))
                .rejects.toThrow('Owner not found');
            
            expect(mockCircleRepo.save).not.toHaveBeenCalled();
        });

        it('should throw if circle name already exists', async () => {
            const owner = User.reconstruct('owner1', 'Owner', 'Normal');
            const existingCircle = Circle.reconstruct('c1', 'My Circle', 'owner2', []);
            
            vi.mocked(mockUserRepo.find).mockResolvedValue(owner);
            vi.mocked(mockCircleRepo.findByName).mockResolvedValue(existingCircle);

            await expect(circleService.create('My Circle', 'owner1'))
                .rejects.toThrow('Circle already exists');
                
            expect(mockCircleRepo.save).not.toHaveBeenCalled();
        });
    });

    describe('join', () => {
        it('should join a circle', async () => {
             const circle = Circle.reconstruct('c1', 'My Circle', 'owner1', []);
             const member = User.reconstruct('m1', 'Member', 'Normal');
             // Mock owner finding for spec check? No, spec uses findMany for members
             // Circle has 0 members.
             
             vi.mocked(mockCircleRepo.find).mockResolvedValue(circle);
             vi.mocked(mockUserRepo.find).mockResolvedValue(member);
             // Spec will check members. Circle has 0 members.
             // findMany in spec might be called with ownerId if checking premium count for logic?
             // Spec logic: isSatisfiedBy(circle). 
             // circle members = []. owner = owner1.
             // spec calls findMany(['owner1']).
             
             const owner = User.reconstruct('owner1', 'Owner', 'Normal');
             vi.mocked(mockUserRepo.findMany).mockResolvedValue([owner]);

             await circleService.join('c1', 'm1');

             expect(circle.members).toContain('m1');
             expect(mockCircleRepo.save).toHaveBeenCalledWith(circle);
        });

        it('should throw if circle not found', async () => {
            vi.mocked(mockCircleRepo.find).mockResolvedValue(null);
            await expect(circleService.join('c1', 'm1')).rejects.toThrow('Circle not found');
        });

        it('should throw if member not found', async () => {
            const circle = Circle.reconstruct('c1', 'My Circle', 'owner1', []);
            vi.mocked(mockCircleRepo.find).mockResolvedValue(circle);
            vi.mocked(mockUserRepo.find).mockResolvedValue(null);

            await expect(circleService.join('c1', 'm1')).rejects.toThrow('Member not found');
        });
    });
});
