import { Circle } from '../entities/Circle';
import { CircleFullSpecification } from '../spec/CircleFullSpecification'; // Not strictly needed here but related

export interface ICircleRepository {
  save(circle: Circle): Promise<void>;
  find(id: string): Promise<Circle | null>;
  findByName(name: string): Promise<Circle | null>;
  findAll(): Promise<Circle[]>;
  delete(circle: Circle): Promise<void>;
}
