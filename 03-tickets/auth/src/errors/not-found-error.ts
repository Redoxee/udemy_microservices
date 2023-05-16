import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
	statusCode = 404;

	constructor(){
		super('not found error');

		Object.setPrototypeOf(this, NotFoundError.prototype)
	}

	serializeErrors(): { message: string; }[] {
		return [{message : 'Ressource not found'}];
	}
}