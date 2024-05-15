import { ErrorDefault } from './error-default';

export class MaxNumberOfCheckInsError extends ErrorDefault {
	constructor() {
		// E-mail ou senha informados estão invalidos.
		super('Usuário atingiu o limite máximo de check-ins.')
	}

	statusCodeError(): number {return 400}
}