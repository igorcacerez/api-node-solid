import { PrismaGymsRepository } from '@/respositories/prisma/prisma-gyms-repository'
import { FetchNearByGymsService } from '../fetch-nearby-gyms'

export function makeFetchNearByGymsService() {
	const prismaGymRepository = new PrismaGymsRepository()
	const service = new FetchNearByGymsService(prismaGymRepository)

	return service
}