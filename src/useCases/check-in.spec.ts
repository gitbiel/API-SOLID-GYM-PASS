import { InMemoryCheckInsRepository } from '@/repositories /inMemory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { beforeEach, describe, expect, it } from 'vitest';

let checkinRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkinRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkinRepository);
  });

  it('should to be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    });
    
    expect(checkIn.id).toEqual(expect.any(String));
  });
});
