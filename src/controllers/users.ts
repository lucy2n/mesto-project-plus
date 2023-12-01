import { Request, Response } from 'express';
import { IUserRequest } from '../types';
import User from '../models/user';
import {
  VALIDATION_ERROR,
  NOT_FOUND,
  NOT_FOUND_ERROR_USER_MESSAGE,
  REQUEST_OK,
  SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
  VALIDATION_ERROR_NAME,
} from '../utils/constants';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.status(REQUEST_OK).send({ data: users }))
    .catch(() => res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE }));
};

export const getUserById = (req: Request, res: Response) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: NOT_FOUND_ERROR_USER_MESSAGE });
      }
      return res.status(REQUEST_OK).send({ data: user });
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(REQUEST_OK).send({ data: user }))
    .catch((err: Error) => {
      if (err.name === VALIDATION_ERROR_NAME) {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

export const updateProfile = (req: IUserRequest, res: Response) => {
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
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: NOT_FOUND_ERROR_USER_MESSAGE });
      }
      return res.status(REQUEST_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR_NAME) {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

export const updateProfileAvatar = (req: IUserRequest, res: Response) => {
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
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: NOT_FOUND_ERROR_USER_MESSAGE });
      }
      return res.status(REQUEST_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR_NAME) {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};
