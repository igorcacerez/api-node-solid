import { FastifyInstance } from 'fastify';
import { register } from './controllers/register';
import { authenticate } from './controllers/authenticate';
import { profile } from './controllers/profile';
import { verifyJWT } from './middlewares/verify-jwt';

export async function appRoutes(app: FastifyInstance) : Promise<void> {
	app.post('/users', register)
	app.post('/sessions', authenticate)

	// Rotas privadas 
	app.get('/me', {
		onRequest: [verifyJWT]
	} , profile)
}