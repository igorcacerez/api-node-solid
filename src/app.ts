import fastify from 'fastify';
import { appRoutes } from './http/routes';
import { ZodError } from 'zod';
import { env } from './env';
import { ErrorDefault } from './http/services/errors/error-default';
import fastifyJwt from '@fastify/jwt';

export const app = fastify()

// Registra o módulo para uso do JWT
app.register(fastifyJwt, {
	secret: env.JWT_SECRET
})

// Registra todas as rotas da Aplicação 
app.register(appRoutes)

// Caso de algum erro em alguma rota será tratado aqui 
// para que todos os erros tenham uma saida uniforme
app.setErrorHandler((error, _, reply) => {

	env.NODE_ENV === 'dev' ?? console.error(error)
	
	if (error instanceof ZodError) {
		return reply.status(400)
			.send({
				error: 'Validation error.',
				issues: error.format()
			})
	}

	const errorDefault = error instanceof ErrorDefault ? error : new ErrorDefault()

	return reply
		.status(errorDefault.statusCodeError())
		.send({
			error: errorDefault.message
		})
	
})