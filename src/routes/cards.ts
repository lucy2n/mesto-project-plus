import { Router } from  'express';
import { getCards, deleteCardById, createCard } from '../controllers/cards';

const router = Router();
router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCardById)

export default router;