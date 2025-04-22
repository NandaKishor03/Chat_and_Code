import userModel from '../models/user.model.js';

export const createUser = async ({ firstname, lastname, email, password }) => {
    if (!email ||!password){
        throw new Error("Email and password are required");
    }

    const hashedpassword = await userModel.hashPassword(password)

    const user = await userModel.create({
        firstname,
        lastname,
        email,
        password: hashedpassword
    });

    return user
}