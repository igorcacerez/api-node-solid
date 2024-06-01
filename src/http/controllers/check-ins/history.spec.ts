import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Historico de CheckIns (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})
    
	test('Deve ser retornado uma lista de historico de check-ins', async () => {
		const { token } = await createAndAuthenticateUser(app)

		// Recupera o primeiro usuario cadastrado no banco
		const user = await prisma.user.findFirstOrThrow()

		const gym = await prisma.gym.create({
			data: {
				title: 'Academia Test',
				description: 'Descricao aqui',
				phone: '18996496255',
				latitude: -21.2998186,
				longitude: -50.3582933
			}
		})

		await prisma.checkIn.createMany({
			data: [
				{
					gym_id: gym.id,
					user_id: user.id,
				},
				{
					gym_id: gym.id,
					user_id: user.id,
				}
			]
		})

		const response = await request(app.server)
			.get('/check-ins/history')
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(200)
		expect(response.body.checkIns).toEqual([
			expect.objectContaining({
				gym_id: gym.id,
				user_id: user.id
			}),
			expect.objectContaining({
				gym_id: gym.id,
				user_id: user.id
			}),
		])
	})
})