import { Request, Response } from 'express';
import { IUserRequest } from '../types';
import Card from '../models/card';
import {
  VALIDATION_ERROR,
  NOT_FOUND,
  REQUEST_OK,
  SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
  VALIDATION_ERROR_NAME,
  NOT_FOUND_ERROR_CARD_MESSAGE,
  CREATED,
} from '../utils/constants';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.status(REQUEST_OK).send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE }));
};

export const deleteCardById = (req: Request, res: Response) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error(NOT_FOUND_ERROR_CARD_MESSAGE))
    .then((card) => {
      res.status(REQUEST_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.message === NOT_FOUND_ERROR_CARD_MESSAGE) {
        res.status(NOT_FOUND).send({ message: NOT_FOUND_ERROR_CARD_MESSAGE });
      } else {
        res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

export const createCard = (req: IUserRequest, res: Response) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR_NAME) {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

export const likeCard = (req: IUserRequest, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .orFail(new Error(NOT_FOUND_ERROR_CARD_MESSAGE))
    .then((card) => {
      res.status(REQUEST_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.message === NOT_FOUND_ERROR_CARD_MESSAGE) {
        res.status(NOT_FOUND).send({ message: NOT_FOUND_ERROR_CARD_MESSAGE });
      } else if (err.name === VALIDATION_ERROR_NAME) {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else {
        res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

export const dislikeCard = (req: IUserRequest, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  )
    .orFail(new Error(NOT_FOUND_ERROR_CARD_MESSAGE))
    .then((card) => {
      res.status(REQUEST_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.message === NOT_FOUND_ERROR_CARD_MESSAGE) {
        res.status(NOT_FOUND).send({ message: NOT_FOUND_ERROR_CARD_MESSAGE });
      } else if (err.name === VALIDATION_ERROR_NAME) {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else {
        res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};
