import { Router } from 'express';
import * as userController from '../controllers/user.controllers.js';
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register',
    body('firstname').isLength({ min: 1 }).withMessage('First name is required'),
    body('lastname').isLength({ min: 1 }).withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.CreateUserController);

router.post('/login',
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.LoginUserController);
    
router.get('/profile', authMiddleware.authUser, userController.ProfileUserController);

router.post('/forgotpassword', userController.ForgotPasswordController);

router.get('/logout', authMiddleware.authUser, userController.LogoutUserController);

export default router;