import { PrismaGymsRepository } from '@/respositories/prisma/prisma-gyms-repository'
import { SearchGymService } from '../search-gyms'

export function makeSearchGymsService() {
	const prismaGymRepository = new PrismaGymsRepository()
	const service = new SearchGymService(prismaGymRepository)

	return service
}