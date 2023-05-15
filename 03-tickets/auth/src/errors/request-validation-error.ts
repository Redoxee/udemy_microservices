import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

class RequestValidationError extends CustomError {
	statusCode = 400;

	constructor(public errors: ValidationError[]) {
		super('Error validating user');

		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	serializeErrors() {
		return this.errors.map((error) => {
			return { message: error.msg as string };
		});
	}
}

export { RequestValidationError };