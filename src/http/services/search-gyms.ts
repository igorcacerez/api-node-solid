import { Gym } from '@prisma/client'
import { GymsRepository } from '@/respositories/gyms-repository'

interface SearchGymServiceRequest {
    query: string
	page?: number
}

interface SearchGymServiceResponse {
	gyms: Gym[]
}

export class SearchGymService {
	
	constructor(
		private gymsRepository: GymsRepository
	) {}

	async execute({
		query,
		page = 1
	} : SearchGymServiceRequest) : Promise<SearchGymServiceResponse> {
		const gyms = await this.gymsRepository.searchMany(query, page)
		
		return {
			gyms
		}
	}
}
