import userModel from '../models/user.model.js';
import * as userService from '../services/user.service.js';
import { validationResult } from 'express-validator';
import redisClient from '../services/redis.service.js';

export const CreateUserController = async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({error: error.array() });
    }
    
    try{
        const user = await userService.createUser(req.body);        

        try {
            const token = await user.generateAuthToken();
            res.status(201).json({ user, token });
        } catch (error) {
            res.status(400).send(error.message);
        }
    } catch(error){
        res.status(400).send(error.message);
    }
};

export const LoginUserController = async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({error: error.array() });
    }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send('Email and password are required');
        }

        const user = await userModel.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).send('Invalid Ceredentials');
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(401).send('Invalid email or password');
        }

        const token = await user.generateAuthToken();
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const ProfileUserController = async (req, res) => {
    try {
      const user = await userModel.findById(req.user._id); // Use req.user._id to find the user
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const ForgotPasswordController = async (req , res) => {
    const { email , newpassword , confirmpassword } = req.body;

    if (!email) {
        return res.status(401).json({message:"Email is Required"});
    }

    const user = await userModel.findOne({ email });

    if (!user){
        return res.status(401).json({message:"User not found"});
    }

    if (newpassword !== confirmpassword){
        return res.status(401).json({message:"Password does not match"});
    }

    const hashedpassword = await userModel.hashPassword(newpassword);

    user.password = hashedpassword;
    await user.save();

    res.status(200).json({message:"Password reset successfully"});
    console.log("Password reset successfully");
};

export const LogoutUserController = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24); // 1 day

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
