import userModel from '../models/user.model.js';
import * as userService from '../services/user.service.js';
import { validationResult } from 'express-validator';

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
}

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
}