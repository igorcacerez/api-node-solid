import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('Registro (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})
    
	test('Deve ser possivel realizar o registro de usuário', async () => {
		const response = await request(app.server)
			.post('/users')
			.send({
				name: 'Igor',
				email: 'igor@gmail.com',
				password: '123456'
			})

		expect(response.status).toEqual(201)
	})
})