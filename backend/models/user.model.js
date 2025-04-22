import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    minLength: [2, "First name must be at least 2 characters"],
    maxLength: [20, "First name must be at most 20 characters"],
    match: [/^[a-zA-Z]+$/, "First name can only contain letters"]
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    minLength: [2, "Last name must be at least 2 characters"],
    maxLength: [20, "Last name must be at most 20 characters"],
    match: [/^[a-zA-Z]+$/, "Last name can only contain letters"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: [6, "Email must be at least 6 characters"],
    maxLength: [50, "Email must be at most 50 characters"],
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"]
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: [3, "Password must be at least 3 characters"]
  }
});

userSchema.statics.hashPassword = async function (password) {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

userSchema.methods.generateAuthToken = function () {
  try {
    const token = jwt.sign({ 
      _id: this._id, 
      email: this.email 
    }, process.env.JWT_SECRET, {
      expiresIn: '24h' // Token expires in 1 hour
    });
    return token;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const User = mongoose.model("users", userSchema);

export default User;