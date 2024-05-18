import { InMemoryCheckInsRepository } from '@/respositories/in-memory/in-memory-check-ins-repository';
import { beforeEach, describe, expect, test, vi, afterEach} from 'vitest';
import { ValidateCheckInService } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ValidationCheckInLaterError } from './errors/validation-check-in-later-error';

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInService

describe('Validação de check-in ', () => {

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new ValidateCheckInService(checkInsRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})


	test('Deve ser possivel validar um check-in', async () => {

		const createdCheckIn = await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01',
		})

		const { checkIn } = await sut.execute({
			checkInId: createdCheckIn.id
		})
	

		expect(checkIn.validated_at).toEqual(expect.any(Date))
	})


	test('Não pode ser validado um check-in inexistente', async () => {

		await expect(() => 

			sut.execute({
				checkInId: 'não-existe'
			})

		).rejects.toBeInstanceOf(ResourceNotFoundError)

	})

	test('Não pode validar um check-in após 20 min de sua criação', async () => {
		vi.setSystemTime(new Date(2024, 0, 1, 13, 40))

		const createdCheckIn = await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01',
		})

		const _21minutes_ms = 1000 * 60 * 21
		vi.advanceTimersByTime(_21minutes_ms)

		await expect(() => 
			sut.execute({
				checkInId: createdCheckIn.id
			})
		).rejects.toBeInstanceOf(ValidationCheckInLaterError)
	})
})