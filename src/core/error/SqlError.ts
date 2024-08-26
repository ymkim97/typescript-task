export default class SqlError extends Error {
  statusCode: number;
  originalError?: Error;

  constructor(message: string, statusCode: number, originalError?: Error) {
    super(`${message}: ${originalError?.message}`);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.originalError = originalError;

    if (originalError?.stack) {
      this.stack = `${this.stack}\nCaused by: ${originalError.stack}`;
    }
  }
}
