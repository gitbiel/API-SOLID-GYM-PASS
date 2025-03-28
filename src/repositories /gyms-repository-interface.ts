import { Gym, Prisma } from '@prisma/client';

export interface GymsRepository {
  create(Gym: Prisma.GymCreateInput): Promise<Gym>;
  findById(id: string): Promise<Gym | null>;
}
