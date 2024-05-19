import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserMetricsService } from '@/http/services/factories/make-get-user-metrics-service'


export async function metrics(
	request: FastifyRequest, 
	reply: FastifyReply
) : Promise<FastifyReply> {

	const getMetricsCheckIns = makeGetUserMetricsService()

	const { checkInsCount } = await getMetricsCheckIns.execute({
		userId: request.user.sub
	})

	
	return reply.status(200).send({
		checkInsCount
	})
}

