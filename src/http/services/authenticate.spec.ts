import { describe, expect, test } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { InvalidCredentialError } from './errors/invalid-credentials'

describe('Autenticação de usuário', () => {

	test('O usuário deve conseguir autenticar', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const sut = new AuthenticateService(usersRepository)

		await usersRepository.create({
			name: 'Usuario Teste', 
			email: 'usuario@teste.com',
			password_hash: await hash('123456', 6)
		})

		const { user } = await sut.execute({
			email: 'usuario@teste.com',
			password: '123456'
		})

		expect(user.email).toEqual(expect.any(String))
	})


	test('Deve retornar um erro de credencial inválida', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const sut = new AuthenticateService(usersRepository)

		await expect(() =>
			sut.execute({
				email: 'usuario@teste.com',
				password: '123456'
			})
		).rejects.toBeInstanceOf(InvalidCredentialError)
	})


	test('Deve retornar um erro senha inválida', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const sut = new AuthenticateService(usersRepository)

		await usersRepository.create({
			name: 'Usuario Teste', 
			email: 'usuario@teste.com',
			password_hash: await hash('123456', 6)
		})

		await expect(() =>
			sut.execute({
				email: 'usuario@teste.com',
				password: '123456789'
			})
		).rejects.toBeInstanceOf(InvalidCredentialError)
	})
})