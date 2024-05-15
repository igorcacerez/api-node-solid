import { CheckInsRepository } from '@/respositories/checkin-respository';


interface GetUserMetricsServiceRequest {
    userId: string
}

interface GetUserMetricsServiceResponse {
    checkInsCount : number
}


export class GetUserMetricsService {
	constructor(
        private checkInsRepository: CheckInsRepository
	) {}

	async execute({
		userId
	} : GetUserMetricsServiceRequest) : Promise<GetUserMetricsServiceResponse> {

		const checkInsCount = await this.checkInsRepository
			.countByUserId(userId)

		return {
			checkInsCount,
		}
	}
}