import { PrismaGymsRepository } from '@/respositories/prisma/prisma-gyms-repository'
import { CheckInService } from '../check-in'
import { PrismaCheckInsRepository } from '@/respositories/prisma/prisma-check-ins-repository'

export function makeCheckInService() {
	const prismaCheckInsRepository = new PrismaCheckInsRepository()
	const prismaGymRepository = new PrismaGymsRepository()
    
	const service = new CheckInService(prismaCheckInsRepository, prismaGymRepository)

	return service
}