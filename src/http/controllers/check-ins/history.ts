import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchUserCheckInsHistoryService } from '@/http/services/factories/make-fetch-user-check-ins-history-service'


export async function history(
	request: FastifyRequest, 
	reply: FastifyReply
) : Promise<FastifyReply> {

	const checkInHistoryQuerySchema = z.object({
		page: z.coerce.number().min(1).default(1)
	})

	const { page } = checkInHistoryQuerySchema.parse(request.query)

	const fetchUserCheckInsHistory = makeFetchUserCheckInsHistoryService()

	const { checkIns } = await fetchUserCheckInsHistory.execute({
		page, 
		userId: request.user.sub
	})

	
	return reply.status(200).send({
		checkIns
	})
}

