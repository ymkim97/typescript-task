export default class RequestError extends Error {
  statusCode: number;
  errorMessages?: string[];

  constructor(message: string, statusCode: number, errorMessages?: string[]) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorMessages = errorMessages;
  }
}
