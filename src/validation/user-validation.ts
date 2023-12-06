import { celebrate, Joi } from 'celebrate';
import { urlRegExp } from '../config';

export const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимум 2 символа',
        'string.max': 'Максимум 30 символов',
      }),
    about: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимум 2 символа',
        'string.max': 'Максимум 30 символов',
      }),
    avatar: Joi.string().regex(urlRegExp),
    email: Joi.string().required().email()
      .messages({
        'string.required': 'Это обязательное поле',
      }),
    password: Joi.string().required()
      .messages({
        'string.required': 'Это обязательное поле',
      }),
  }),
});

export const getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex()
      .messages({
        'string.length': 'Длинна поля - 24 символа',
        'string.required': 'Это обязательное поле',
      }),
  }),
});

export const updateProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимум 2 символа',
        'string.max': 'Максимум 30 символов',
        'string.required': 'Это обязательное поле',
      }),
    about: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимум 2 символа',
        'string.max': 'Максимум 30 символов',
        'string.required': 'Это обязательное поле',
      }),
  }),
});

export const updateProfileAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(urlRegExp)
      .messages({
        'string.required': 'Это обязательное поле',
      }),
  }),
});

export const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .messages({
        'string.required': 'Это обязательное поле',
      }),
    password: Joi.string().required()
      .messages({
        'string.required': 'Это обязательное поле',
      }),
  }),
});
