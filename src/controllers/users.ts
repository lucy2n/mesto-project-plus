import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UpdateQuery } from 'mongoose';
import User, { IUser } from '../models/user';
import {
  NOT_FOUND_ERROR_USER_MESSAGE,
  REQUEST_OK,
  CREATED,
} from '../utils/constants';
import { IUserRequest } from '../types';
import NotFoundError from '../errors/not-found-err';
import ConflictError from '../errors/conflict-err';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.status(REQUEST_OK).send({ data: users }))
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

const updateProfile = (
  req: IUserRequest,
  res: Response,
  next: NextFunction,
  update?: UpdateQuery<IUser>,
) => {
  User.findByIdAndUpdate(
    req.user?._id,
    update,
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError(NOT_FOUND_ERROR_USER_MESSAGE))
    .then((user) => {
      res.status(REQUEST_OK).send({ data: user });
    })
    .catch((err) => next(err));
};

export const updateProfileDescription = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  updateProfile(req, res, next, { name, about });
};

export const updateProfileAvatar = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  updateProfile(req, res, next, { avatar });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => next(err));
};

export const getUser = (res: Response, next: NextFunction, id: string) => {
  User.findById(id)
    .orFail(new NotFoundError(NOT_FOUND_ERROR_USER_MESSAGE))
    .then((user) => {
      res.status(REQUEST_OK).send({ data: user });
    })
    .catch((err) => next(err));
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  getUser(res, next, req.params.id);
};

export const getAuthorizedUser = (req: IUserRequest, res: Response, next: NextFunction) => {
  getUser(res, next, req.user?._id);
};
