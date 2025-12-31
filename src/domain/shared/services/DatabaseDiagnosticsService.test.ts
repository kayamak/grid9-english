import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DatabaseDiagnosticsService } from './DatabaseDiagnosticsService';
import { ISentenceDrillRepository } from "@/domain/practice/repositories/ISentenceDrillRepository";
import { IUserRepository } from "@/domain/users/repositories/IUserRepository";
import { User, UserType } from "@/domain/users/entities/User";
import { SentenceDrill } from '@/domain/practice/entities/SentenceDrill';

// Helper to create mock User
const createMockUser = (id: string, name: string) => User.reconstruct(id, name, 'google' as UserType);
// Helper to create mock Drill
const createMockDrill = () => SentenceDrill.reconstruct({
    id: 'drill-1',
    sentencePattern: 'DO_SVO',
    english: 'I like it.',
    japanese: '私はそれが好きです。',
    sortOrder: 1
});

describe('DatabaseDiagnosticsService', () => {
  let drillRepoMock: ISentenceDrillRepository;
  let userRepoMock: IUserRepository;
  let service: DatabaseDiagnosticsService;

  beforeEach(() => {
    drillRepoMock = {
      findAll: vi.fn(),
      findByPattern: vi.fn(),
      findUniquePatterns: vi.fn(),
      save: vi.fn(),
      count: vi.fn()
    };
    userRepoMock = {
      save: vi.fn(),
      find: vi.fn(),
      findByName: vi.fn(),
      findMany: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
      count: vi.fn()
    };
    service = new DatabaseDiagnosticsService(drillRepoMock, userRepoMock);
  });

  describe('checkCombinedStatus', () => {
    it('should aggregate data from repository correctly', async () => {
      // Setup Mocks
      const mockPatterns = ['SV', 'SVO'];
      const mockCount = 10;
      const mockSVO = [createMockDrill()];

      vi.mocked(drillRepoMock.findUniquePatterns).mockResolvedValue(mockPatterns);
      vi.mocked(drillRepoMock.count).mockResolvedValue(mockCount);
      vi.mocked(drillRepoMock.findByPattern).mockResolvedValue(mockSVO);

      // Execute
      const result = await service.checkCombinedStatus();

      // Verify
      expect(result.patterns).toEqual(mockPatterns);
      expect(result.drillsCount).toBe(mockCount);
      expect(result.svoSample).toEqual(mockSVO[0]);
      expect(drillRepoMock.findUniquePatterns).toHaveBeenCalled();
      expect(drillRepoMock.count).toHaveBeenCalled();
      expect(drillRepoMock.findByPattern).toHaveBeenCalledWith('DO_SVO');
    });

    it('should handle empty svo sample gracefully', async () => {
        vi.mocked(drillRepoMock.findUniquePatterns).mockResolvedValue([]);
        vi.mocked(drillRepoMock.count).mockResolvedValue(0);
        vi.mocked(drillRepoMock.findByPattern).mockResolvedValue([]);
  
        const result = await service.checkCombinedStatus();
  
        expect(result.svoSample).toBeNull();
    });
  });

  describe('testConnection', () => {
      it('should return successful connection result with user data', async () => {
          // Setup Mocks
          const mockUsers = [
              createMockUser('1', 'Alice'),
              createMockUser('2', 'Bob'),
              createMockUser('3', 'Charlie'),
              createMockUser('4', 'Dave'),
              createMockUser('5', 'Eve'),
              createMockUser('6', 'Frank') 
          ];
          const mockTestUser = createMockUser('test-connection', 'Test Connection User');

          vi.mocked(userRepoMock.findAll).mockResolvedValue(mockUsers);
          vi.mocked(userRepoMock.find).mockResolvedValue(mockTestUser);

          // Execute
          const result = await service.testConnection();

          // Verify
          expect(result.success).toBe(true);
          expect(result.message).toContain('successful');
          expect(result.data.userCount).toBe(6);
          expect(result.data.testUserExists).toBe(true);
          // Should slice to 5
          expect(result.data.users).toHaveLength(5);
          expect(result.data.users[0].name).toBe('Alice');
      });

      it('should handle missing test user correctly', async () => {
        vi.mocked(userRepoMock.findAll).mockResolvedValue([]);
        vi.mocked(userRepoMock.find).mockResolvedValue(null);

        const result = await service.testConnection();

        expect(result.data.testUserExists).toBe(false);
        expect(result.data.userCount).toBe(0);
      });
  });
});
