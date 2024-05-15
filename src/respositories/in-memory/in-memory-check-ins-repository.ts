import { CheckIn, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { CheckInsRepository } from '../checkin-respository';
import dayjs from 'dayjs';

export class InMemoryCheckInsRepository implements CheckInsRepository {
	
	public items : CheckIn[] = []

	async countByUserId(userId: string): Promise<number> {
		return this.items
			.reduce((count, item) => 
				count += (item.user_id === userId ? 1 : 0),
			0);
	}

	async findManyByUserId(userId: string, page: number = 1): Promise<CheckIn[]> {
		const NUMBER_REGISTER_PAGE = 20

		return this.items
			.filter(item => item.user_id === userId)
			.slice((page - 1) * NUMBER_REGISTER_PAGE, page * NUMBER_REGISTER_PAGE)
	}

	async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
		const startOfTheDay = dayjs(date).startOf('date')
		const endOfTheDay = dayjs(date).endOf('date')

		const checkOnSameDate = this.items.find((checkIn) => {
			const checkInDate = dayjs(checkIn.created_at)
			const isOnSameDate = 
				checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

			return checkIn.user_id === userId && isOnSameDate
		})

		return checkOnSameDate || null
	}

	async create(data: Prisma.CheckInUncheckedCreateInput) : Promise<CheckIn> {
		const checkin = {
			id: randomUUID(),
			created_at: new Date(),
			validated_at: data.validated_at ? new Date(data.validated_at) : null, 
			user_id: data.user_id,
			gym_id: data.gym_id
		}

		this.items.push(checkin)

		return checkin
	}
}