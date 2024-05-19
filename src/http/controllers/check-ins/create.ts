import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCheckInService } from '@/http/services/factories/make-check-in-service'


export async function create(
	request: FastifyRequest, 
	reply: FastifyReply
) : Promise<FastifyReply> {

	const createCheckInParamsSchema = z.object({
		gymId: z.string().uuid()
	})

	const createCheckInBodySchema = z.object({
		latitude: z.number().refine(value => {
			return Math.abs(value) <= 90
		}),

		longitude: z.number().refine(value => {
			return Math.abs(value) <= 180
		}),
	})

	const { sub } = request.user
	const { gymId } = createCheckInParamsSchema.parse(request.params)
	const {latitude, longitude} = createCheckInBodySchema.parse(request.body)


	const createCheckInService = makeCheckInService()

	await createCheckInService.execute({
		gymId,
		userId: sub,
		userLatitude: latitude,
		userLongitude: longitude
	})

	
	return reply.status(201).send()
}

