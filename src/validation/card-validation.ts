import { celebrate, Joi } from 'celebrate';
import { urlRegExp } from '../config';

export const createCardValidation = celebrate({
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
});

export const getCardByIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex()
      .messages({
        'string.length': 'Длинна поля - 24 символа',
        'string.required': 'Это обязательное поле',
      }),
  }),
});
