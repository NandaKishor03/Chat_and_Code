import { Router } from 'express';
import * as userController from '../controllers/user.controllers.js';
import { body } from 'express-validator';

const router = Router();

router.post('/register',
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.CreateUserController);

router.post('/login',
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.LoginUserController);

export default router;