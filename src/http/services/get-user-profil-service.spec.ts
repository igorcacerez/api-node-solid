import { describe, expect, test, beforeEach } from 'vitest';
import { GetUserProfileService } from './get-user-profile';
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository';
import { randomUUID } from 'node:crypto';
import { hash } from 'bcryptjs';
import { ResourceNotFoundError } from './errors/resource-not-found-error';


let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileService

describe('Pegar perfil do usário', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new GetUserProfileService(usersRepository)
	})

	test('Deve retornar o usuário pelo ID', async () => {
		const userCreated = await usersRepository.create({
			id: randomUUID(),
			email: 'user@gmail.com',
			name: 'Teste',
			password_hash: await hash('123456', 6)
		})

		const { user } = await sut.execute({
			userId: userCreated.id
		})

		expect(user.id).toEqual(userCreated.id)
	})
    
	test('Deve retornar o erro de Id não existente', async () => {
		await usersRepository.create({
			id: randomUUID(),
			email: 'user@gmail.com',
			name: 'Teste',
			password_hash: await hash('123456', 6)
		})

		await expect(() => 
			sut.execute({
				userId: randomUUID()
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})