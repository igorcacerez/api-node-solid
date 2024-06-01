import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

interface createAndAuthenticateUserResponse {
    token: string
}

export async function createAndAuthenticateUser(app: FastifyInstance, isAdmin = false) : 
    Promise<createAndAuthenticateUserResponse> {
	 await prisma.user.create({
		data: {
			name: 'Igor',
			email: 'igor@gmail.com',
			password_hash: await hash('123456', 6),
			role: isAdmin ? 'ADMIN' : 'MEMBER'
		}
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