import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateProfileDescription,
  updateProfileAvatar,
  getAuthorizedUser,
} from '../controllers/users';
import { getUserByIdValidation, updateProfileAvatarValidation, updateProfileValidation } from '../validation/user-validation';

const router = Router();

router.get('/', getUsers);
router.get('/me', getAuthorizedUser);
router.get('/:userId', getUserByIdValidation, getUserById);
router.patch('/me', updateProfileValidation, updateProfileDescription);
router.patch('/me/avatar', updateProfileAvatarValidation, updateProfileAvatar);

export default router;
