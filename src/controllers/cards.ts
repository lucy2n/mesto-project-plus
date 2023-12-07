import { NextFunction, Request, Response } from 'express';
import { UpdateQuery } from 'mongoose';
import { IUser } from '../models/user';
import NotFoundError from '../errors/not-found-err';
import Card from '../models/card';
import {
  REQUEST_OK,
  NOT_FOUND_ERROR_CARD_MESSAGE,
  CREATED,
} from '../utils/constants';
import { IUserRequest } from '../types';
import ForbiddenError from '../errors/forbidden-err';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.status(REQUEST_OK).send({ data: cards }))
    .catch((err) => next(err));
};

export const deleteCardById = (req: IUserRequest, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError(NOT_FOUND_ERROR_CARD_MESSAGE))
    .then((card) => {
      if (String(card.owner) !== req.user?._id) {
        throw new ForbiddenError('Нет доступа для удаления карточки');
      }
      return Card.deleteOne(card._id);
    })
    .then((card) => res.status(REQUEST_OK).send({ data: card }))
    .catch((err) => next(err));
};

export const createCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => next(err));
};

const handleCardAction = (
  req: IUserRequest,
  res: Response,
  next: NextFunction,
  update?: UpdateQuery<IUser>,
) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    update,
    { new: true },
  )
    .orFail(new NotFoundError(NOT_FOUND_ERROR_CARD_MESSAGE))
    .then((card) => {
      res.status(REQUEST_OK).send({ data: card });
    })
    .catch((err) => next(err));
};

export const likeCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  handleCardAction(req, res, next, { $addToSet: { likes: req.user?._id } });
};

export const dislikeCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  handleCardAction(req, res, next, { $pull: { likes: req.user?._id } });
};
