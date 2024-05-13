export class ErrorDefault extends Error {
	constructor(errorMsg?: string) {
		super(errorMsg || 'Internal Error')
	}

	statusCodeError() : number {return 500}
}