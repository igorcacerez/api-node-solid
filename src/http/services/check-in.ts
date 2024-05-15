import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@/respositories/checkin-respository';
import { GymsRepository } from '@/respositories/gyms-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';


interface CheckInServiceRequest {
    userId: string,
	gymId: string,
	userLatitude: number,
	userLongitude: number
}

interface CheckInServiceResponse {
    checkIn: CheckIn
}


export class CheckInService {
	constructor(
        private checkInsRepository: CheckInsRepository,
		private gymsRepository: GymsRepository
	) {}

	async execute({
		userId,
		gymId,
		userLatitude,
		userLongitude
	} : CheckInServiceRequest) : Promise<CheckInServiceResponse> {

		const gym = await this.gymsRepository.findById(gymId)
		if (!gym) throw new ResourceNotFoundError()


		const checkInOnToday = await this.checkInsRepository
			.findByUserIdOnDate(userId, new Date())

		if (checkInOnToday) throw new MaxNumberOfCheckInsError()


		const distance = getDistanceBetweenCoordinates(
			{
				latitude: Number(gym.latitude), 
				longitude: Number(gym.longitude)
			},
			{
				latitude: userLatitude,
				longitude: userLongitude
			}
		)

		const MAX_DISTANCE_IN_KM = 0.1 // 100m
		
		if (distance > MAX_DISTANCE_IN_KM) throw new MaxDistanceError()
		

		const checkIn = await this.checkInsRepository.create({
			user_id: userId,
			gym_id: gymId
		})

		return {
			checkIn,
		}
	}
}