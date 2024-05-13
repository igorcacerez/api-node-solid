import { beforeEach, describe, expect, test } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { InvalidCredentialError } from './errors/invalid-credentials'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('Autenticação de usuário', () => {

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new AuthenticateService(usersRepository)
	})

	test('O usuário deve conseguir autenticar', async () => {
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
		await expect(() =>
			sut.execute({
				email: 'usuario@teste.com',
				password: '123456'
			})
		).rejects.toBeInstanceOf(InvalidCredentialError)
	})


	test('Deve retornar um erro senha inválida', async () => {
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