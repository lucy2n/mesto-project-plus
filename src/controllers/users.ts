import { Request, Response, NextFunction } from 'express';
import user from '../models/user'

export const getUsers = (req: Request, res: Response) => {
  return user.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const getUserById = (req: Request, res: Response) => {
  return user.findById(req.params.id)
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  user.create({name, about, avatar})
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

