import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userroutes from './routes/userroutes.js';
import authroutes from './routes/auth.route.js';

dotenv.config();

mongoose.connect(process.env.MONGODB).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

const app = express();

const PORT = 3000;



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    });

app.use(express.json());
app.use('/user', userroutes);
app.use('/auth', authroutes);

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