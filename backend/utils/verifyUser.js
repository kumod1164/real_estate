import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    console.log('Request Headers:', req.headers);
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.access_token; 
    console.log('Extracted Token:', token);
    
    if (!token) return res.status(403).json("You are not authenticated!");
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  };