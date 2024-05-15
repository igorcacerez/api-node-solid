import { InMemoryCheckInsRepository } from '@/respositories/in-memory/in-memory-check-ins-repository';
import { beforeEach, describe, expect, test, vi, afterEach} from 'vitest';
import { CheckInService } from './check-in';
import { GymsRepository } from '@/respositories/gyms-repository';
import { InMemoryGymsRepository } from '@/respositories/in-memory/in-memory-gyms-repository';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: GymsRepository
let sut: CheckInService

describe('Check in', () => {

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckInService(checkInsRepository, gymsRepository)

		await gymsRepository.create({
			id: 'aaa',
			title: 'Gym Test', 
			description: '',
			phone: '',
			latitude: -21.2838571,
			longitude: -50.3352923
		})

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})


	test('Deve ser criado um novo checkin', async () => {
	
		const { checkIn } = await sut.execute({
			gymId: 'aaa',
			userId: 'bbbb',
			userLatitude: -21.2838571,
			userLongitude: -50.3352923
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})


	test('Não deve ser possível fazer checkin no mesmo dia', async () => {
		vi.setSystemTime(new Date(2022, 4, 14, 5, 0, 0))

		await sut.execute({
			gymId: 'aaa',
			userId: 'bbbb',
			userLatitude: -21.2838571,
			userLongitude: -50.3352923
		})


		await expect(() => 
			sut.execute({
				gymId: 'aaa',
				userId: 'bbbb',
				userLatitude: -21.2838571,
				userLongitude: -50.3352923
			})
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
	})


	test('O usuário pode checkin em diferentes dias', async () => {
		vi.setSystemTime(new Date(2022, 4, 14, 5, 0, 0))

		await sut.execute({
			gymId: 'aaa',
			userId: 'bbbb',
			userLatitude: -21.2838571,
			userLongitude: -50.3352923
		})


		vi.setSystemTime(new Date(2022, 4, 15, 5, 0, 0))

		const {checkIn} = await sut.execute({
			gymId: 'aaa',
			userId: 'bbbb',
			userLatitude: -21.2838571,
			userLongitude: -50.3352923
		})

		expect(checkIn.id).toEqual(expect.any(String))	
	})


	test('Não pode fazer o checkin a uma determinada distância da academia', async () => {
		vi.setSystemTime(new Date(2022, 4, 14, 5, 0, 0))

		await gymsRepository.create({
			id: 'gym-2',
			title: 'Gym Test', 
			description: '',
			phone: '',
			latitude: -21.2838571,
			longitude: -50.3352923
		})

		await expect(() => 
			sut.execute({
				gymId: 'gym-2',
				userId: 'user-1',
				userLatitude: -22.279062,
				userLongitude: -49.018780
			})
		).rejects.toBeInstanceOf(MaxDistanceError)
	})
})