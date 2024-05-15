import { InMemoryCheckInsRepository } from '@/respositories/in-memory/in-memory-check-ins-repository';
import { beforeEach, describe, expect, test} from 'vitest';
import { FetchUserCheckInsService } from './fetch-user-check-ins-history';

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsService

describe('Histórico de Check-ins', () => {

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new FetchUserCheckInsService(checkInsRepository)
	})


	test('Deve retornar o histórico de checkins do usuário', async () => {

		await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		})

		await checkInsRepository.create({
			gym_id: 'gym-02',
			user_id: 'user-01'
		})
	
		const { checkIns } = await sut.execute({
			userId: 'user-01'
		})

		expect(checkIns).toHaveLength(2)
		expect(checkIns).toEqual([
			expect.objectContaining({gym_id: 'gym-01'}),
			expect.objectContaining({gym_id: 'gym-02'})
		])
	})


	test('Deve retornar uma lista com páginação do histórico de checkins do usuário', async () => {

		for (let i = 1; i <= 22; i++) {
			await checkInsRepository.create({
				gym_id: `gym-${i}`,
				user_id: 'user-01'
			})
		}
	
		const { checkIns } = await sut.execute({
			userId: 'user-01',
			page: 2
		})

		expect(checkIns).toHaveLength(2)
		expect(checkIns).toEqual([
			expect.objectContaining({gym_id: 'gym-21'}),
			expect.objectContaining({gym_id: 'gym-22'})
		])
	})

})