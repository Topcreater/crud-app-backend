// routes/userRoutes.mjs
import express from 'express';
import { register, login, getUsers, getUser, updateUser, deleteUser } from '../controllers/authController.mjs';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
