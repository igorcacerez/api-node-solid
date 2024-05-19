import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeSearchGymsService } from '@/http/services/factories/make-search-gyms-service'


export async function search(
	request: FastifyRequest, 
	reply: FastifyReply
) : Promise<FastifyReply> {

	const searchGymsQuerySchema = z.object({
		query: z.string(),
		page: z.coerce.number().min(1).default(1)
	})

	const {page, query} = searchGymsQuerySchema.parse(request.query)

	const searchGymsService = makeSearchGymsService()

	const { gyms } = await searchGymsService.execute({
		query, page
	})

	
	return reply.status(200).send({
		gyms
	})
}

