import { InMemoryGymsRepository } from '@/repositories/inMemory/in-memory-gyms-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepositry: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch nearby gyms use case', () => {
  beforeEach(() => {
    gymsRepositry = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepositry);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepositry.create({
      title: 'Near Gym',
      description: '',
      phone: '',
      latitude: -27.0610928,
      longitude: -49.5229501,
    });

    await gymsRepositry.create({
      title: 'Far Gym',
      description: '',
      phone: '',
      latitude: -23.55052,
      longitude: -46.633308,
    });

    const { gyms } = await sut.execute({
      userLatitude: -27.0610928,
      userLongitude: -49.5229501,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
  });
});
