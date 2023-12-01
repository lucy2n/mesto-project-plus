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
} from '../utils/constants';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.status(REQUEST_OK).send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE }));
};

export const deleteCardById = (req: Request, res: Response) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: NOT_FOUND_ERROR_CARD_MESSAGE });
      }
      return res.status(REQUEST_OK).send({ data: card });
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE }));
};

export const createCard = (req: IUserRequest, res: Response) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.send({ data: card }))
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
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: NOT_FOUND_ERROR_CARD_MESSAGE });
      }
      return res.status(REQUEST_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR_NAME) {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

export const dislikeCard = (req: IUserRequest, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: NOT_FOUND_ERROR_CARD_MESSAGE });
      }
      return res.status(REQUEST_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR_NAME) {
        res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else {
        res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};
