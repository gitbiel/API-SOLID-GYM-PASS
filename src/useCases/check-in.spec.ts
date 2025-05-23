import { InMemoryCheckInsRepository } from '@/repositories/inMemory/in-memory-check-ins-repository';
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/inMemory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheakInsError } from './errors/max-number-of-cheak-ins-error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      title: '',
      description: null,
      phone: null,
      latitude: -23.5236559,
      longitude: -46.3720675,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.5236559,
      userLongitude: -46.3720675,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.5236559,
      userLongitude: -46.3720675,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -23.5236559,
        userLongitude: -46.3720675,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheakInsError);
  });

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.5236559,
      userLongitude: -46.3720675,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.5236559,
      userLongitude: -46.3720675,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: '',
      description: null,
      phone: null,
      latitude: new Decimal(-23.5424463),
      longitude: new Decimal(-46.3287724),
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
