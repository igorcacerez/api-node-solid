import { ErrorDefault } from './error-default';

export class InvalidCredentialError extends ErrorDefault {
	constructor() {
		// E-mail ou senha informados estão invalidos.
		super('Email or password entered are invalid.')
	}

	statusCodeError(): number {return 400}
}