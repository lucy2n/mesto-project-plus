import { Router } from  'express';
import { getUsers, getUserById, updateProfile, updateProfileAvatar, createUser } from '../controllers/users';

const router = Router();
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateProfileAvatar);

export default router;