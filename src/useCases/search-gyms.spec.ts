import { InMemoryGymsRepository } from '@/repositories/inMemory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';
import { beforeEach, describe, expect, it } from 'vitest';

let gymsRepositry: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepositry = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepositry);
  });

  it('should be able to search for gyms', async () => {
    await gymsRepositry.create({
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: -23.55052,
      longitude: -46.633308,
    });

    await gymsRepositry.create({
      title: 'TypeScript Gym',
      description: '',
      phone: '',
      latitude: -23.55052,
      longitude: -46.633308,
    });

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Javascript Gym' }),]);
  });

  it('should be able to fetch paginated search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepositry.create({
        title: `Javascript Gym ${i}`,
        description: '',
        phone: '',
        latitude: -23.55052,
        longitude: -46.633308,
      }); 
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym 21' }),
      expect.objectContaining({ title: 'Javascript Gym 22' }),
    ]);
  });
});
