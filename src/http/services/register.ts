import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/respositories/prisma-users-repository'
import { hash } from 'bcryptjs'

interface RegisterServiceRequest {
    name: string,
    email: string,
    password: string
}

export async function registerService({
	name,
	email,
	password
}: RegisterServiceRequest) : Promise<void> {
    
	const password_hash = await hash(password, 6)

	const getUserWithSameEmail = await prisma.user
		.findUnique({
			where: {
				email: email
			}
		})

	if (getUserWithSameEmail) {
		throw new Error('Email provided is already registered')
	}

	const prismaUsersRepository = new PrismaUsersRepository()

	await prismaUsersRepository.create({
		name, email, password_hash
	})
}