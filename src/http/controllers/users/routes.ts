import { FastifyInstance } from 'fastify';
import { register } from './register';
import { authenticate } from './authenticate';
import { profile } from './profile';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { refresh } from './refresh';

export async function usersRoutes(app: FastifyInstance) : Promise<void> {
	app.post('/users', register)
	app.post('/sessions', authenticate)
	app.patch('/token/refresh', refresh)

	// Rotas privadas 
	app.get('/me', {
		onRequest: [verifyJWT]
	} , profile)
}