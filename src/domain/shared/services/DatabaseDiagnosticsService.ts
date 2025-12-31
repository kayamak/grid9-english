import { ISentenceDrillRepository } from "@/domain/practice/repositories/ISentenceDrillRepository";
import { IUserRepository } from "@/domain/users/repositories/IUserRepository";

export interface DatabaseStatus {
  patterns: string[];
  drillsCount: number;
  svoSample: unknown;
  env: {
    APP_ENV: string | undefined;
    LOCAL_DATABASE_URL_SET: boolean;
    TURSO_DATABASE_URL_SET: boolean;
  };
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  data: {
    userCount: number;
    testUserExists: boolean;
    users: Array<{ id: string; name: string; type: string }>;
  };
}

export class DatabaseDiagnosticsService {
  constructor(
    private readonly sentenceDrillRepository: ISentenceDrillRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async checkCombinedStatus(): Promise<DatabaseStatus> {
     const patterns = await this.sentenceDrillRepository.findUniquePatterns();
     const drillsCount = await this.sentenceDrillRepository.count();
     const svoSamples = await this.sentenceDrillRepository.findByPattern('DO_SVO');
     const svoSample = svoSamples.length > 0 ? svoSamples[0] : null;

     return {
       patterns,
       drillsCount,
       svoSample,
       env: {
         APP_ENV: process.env.APP_ENV,
         LOCAL_DATABASE_URL_SET: !!process.env.LOCAL_DATABASE_URL,
         TURSO_DATABASE_URL_SET: !!process.env.TURSO_DATABASE_URL,
       }
     };
  }

  async testConnection(): Promise<ConnectionTestResult> {
    const users = await this.userRepository.findAll();
    const fiveUsers = users.slice(0, 5);
    const testUser = await this.userRepository.find('test-connection');

    return {
      success: true,
      message: 'Turso database connection successful!',
      data: {
        userCount: users.length,
        testUserExists: !!testUser,
        users: fiveUsers.map(u => ({ id: u.id, name: u.name, type: u.type })),
      }
    };
  }
}
