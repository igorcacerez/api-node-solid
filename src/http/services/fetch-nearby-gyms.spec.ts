import { beforeEach, describe, expect, test} from 'vitest';
import { GymsRepository } from '@/respositories/gyms-repository';
import { InMemoryGymsRepository } from '@/respositories/in-memory/in-memory-gyms-repository';
import { FetchNearByGymsService } from './fetch-nearby-gyms';

let gymsRepository: GymsRepository
let sut: FetchNearByGymsService

describe('Busca de Academias Próximas', () => {

	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new FetchNearByGymsService(gymsRepository)
	})


	test('Deve buscar uma academia próxima do usuário', async () => {

		// User = -21.2873546,-50.3411394
		// Academia Próxima = -21.283196, -50.322428
		// Academia Longe = -21.413373, -50.079772

	    
		await gymsRepository.create({
			title: 'Academia Perto', 
			description: null,
			phone: null,
			latitude:  -21.283196,
			longitude: -50.322428
		})

		await gymsRepository.create({
			title: 'Academia Longe', 
			description: null,
			phone: null,
			latitude: -21.413373,
			longitude: -50.079772
		})

		const {gyms} = await sut.execute({
			userLatitude: -21.2873546,
			userLongitude: -50.3411394
		})

		expect(gyms).toHaveLength(1)
		expect(gyms)
			.toEqual([
				expect.objectContaining({title: 'Academia Perto'})
			])
        
	})
})