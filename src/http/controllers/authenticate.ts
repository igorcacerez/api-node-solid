import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeAuthenticateService } from '../services/factories/make-authenticate-service'


export async function authenticate(
	request: FastifyRequest, 
	reply: FastifyReply
) : Promise<FastifyReply> {

	const authenticateBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6)   
	})

	const {email, password} = authenticateBodySchema.parse(request.body)

	try {
		const authenticateService = makeAuthenticateService()

		await authenticateService.execute({
			email, password
		})

	} catch(err) {
		throw err
	}

	return reply.status(200).send()
}

