import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

function connectDB() {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch(err => {
        console.log("MongoDB connection error:", err);
    })
}

export default connectDB;