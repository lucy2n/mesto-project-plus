import { Request, Response } from 'express';
import card from '../models/card';
import { ERROR_CODE, NOT_FOUND, REQUEST_OK, SERVER_ERROR } from '../utils/constants';
import { IUserRequest } from 'types';

export const getCards = (req: Request, res: Response) => {
  return card.find({})
    .then(cards => res.status(REQUEST_OK).send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

export const deleteCardById = (req: Request, res: Response) => {
  card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
    }
    res.status(REQUEST_OK).send({ data: card })
  })
  .catch(err => res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

export const createCard = (req: IUserRequest, res: Response) => {
  const { name, link } = req.body;
  card.create({ name, link, owner: req.user?._id})
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if(err.name == "ValidationError") {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки.'})
      }
      res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' })
    });
};

export const likeCard = (req: IUserRequest, res: Response) => {
  card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      }
      res.status(REQUEST_OK).send({ data: card });
    })
    .catch((err) => {
      if(err.name == "ValidationError") {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка.'})
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

export const dislikeCard = (req: IUserRequest, res: Response) => {
  card.findByIdAndUpdate(req.params.cardId,
  { $pull: { likes: req.user?._id } },{ new: true }
  )
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
    }
    res.status(REQUEST_OK).send({ data: card })
  })
  .catch((err) => {
    if(err.name == "ValidationError") {
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка.'})
    }
    res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' })
  });
}
