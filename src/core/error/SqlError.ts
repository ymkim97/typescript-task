export default class SqlError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number, originalError?: Error) {
    super(`${message}: ${originalError?.message}`);
    this.name = this.constructor.name;
    this.statusCode = statusCode;

    if (originalError?.stack) {
      this.stack = `${this.stack}\nCaused by: ${originalError.stack}`;
    }
  }
}
