import { FetchUserCheckInsService } from '../fetch-user-check-ins-history'
import { PrismaCheckInsRepository } from '@/respositories/prisma/prisma-check-ins-repository'

export function makeFetchUserCheckInsHistoryService() {
	const prismaCheckInsRepository = new PrismaCheckInsRepository()
	const service = new FetchUserCheckInsService(prismaCheckInsRepository)

	return service
}