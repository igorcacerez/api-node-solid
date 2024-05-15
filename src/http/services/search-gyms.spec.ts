import { beforeEach, describe, expect, test} from 'vitest';
import { GymsRepository } from '@/respositories/gyms-repository';
import { InMemoryGymsRepository } from '@/respositories/in-memory/in-memory-gyms-repository';
import { SearchGymService } from './search-gyms';

let gymsRepository: GymsRepository
let sut: SearchGymService

describe('Busca de Academias', () => {

	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new SearchGymService(gymsRepository)
	})


	test('Deve buscar uma academia pelo seu title', async () => {
	    
		await gymsRepository.create({
			title: 'SmartFit', 
			description: null,
			phone: null,
			latitude: -21.2838571,
			longitude: -50.3352923
		})

		await gymsRepository.create({
			title: 'GymFlix', 
			description: null,
			phone: null,
			latitude: -21.2838571,
			longitude: -50.3352923
		})

		const {gyms} = await sut.execute({
			query: 'GymFlix'
		})

		expect(gyms).toHaveLength(1)
		expect(gyms)
			.toEqual([
				expect.objectContaining({title: 'GymFlix'})
			])
        
	})


	test('Deve buscar uma academia pelo seu title e retornar com paginação', async () => {
	    
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `GymFlix Academy ${i}`, 
				description: null,
				phone: null,
				latitude: -21.2838571,
				longitude: -50.3352923
			})
		}

		await gymsRepository.create({
			title: 'SmartFit', 
			description: null,
			phone: null,
			latitude: -21.2838571,
			longitude: -50.3352923
		})

		const {gyms} = await sut.execute({
			query: 'GymFlix',
			page: 2
		})

		expect(gyms).toHaveLength(2)
		expect(gyms)
			.toEqual([
				expect.objectContaining({title: 'GymFlix Academy 21'}),
				expect.objectContaining({title: 'GymFlix Academy 22'})
			])
        
	})

})