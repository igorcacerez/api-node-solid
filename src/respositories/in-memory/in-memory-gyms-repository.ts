import { Gym, Prisma } from '@prisma/client';
import { GymsRepository } from '../gyms-repository';
import { randomUUID } from 'crypto';

export class InMemoryGymsRepository implements GymsRepository {
	
	public items : Gym[] = []

	async searchMany(query: string, page: number): Promise<Gym[]> {
		const NUMBER_REGISTER_PAGE = 20

		return this.items
			.filter(item => item.title.includes(query))
			.slice((page - 1) * NUMBER_REGISTER_PAGE, page * NUMBER_REGISTER_PAGE)
	}

	async findById(id: string): Promise<Gym | null> {
		const gym = this.items.find(item => item.id === id)
		return gym || null
	}

	async create(data: Prisma.GymCreateInput) : Promise<Gym> {
		const gym = {
			id: data.id ?? randomUUID(),
			title: data.title,
			description: data.description || null,
			phone: data.phone || null, 
			latitude: new Prisma.Decimal(String(data.latitude)),
			longitude: new Prisma.Decimal(String(data.longitude)),
			created_at: new Date()
		}

		this.items.push(gym)

		return gym
	}
}