import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userroutes from './routes/userroutes.js';
import authroutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.routes.js'; 

dotenv.config();


mongoose.connect(process.env.MONGODB || 'mongodb://localhost:27017/real_estate').then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/user', userroutes);

app.use('/auth', authroutes);

app.use('/listing', listingRouter);

app.use(cookieParser());
// middleware for handling errors

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});