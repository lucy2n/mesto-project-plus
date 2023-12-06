import { Request, Response } from 'express';
import { SERVER_ERROR, SERVER_ERROR_MESSAGE } from '../utils/constants';

export default function handleCentralError(err: any, req: Request, res: Response) {
  const { statusCode = SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === SERVER_ERROR
        ? SERVER_ERROR_MESSAGE
        : message,
    });
}
