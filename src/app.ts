import fastify from 'fastify';
import { appRoutes } from './http/routes';
import { ZodError } from 'zod';
import { env } from './env';
import { ErrorDefault } from './http/services/errors/error-default';

export const app = fastify()

app.register(appRoutes)

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