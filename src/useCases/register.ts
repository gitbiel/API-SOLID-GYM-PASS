import { usersRepository } from '@/repositories /users-repository-interface';
import { hash } from 'bcryptjs';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: usersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6);

    if (await this.usersRepository.findByEmail(email)) {
      throw new Error(`E-mail "${email}" already exists`);
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
