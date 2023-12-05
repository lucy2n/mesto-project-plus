import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {
  NOT_FOUND_ERROR_USER_MESSAGE,
  REQUEST_OK,
  CREATED,
} from '../utils/constants';
import { IUserRequest } from '../types';
import NotFoundError from '../errors/not-found-err';
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
      res.status(REQUEST_OK).send({ data: user });
    })
    .catch((err) => next(err));
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
    .catch((err) => next(err));
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
    .catch((err) => next(err));
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
    .catch((err: Error) => next(err));
};
