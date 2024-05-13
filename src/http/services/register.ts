import { UsersRepository } from '@/respositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists'

interface RegisterServiceRequest {
    name: string,
    email: string,
    password: string
}


export class RegisterService {
	
	constructor(
		private usersRepository: UsersRepository
	) {}

	async execute({ name, email, password } : RegisterServiceRequest) : Promise<void> {
		const password_hash = await hash(password, 6)

		const getUserWithSameEmail = await this.usersRepository
			.findByEmail(email)

		if (getUserWithSameEmail) {
			throw new UserAlreadyExistsError()
		}

		await this.usersRepository.create({
			name, email, password_hash
		})
	}
}
