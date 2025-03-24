import { Prisma, CheckIn } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { CheckInsRepository } from '../check-ins-repository';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async findByUserIdOnDate(userId: string, date: Date) {
    return this.items.find((checkIn) => {
      if (checkIn.userId !== userId) {
        return false;
      }
  
      const checkInDate = new Date(checkIn.created_at);
      
      return (
        checkInDate.getFullYear() === date.getFullYear() &&
        checkInDate.getMonth() === date.getMonth() &&
        checkInDate.getDate() === date.getDate()
      );
    }) ?? null;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      userId: data.userId ?? null,
      gymId: data.gymId ?? null,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }
}
