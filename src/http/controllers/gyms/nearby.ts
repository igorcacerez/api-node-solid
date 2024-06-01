import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchNearByGymsService } from '@/http/services/factories/make-fetch-nearby-gyms-service'


export async function nearby(
	request: FastifyRequest, 
	reply: FastifyReply
) : Promise<FastifyReply> {

	const nearbyGymsQuerySchema = z.object({
		latitude: z.coerce.number().refine(value => {
			return Math.abs(value) <= 90
		}),

		longitude: z.coerce.number().refine(value => {
			return Math.abs(value) <= 180
		}),
	})

	const {latitude, longitude} = nearbyGymsQuerySchema.parse(request.query)

	const nearbyGymsService = makeFetchNearByGymsService()

	const { gyms } = await nearbyGymsService.execute({
		userLatitude: latitude,
		userLongitude: longitude
	})

	
	return reply.status(200).send({
		gyms
	})
}

