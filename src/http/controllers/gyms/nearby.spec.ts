import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Busca de academias próximas (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})
    
	test('Deve ser possivel buscar uma academia próxima', async () => {
		const { token } = await createAndAuthenticateUser(app)

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Academia Perto', 
				description: null,
				phone: null,
				latitude:  -21.283196,
				longitude: -50.322428
			})

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Academia Longe', 
				description: null,
				phone: null,
				latitude: -21.413373,
				longitude: -50.079772
			})

		const response = await request(app.server)
			.get('/gyms/nearby')
			.set('Authorization', `Bearer ${token}`)
			.query({
				latitude: -21.2873546,
				longitude: -50.3411394
			})
			.send()

		expect(response.status).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'Academia Perto'
			})
		])
	})
})