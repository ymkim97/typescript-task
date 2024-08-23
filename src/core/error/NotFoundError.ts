export default class NotFoundError extends Error {
  statusCode: number;

  static DATA_NOT_FOUND = 'Data Not Found In MYSQL';

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}
