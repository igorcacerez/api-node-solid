import { ErrorDefault } from './error-default';

export class MaxDistanceError extends ErrorDefault {
	constructor() {
		// E-mail ou senha informados estão invalidos.
		super('Distancia maxima atingiada.')
	}

	statusCodeError(): number {return 400}
}