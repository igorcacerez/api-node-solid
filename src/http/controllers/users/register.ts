import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeRegisterService } from '../../services/factories/make-register-service'


export async function register(
	request: FastifyRequest, 
	reply: FastifyReply
) : Promise<FastifyReply> {

	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6)   
	})

	const {name, email, password} = registerBodySchema.parse(request.body)

	try {
		const registerService = makeRegisterService()

		await registerService.execute({
			name, email, password
		})

	} catch(err) {
		throw err
	}

	return reply.status(201).send()
}

