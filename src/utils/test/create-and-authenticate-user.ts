import { FastifyInstance } from 'fastify'
import request from 'supertest'

interface createAndAuthenticateUserResponse {
    token: string
}

export async function createAndAuthenticateUser(app: FastifyInstance) : 
    Promise<createAndAuthenticateUserResponse> {
	await request(app.server)
		.post('/users')
		.send({
			name: 'Igor',
			email: 'igor@gmail.com',
			password: '123456'
		})

	const authResponse = await request(app.server)
		.post('/sessions')
		.send({
			email: 'igor@gmail.com',
			password: '123456'
		})

	const { token } = authResponse.body

	return {
		token
	}
}