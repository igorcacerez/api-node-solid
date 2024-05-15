import { beforeEach, describe, expect, test} from 'vitest';
import { GymsRepository } from '@/respositories/gyms-repository';
import { InMemoryGymsRepository } from '@/respositories/in-memory/in-memory-gyms-repository';
import { CreateGymService } from './create-gym';

let gymsRepository: GymsRepository
let sut: CreateGymService

describe('Registro de Academia', () => {

	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new CreateGymService(gymsRepository)
	})


	test('Deve registrar uma academia', async () => {
	
		const { gym } = await sut.execute({
			title: 'Gym Test', 
			description: null,
			phone: null,
			latitude: -21.2838571,
			longitude: -50.3352923
		})

		expect(gym.id).toEqual(expect.any(String))
	})

})