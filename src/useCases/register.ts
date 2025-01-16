import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6);

  if (await prisma.user.findUnique({ where: { email } })) {
    throw new Error('E-mail already exists.');
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password_hash,
    },
  });
}
