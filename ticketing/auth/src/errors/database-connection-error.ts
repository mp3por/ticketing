import {CustomError} from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    reason = 'Error connection to the DB';
    statusCode = 500;

    constructor() {
        super('Error connection to the DB');

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors() {
        return [{
            message: this.reason
        }]
    }
}
