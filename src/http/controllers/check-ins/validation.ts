import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeValidateCheckInService } from '@/http/services/factories/make-validate-check-in-service'


export async function validate(
	request: FastifyRequest, 
	reply: FastifyReply
) : Promise<FastifyReply> {

	const validadeCheckInParamsSchema = z.object({
		checkInId: z.string().uuid()
	})


	const { checkInId } = validadeCheckInParamsSchema.parse(request.params)
	const validateCheckInService = makeValidateCheckInService()

	await validateCheckInService.execute({
		checkInId
	})

	
	return reply.status(204).send()
}

