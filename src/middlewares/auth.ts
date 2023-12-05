import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UNAUTHORIZED_ERROR } from '../utils/constants';

interface SessionRequest extends Request {
    user?: string | JwtPayload;
}

const handleAuthError = (res: Response) => {
  res
    .status(UNAUTHORIZED_ERROR)
    .send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header: string): string => header.replace('Bearer ', '');

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    handleAuthError(res);
    return;
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    handleAuthError(res);
    return;
  }

  req.user = payload;

  next();
};
