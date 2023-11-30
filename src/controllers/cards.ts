import { Request, Response, NextFunction } from 'express';
import card from '../models/card';

export const getCards = (req: Request, res: Response) => {
  return card.find({})
    .populate('owner')
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const deleteCardById = (req: Request, res: Response) => {
  card.findByIdAndRemove(req.params.id)
  .then(card => res.send({ data: card }))
  .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const createCard = (req: Request, res: Response) => {
  const { name, link, ownerId } = req.body;
  card.create({ name, link, owner: ownerId })
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}