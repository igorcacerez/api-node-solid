import { PrismaCheckInsRepository } from '@/respositories/prisma/prisma-check-ins-repository'
import { ValidateCheckInService } from '../validate-check-in'

export function makeValidateCheckInService() {
	const prismaCheckInsRepository = new PrismaCheckInsRepository()
	const service = new ValidateCheckInService(prismaCheckInsRepository)

	return service
}