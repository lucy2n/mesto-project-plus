import { VALIDATION_ERROR } from '../utils/constants';

export default class ValidationError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = VALIDATION_ERROR;
  }
}
