import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { create } from './create'
import { validate } from './validation'
import { history } from './history'
import { metrics } from './metrics'


export async function checkInsRoutes(app: FastifyInstance) : Promise<void> {
	app.addHook('onRequest', verifyJWT)

	app.get('/check-ins/history', history)
	app.get('/check-ins/metrics', metrics)

	app.post('/gyms/:gymId/check-in', create)
	app.patch('/check-ins/:checkInId/validate', validate)
}