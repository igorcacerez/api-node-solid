import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Validação de CheckIns (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})
    
	test('Deve ser possivel validar um check-in', async () => {
		const { token } = await createAndAuthenticateUser(app, true)

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

		let checkIn = await prisma.checkIn.create({
			data: {
				gym_id: gym.id,
				user_id: user.id,
			}
		})

		const response = await request(app.server)
			.patch(`/check-ins/${checkIn.id}/validate`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(204)

		checkIn = await prisma.checkIn.findUniqueOrThrow({
			where: {
				id: checkIn.id
			}
		})

		expect(checkIn.validated_at).toEqual(expect.any(Date))
	})
})