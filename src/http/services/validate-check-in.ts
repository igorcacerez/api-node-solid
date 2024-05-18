import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@/respositories/checkin-respository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import dayjs from 'dayjs';
import { ValidationCheckInLaterError } from './errors/validation-check-in-later-error';


interface ValidateCheckInServiceRequest {
    checkInId: string
}

interface ValidateCheckInServiceResponse {
    checkIn: CheckIn
}


export class ValidateCheckInService {
	constructor(
        private checkInsRepository: CheckInsRepository
	) {}

	async execute({
		checkInId
	} : ValidateCheckInServiceRequest) : Promise<ValidateCheckInServiceResponse> {

		const checkIn = await this.checkInsRepository.findById(checkInId)

		if (!checkIn) throw new ResourceNotFoundError()

		// diff retorna a diferença entro 2 datas
		const differentInMinutesFromCheckInCreated = dayjs(new Date())
			.diff(checkIn.created_at, 'minutes')
        
		if (differentInMinutesFromCheckInCreated > 20) {
			throw new ValidationCheckInLaterError()
		}

		checkIn.validated_at = new Date()
		const checkInSave = await this.checkInsRepository.save(checkIn)

		return {
			checkIn: checkInSave
		}
	}
}