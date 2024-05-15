import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@/respositories/checkin-respository';


interface FetchUserCheckInsServiceRequest {
    userId: string,
	page?: number
}

interface FetchUserCheckInsServiceResponse {
    checkIns: CheckIn[]
}


export class FetchUserCheckInsService {
	constructor(
        private checkInsRepository: CheckInsRepository
	) {}

	async execute({
		userId,
		page = 1
	} : FetchUserCheckInsServiceRequest) : Promise<FetchUserCheckInsServiceResponse> {

		const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)

		return {
			checkIns,
		}
	}
}