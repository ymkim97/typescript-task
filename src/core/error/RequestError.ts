export default class RequestError extends Error {
  statusCode: number;
  validationMessages?: string[];

  constructor(
    message: string,
    statusCode: number,
    validationMessages?: string[],
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.validationMessages = validationMessages;
  }
}
