import { FastifyInstance } from 'fastify';
import { register } from './register';
import { authenticate } from './authenticate';
import { profile } from './profile';
import { verifyJWT } from '../../middlewares/verify-jwt';

export async function usersRoutes(app: FastifyInstance) : Promise<void> {
	app.post('/users', register)
	app.post('/sessions', authenticate)

	// Rotas privadas 
	app.get('/me', {
		onRequest: [verifyJWT]
	} , profile)
}