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
		const token = await reply.jwtSign({
			role: user.role
		}, {
			sign: {
				sub: user.id
			}
		})

		const refreshtoken = await reply.jwtSign({
			role: user.role
		}, {
			sign: {
				sub: user.id,
				expiresIn: '7d' // 7 dias
			}
		})

		return reply
			.setCookie('refreshtoken', refreshtoken, {
				path: '/',
				secure: true, // Criptografia via HTTPS e Front-End não consegue ler
				sameSite: true, // Só é acessivel neste site
				httpOnly: true // apenas o back pode acessar
			})
			.status(200).send({
				token
			})

	} catch(err) {
		throw err
	}
}

