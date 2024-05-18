import { Gym } from '@prisma/client'
import { GymsRepository } from '@/respositories/gyms-repository'

interface FetchNearByGymsServiceRequest {
    userLatitude: number
    userLongitude: number
}

interface FetchNearByGymsServiceResponse {
	gyms: Gym[]
}

export class FetchNearByGymsService {
	
	constructor(
		private gymsRepository: GymsRepository
	) {}

	async execute({
		userLatitude,
		userLongitude
	} : FetchNearByGymsServiceRequest) : Promise<FetchNearByGymsServiceResponse> {

		const gyms = await this.gymsRepository.findManyNearby({
			latitude: userLatitude,
			longitude: userLongitude
		})

		return {
			gyms
		}
	}
}
