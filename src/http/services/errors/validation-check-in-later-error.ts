import { ErrorDefault } from './error-default'

export class ValidationCheckInLaterError extends ErrorDefault {
	constructor() {
		super('Check-in validation time has expired.')
	}

	statusCodeError() : number {return 400}
}