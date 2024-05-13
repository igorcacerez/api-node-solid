import { UsersRepository } from '@/respositories/users-repository';
import { InvalidCredentialError } from './errors/invalid-credentials';
import { compare } from 'bcryptjs';
import { User } from '@prisma/client';


interface AuthenticateServiceRequest {
    email: string,
    password: string
}

interface AuthenticateSeriveResponse {
    user: User
}


export class AuthenticateService {
	constructor(
        private usersRepository: UsersRepository
	) {}

	async execute({
		email, 
		password
	} : AuthenticateServiceRequest) : Promise<AuthenticateSeriveResponse> {
		const user = await this.usersRepository.findByEmail(email)

		if (!user) throw new InvalidCredentialError()

		const doesPasswordMatches = await compare(password, user.password_hash)

		if (!doesPasswordMatches) throw new InvalidCredentialError()

		return {user}
	}
}