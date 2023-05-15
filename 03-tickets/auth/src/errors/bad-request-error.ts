import { CustomError } from "./custom-error";

class BadRequestError extends CustomError {
	statusCode = 400;

	constructor(public msg: string) {
		super(msg);

		Object.setPrototypeOf(this, BadRequestError.prototype);
	}

	serializeErrors() {
		return [{message : this.msg}];
	}
}

export { BadRequestError };