import { CheckIn, Prisma } from '@prisma/client';
import { CheckInsRepository } from '../checkin-respository';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

export class PrismaCheckInsRepository implements CheckInsRepository {
	async findById(id: string): Promise<CheckIn | null> {
		const checkIn = await prisma.checkIn.findUnique({
			where: { id }
		})

		return checkIn
	}

	async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
		const checkIn = await prisma.checkIn.create({ data })
		return checkIn
	}

	async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
		const startOfTheDay = dayjs(date).startOf('date')
		const endOfTheDay = dayjs(date).endOf('date')

		// usando o findFirst em vez do findUnique pq não estamos busca por campos não unicos
		const checkIn = await prisma.checkIn.findFirst({
			where: {
				user_id: userId,
				created_at: {
					gte: startOfTheDay.toDate(), // gte => Maior ou igual
					lte: endOfTheDay.toDate() // lte => Menor ou igual
				}
			}
		})

		return checkIn
	}

	async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
		const checkIns = await prisma.checkIn.findMany({
			where: {user_id: userId},
			take: 20, // Quantidade de itens por página
			skip: (page - 1) * 20 // Quantos itens deve pular
		})

		return checkIns
	}

	async countByUserId(userId: string): Promise<number> {
		const count = await prisma.checkIn.count({
			where: {user_id: userId}
		})

		return count
	}

	async save(data: CheckIn): Promise<CheckIn> {
		const checkIn = await prisma.checkIn.update({
			where: {id: data.id},
			data
		})

		return checkIn
	}

}