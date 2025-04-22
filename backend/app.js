import express from 'express';
import morgan from 'morgan';
import connectDB from './db/db.js';
import userRoutes from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

connectDB();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/user', userRoutes);

app.get('/', (req,res) =>{
    res.send("Helo World!");
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

export default app;