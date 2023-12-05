import { UNAUTHORIZED_ERROR } from '../utils/constants';

export default class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}
