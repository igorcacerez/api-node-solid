import { describe, expect, test } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

describe('Registro de usuário', () => {

	test('A senha do usuário deve ser um hash', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const registerService = new RegisterService(usersRepository)

		const { user } = await registerService.execute({
			name: 'Usuario Teste', 
			email: 'usuario@teste.com',
			password: '123456'
		})

		const isPasswordHashCorrected = await compare('123456', user.password_hash) 

		expect(isPasswordHashCorrected).toEqual(true)
	})

	test('Não deve ser possível se cadastrar com o mesmo email', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const registerService = new RegisterService(usersRepository)

		await registerService.execute({
			name: 'Teste',
			email: 'teste@gmail.com',
			password: '123456'
		})

		await expect(() => 
			registerService.execute({
				name: 'Teste',
				email: 'teste@gmail.com',
				password: '123456'
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError)

	})

	test('O usuário deve ser cadastrado', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const registerService = new RegisterService(usersRepository)

		const { user } = await registerService.execute({
			name: 'Teste',
			email: 'cadastro_correto@gmail.com',
			password: '123456'
		})

		expect(user.id).toEqual(expect.any(String))
	})
})