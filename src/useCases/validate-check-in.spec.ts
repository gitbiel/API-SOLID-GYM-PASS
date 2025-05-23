import { expect, describe, it, beforeEach, afterEach } from 'vitest';
import { ValidateCheckInUseCase } from './validate-check-in';
import { InMemoryCheckInsRepository } from '@/repositories/inMemory/in-memory-check-ins-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    // vi.useFakeTimers()
  });

  afterEach(() => {
    // vi.useRealTimers()
  });

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-01',
      userId: 'user-01',
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
