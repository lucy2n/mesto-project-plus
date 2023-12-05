import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers,
  getUserById,
  updateProfile,
  updateProfileAvatar,
  getUser,
} from '../controllers/users';
import { urlRegExp } from '../utils/constants';

const router = Router();

router.get('/', getUsers);
router.get('/me', getUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex()
      .messages({
        'string.length': 'Длинна поля - 24 символа',
        'string.required': 'Это обязательное поле',
      }),
  }),
}), getUserById);

router.patch('/me', celebrate({
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
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(urlRegExp)
      .messages({
        'string.required': 'Это обязательное поле',
      }),
  }),
}), updateProfileAvatar);

export default router;
