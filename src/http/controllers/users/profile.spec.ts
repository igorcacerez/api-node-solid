import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Perfil (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})
    
	test('Deve ser possivel buscar o perfil do usuário logado', async () => {
		const { token } = await createAndAuthenticateUser(app)

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