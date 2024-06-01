import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('Refresh Token de Usuário (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})
    
	test('Deve ser possivel realizar a atualização de token de usuário', async () => {
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

		const cookies = authResponse.get('Set-Cookie') || []

		const response = await request(app.server)
			.patch('/token/refresh')
			.set('Cookie', cookies)
			.send()


		expect(response.status).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String)
		})

		expect(response.get('Set-Cookie')).toEqual([
			expect.stringContaining('refreshtoken')
		])
	})
})