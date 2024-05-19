import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateGymService } from '@/http/services/factories/make-create-gym-service'


export async function create(
	request: FastifyRequest, 
	reply: FastifyReply
) : Promise<FastifyReply> {

	const createGymBodySchema = z.object({
		title: z.string(),
		description : z.string().nullable(),
		phone: z.string().nullable(),

		latitude: z.number().refine(value => {
			return Math.abs(value) <= 90
		}),

		longitude: z.number().refine(value => {
			return Math.abs(value) <= 180
		}),
	})

	const {title, phone, description, latitude, longitude} = 
        createGymBodySchema.parse(request.body)


	const createGymService = makeCreateGymService()

	await createGymService.execute({
		title, description, phone, latitude, longitude
	})

	
	return reply.status(201).send()
}

