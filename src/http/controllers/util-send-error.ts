import { FastifyReply } from 'fastify';
import { ErrorDefault } from '../services/errors/error-default';

export async function sendErrorUtil(
	reply: FastifyReply,
	err: any
) {
	let errorObject = new ErrorDefault()

	if (err instanceof ErrorDefault ) {
		errorObject = err
	}


	return reply
		.status(errorObject.statusCodeError())
		.send({
			error: errorObject.message
		})
}