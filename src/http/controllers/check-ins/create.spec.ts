import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Criação de CheckIns (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})
    
	test('Deve ser possivel criar um check-in', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const gym = await prisma.gym.create({
			data: {
				title: 'Academia Test',
				description: 'Descricao aqui',
				phone: '18996496255',
				latitude: -21.2998186,
				longitude: -50.3582933
			}
		})

		const response = await request(app.server)
			.post(`/gyms/${gym.id}/check-in`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				latitude: -21.2998186,
				longitude: -50.3582933
			})

		expect(response.status).toEqual(201)
	})
})