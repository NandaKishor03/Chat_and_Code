import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [6, "Email must be at least 6 characters"],
    maxlength: [50, "Email must be at most 50 characters"],
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"]
    },
    password: {
    type: String,
    required: true,
    select: false,
    minlength: [3, "Password must be at least 3 characters"]
    }
  },
  { collection: "user" }
);

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
    return jwt.sign({ email: this.email }, process.env.JWT_SECRET);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const User = mongoose.model("user", userSchema);

export default User;