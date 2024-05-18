import { PrismaGymsRepository } from '@/respositories/prisma/prisma-gyms-repository'
import { CreateGymService } from '../create-gym'

export function makeCreateGymService() {
	const prismaGymRepository = new PrismaGymsRepository()
	const service = new CreateGymService(prismaGymRepository)

	return service
}