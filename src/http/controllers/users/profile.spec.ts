import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('Perfil (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})
    
	test('Deve ser possivel buscar o perfil do usuário logado', async () => {
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


		const response = await request(app.server)
			.get('/me')
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(200)
		expect(response.body).toEqual({
			user: expect.objectContaining({
				email: 'igor@gmail.com'
			})
		})
	})
})