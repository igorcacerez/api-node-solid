import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Criação de Academia (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})
    
	test('Deve ser possivel criar uma academia', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const response = await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Academia Test',
				description: 'Descricao aqui',
				phone: '18996496255',
				latitude: -21.2998186,
				longitude: -50.3582933
			})

		expect(response.status).toEqual(201)
	})
})