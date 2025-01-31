import { Prisma, User } from '@prisma/client';
import { usersRepository } from '../users-repository-interface';

export class InMemoryUsersRepository implements usersRepository {
  public users: User[] = [];

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: (this.users.length + 1).toString(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }
}
