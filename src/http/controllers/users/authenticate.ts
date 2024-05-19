import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeAuthenticateService } from '../../services/factories/make-authenticate-service'


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

		const { user } = await authenticateService.execute({
			email, password
		})

		// Cria o token JWT
		const token = await reply.jwtSign({}, {
			sign: {
				sub: user.id
			}
		})

		return reply.status(200).send({
			token
		})

	} catch(err) {
		throw err
	}
}

