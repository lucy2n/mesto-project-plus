import { Request, Response} from 'express';
import user from '../models/user'
import { ERROR_CODE, NOT_FOUND, REQUEST_OK, SERVER_ERROR } from '../utils/constants';
import { IUserRequest } from 'types';

export const getUsers = (req: Request, res: Response) => {
  return user.find({})
    .then(users => res.status(REQUEST_OK).send({ data: users }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию'}));
};

export const getUserById = (req: Request, res: Response) => {
  return user.findById(req.params.userId)
    .then((user) =>  {
      if(!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      res.status(REQUEST_OK).send({ data: user })
    })
    .catch((err) => res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  user.create({name, about, avatar})
    .then(user => res.status(REQUEST_OK).send({ data: user }))
    .catch((err: Error) => {
      if(err.name == "ValidationError") {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' })
      }
      res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' })
    });
};

export const updateProfile = (req: IUserRequest, res: Response) => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(req.user?._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true
    })
    .then((user) => {
      if(!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' })
      }
      res.status(REQUEST_OK).send({ data: user })
    })
    .catch((err) => {
      if(err.name == "ValidationError") {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' })
      }
      res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' })
    });
};

export const updateProfileAvatar = (req: IUserRequest, res: Response) => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(req.user?._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true
    })
    .then((user) => {
      if(!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' })
      }
      res.status(REQUEST_OK).send({ data: user })
    })
    .catch((err) => {
      if(err.name == "ValidationError") {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' })
      }
      res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' })
    });
}




