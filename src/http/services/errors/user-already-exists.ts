import { ErrorDefault } from './error-default'

export class UserAlreadyExistsError extends ErrorDefault {
	constructor() {
		super('Email provided is already registered.')
	}

	statusCodeError() : number {return 409}
}