import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {
  NOT_FOUND_ERROR_USER_MESSAGE,
  REQUEST_OK,
  VALIDATION_ERROR_NAME,
  CREATED,
  CAST_ERROR_NAME,
} from '../utils/constants';
import { IUserRequest } from '../types';
import NotFoundError from '../errors/not-found-err';
import ValidationError from '../errors/validation-err';
import UnauthorizedError from '../errors/unauthorized-err';
import ConflictError from '../errors/conflict-err';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.status(REQUEST_OK).send({ data: users }))
    .catch((err) => next(err));
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError(NOT_FOUND_ERROR_USER_MESSAGE))
    .then((user) => {
      if (!user) {
        throw (new NotFoundError(NOT_FOUND_ERROR_USER_MESSAGE));
      }
      res.status(REQUEST_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.message === NOT_FOUND_ERROR_USER_MESSAGE) {
        next(err);
      } else if (err.name === VALIDATION_ERROR_NAME || err.name === CAST_ERROR_NAME) {
        next(new ValidationError('Переданы некорректные данные для поиска пользователя'));
      } else {
        next(err);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    password,
    email,
    name,
    about,
    avatar,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const {
        _id,
      } = user;
      res.status(CREATED).send({
        _id,
        email,
        name,
        about,
        avatar,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next((new ConflictError('Пользователь с таким email уже существует')));
      } else if (err.name === VALIDATION_ERROR_NAME || err.name === CAST_ERROR_NAME) {
        next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

export const updateProfile = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .orFail(new NotFoundError(NOT_FOUND_ERROR_USER_MESSAGE))
    .then((user) => {
      res.status(REQUEST_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.message === NOT_FOUND_ERROR_USER_MESSAGE) {
        next(err);
      } else if (err.name === VALIDATION_ERROR_NAME || err.name === CAST_ERROR_NAME) {
        next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

export const updateProfileAvatar = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .orFail(new Error(NOT_FOUND_ERROR_USER_MESSAGE))
    .then((user) => {
      res.status(REQUEST_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.message === NOT_FOUND_ERROR_USER_MESSAGE) {
        next(err);
      } else if (err.name === VALIDATION_ERROR_NAME || err.name === CAST_ERROR_NAME) {
        next(new ValidationError('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch(() => {
      next((new UnauthorizedError('Передан неверный логин или пароль')));
    });
};

export const getUser = (req: IUserRequest, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .orFail(new Error(NOT_FOUND_ERROR_USER_MESSAGE))
    .then((user) => {
      res.status(REQUEST_OK).send({ data: user });
    })
    .catch((err: Error) => {
      if (err.message === NOT_FOUND_ERROR_USER_MESSAGE) {
        next(err);
      } else if (err.name === VALIDATION_ERROR_NAME || err.name === CAST_ERROR_NAME) {
        next(new ValidationError('Переданы некорректные данные при поиске пользователя'));
      } else {
        next(err);
      }
    });
};
