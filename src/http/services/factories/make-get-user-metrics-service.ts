import { GetUserMetricsService } from '../get-user-metrics'
import { PrismaCheckInsRepository } from '@/respositories/prisma/prisma-check-ins-repository'

export function makeGetUserMetricsService() {
	const prismaCheckInsRepository = new PrismaCheckInsRepository()
	const service = new GetUserMetricsService(prismaCheckInsRepository)

	return service
}