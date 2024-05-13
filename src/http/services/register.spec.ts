import { beforeEach, describe, expect, test } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

let usersRepository : InMemoryUsersRepository
let sut : RegisterService

describe('Registro de usuário', () => {

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new RegisterService(usersRepository)
	})

	test('A senha do usuário deve ser um hash', async () => {

		const { user } = await sut.execute({
			name: 'Usuario Teste', 
			email: 'usuario@teste.com',
			password: '123456'
		})

		const isPasswordHashCorrected = await compare('123456', user.password_hash) 

		expect(isPasswordHashCorrected).toEqual(true)
	})

	test('Não deve ser possível se cadastrar com o mesmo email', async () => {

		await sut.execute({
			name: 'Teste',
			email: 'teste@gmail.com',
			password: '123456'
		})

		await expect(() => 
			sut.execute({
				name: 'Teste',
				email: 'teste@gmail.com',
				password: '123456'
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError)

	})

	test('O usuário deve ser cadastrado', async () => {

		const { user } = await sut.execute({
			name: 'Teste',
			email: 'cadastro_correto@gmail.com',
			password: '123456'
		})

		expect(user.id).toEqual(expect.any(String))
	})
})