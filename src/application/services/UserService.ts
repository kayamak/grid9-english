import { IUserRepository } from '../../domain/models/users/IUserRepository';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { User } from '../../domain/models/users/User';

export class UserService {
  public userRepository: IUserRepository;

  constructor(userRepository?: IUserRepository) {
    this.userRepository = userRepository || new PrismaUserRepository();
  }

  async register(name: string): Promise<string> {
    const id = crypto.randomUUID();
    const user = new User(id, name, 'Normal');
    
    // Check if exists? Name unique? 
    // Domain rule: name must be unique (if enforced). 
    // C# implementation checks name dup in `UserRegisterInteractor`.
    const existing = await this.userRepository.findByName(name);
    if (existing) {
      throw new Error("User already exists");
    }

    await this.userRepository.save(user);
    return id;
  }

  async get(id: string) {
    const user = await this.userRepository.find(id);
    if (!user) throw new Error("User not found");
    return {
      id: user.id,
      name: user.name,
      type: user.type, // Map if needed
    };
  }

  async getAll(): Promise<{ id: string; name: string; type: string }[]> {
    const users = await this.userRepository.findAll();
    return users.map(u => ({
      id: u.id,
      name: u.name,
      type: u.type,
    }));
  }

  async update(id: string, name: string): Promise<void> {
    const user = await this.userRepository.find(id);
    if (!user) throw new Error("User not found");

    const existing = await this.userRepository.findByName(name);
    if (existing && existing.id !== id) {
      throw new Error("User name already exists");
    }

    user.changeName(name);
    await this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.find(id);
    if (!user) return; // or throw

    await this.userRepository.delete(user);
  }
}
