import { prisma } from '@/lib/prisma';
import { Prisma, User } from '@prisma/client';
import { UsersRepository } from '../users-repository';

export class PrismaUsersRepository implements UsersRepository {
	async findById(id: string): Promise<User | null> {
		const getUserWhitId = await prisma.user
			.findUnique({
				where: {
					id: id
				}
			})

		return getUserWhitId || null
	}

	async findByEmail(email: string): Promise<User | null> {
		const getUserWithSameEmail = await prisma.user
			.findUnique({
				where: {
					email: email
				}
			})

		return getUserWithSameEmail || null
	}

	async create(data: Prisma.UserCreateInput) : Promise<User> {
		const user = await prisma
			.user
			.create({
				data
			})

		return user
	}
}