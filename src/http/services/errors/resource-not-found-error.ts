import { ErrorDefault } from './error-default';

export class ResourceNotFoundError extends ErrorDefault {
	constructor() {
		super('Resource not found.')
	}

	statusCodeError(): number {return 404}
}