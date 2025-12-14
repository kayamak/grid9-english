import { User } from './User';

export interface IUserRepository {
  save(user: User): Promise<void>;
  find(id: string): Promise<User | null>;
  findByName(name: string): Promise<User | null>;
  findMany(ids: string[]): Promise<User[]>;
  findAll(): Promise<User[]>;
  delete(user: User): Promise<void>;
}
