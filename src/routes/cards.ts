import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { urlRegExp } from '../utils/constants';

const router = Router();

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимум 2 символа',
        'string.max': 'Максимум 30 символов',
        'string.required': 'Это обязательное поле',
      }),
    link: Joi.string().required().regex(urlRegExp)
      .messages({
        'string.required': 'Это обязательное поле',
      }),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex()
      .messages({
        'string.length': 'Длинна поля - 24 символа',
        'string.required': 'Это обязательное поле',
      }),
  }),
}), deleteCardById);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex()
      .messages({
        'string.length': 'Длинна поля - 24 символа',
        'string.required': 'Это обязательное поле',
      }),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex()
      .messages({
        'string.length': 'Длинна поля - 24 символа',
        'string.required': 'Это обязательное поле',
      }),
  }),
}), dislikeCard);

export default router;
