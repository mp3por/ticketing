export class DatabaseConnectionError extends Error {
    reason = 'Error connection to the DB';

    constructor() {
        super();

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
}
