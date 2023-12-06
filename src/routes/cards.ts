import { Router } from 'express';
import {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { createCardValidation, getCardByIdValidation } from '../validation/card-validation';

const router = Router();

router.get('/', getCards);
router.post('/', createCardValidation, createCard);
router.delete('/:cardId', getCardByIdValidation, deleteCardById);
router.put('/:cardId/likes', getCardByIdValidation, likeCard);
router.delete('/:cardId/likes', getCardByIdValidation, dislikeCard);

export default router;
