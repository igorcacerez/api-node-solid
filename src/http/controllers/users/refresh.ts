import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(
	request: FastifyRequest, 
	reply: FastifyReply
) : Promise<FastifyReply> {

	console.log('aa')

	// Verifica se tem o token no cookie 
	await request.jwtVerify({ onlyCookie: true })

	try {

		//Cria o token JWT
		const token = await reply.jwtSign({}, {
			sign: {
				sub: request.user.sub
			}
		})

		const refreshtoken = await reply.jwtSign({}, {
			sign: {
				sub: request.user.sub,
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

