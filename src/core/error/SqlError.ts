export default class SqlError extends Error {
  statusCode: number;
  errorMessages?: string[];

  constructor(message: string, statusCode: number, errorMessages?: string[]) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorMessages = errorMessages;
  }
}
