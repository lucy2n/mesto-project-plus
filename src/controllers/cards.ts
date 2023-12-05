import { NextFunction, Request, Response } from 'express';
import ValidationError from '../errors/validation-err';
import NotFoundError from '../errors/not-found-err';
import Card from '../models/card';
import {
  REQUEST_OK,
  VALIDATION_ERROR_NAME,
  NOT_FOUND_ERROR_CARD_MESSAGE,
  CREATED,
  CAST_ERROR_NAME,
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
      return card;
    })
    .then((card) => Card.findByIdAndDelete(card))
    .then((card) => res.status(REQUEST_OK).send({ data: card }))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR_NAME || err.name === CAST_ERROR_NAME) {
        next(new ValidationError('Переданы некорректные данные при удалении карточки.'));
      } else if (err.message === NOT_FOUND_ERROR_CARD_MESSAGE) {
        next(err);
      } else {
        next(err);
      }
    });
};

export const createCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR_NAME || err.name === CAST_ERROR_NAME) {
        next(new ValidationError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(new NotFoundError(NOT_FOUND_ERROR_CARD_MESSAGE))
    .then((card) => {
      res.status(REQUEST_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.message === NOT_FOUND_ERROR_CARD_MESSAGE) {
        next(err);
      } else if (err.name === VALIDATION_ERROR_NAME || err.name === CAST_ERROR_NAME) {
        next(new ValidationError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(new NotFoundError(NOT_FOUND_ERROR_CARD_MESSAGE))
    .then((card) => {
      res.status(REQUEST_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.message === NOT_FOUND_ERROR_CARD_MESSAGE) {
        next(err);
      } else if (err.name === VALIDATION_ERROR_NAME || err.name === CAST_ERROR_NAME) {
        next(new ValidationError(''));
      } else {
        next(err);
      }
    });
};
