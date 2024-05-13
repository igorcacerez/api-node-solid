import { UsersRepository } from "@/respositories/users-repository";


interface AuthenticateServiceRequest {
    email: string,
    password: string
}

type AuthenticateSeriveResponse = void


export class AuthenticateService {
    constructor(
        private usersRepository: UsersRepository
    )

    async execute({
        email, 
        password
    } : AuthenticateServiceRequest) : Promise<AuthenticateSeriveResponse> {
        const user = await this.usersRepository.findByEmail(email)
    }
}