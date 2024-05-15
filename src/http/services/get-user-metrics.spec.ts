import { InMemoryCheckInsRepository } from '@/respositories/in-memory/in-memory-check-ins-repository';
import { beforeEach, describe, expect, test} from 'vitest';
import { GetUserMetricsService } from './get-user-metrics';

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsService

describe('Métricas do Usuário', () => {

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new GetUserMetricsService(checkInsRepository)
	})


	test('Deve retornar o total de checkins do usuário', async () => {

		await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		})

		await checkInsRepository.create({
			gym_id: 'gym-02',
			user_id: 'user-01'
		})

		await checkInsRepository.create({
			gym_id: 'gym-02',
			user_id: 'user-02'
		})
	
		const { checkInsCount } = await sut.execute({
			userId: 'user-01'
		})

		expect(checkInsCount).toEqual(2)
	})
})