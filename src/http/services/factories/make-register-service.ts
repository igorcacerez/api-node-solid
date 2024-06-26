import { PrismaUsersRepository } from '@/respositories/prisma/prisma-users-repository'
import { RegisterService } from '../register'

export function makeRegisterService() {
	const prismaUsersRepository = new PrismaUsersRepository()
	const registerService = new RegisterService(prismaUsersRepository)

	return registerService
}