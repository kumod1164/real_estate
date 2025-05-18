import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'asunigy3212gdasbk8zhh';

export const verifyToken = (req, res, next) => {
  console.log('Request Headers:', req.headers);
  // Only get token from cookie since that's where it's stored
  const token = req.cookies.access_token;
  console.log('Extracted Token:', token);
  
  if (!token) {
    console.log('No token found in cookie');
    return res.status(403).json({ success: false, message: "You are not authenticated!" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err);
      // Clear the invalid token cookie
      res.clearCookie('access_token');
      // Return error response with message
      return res.status(403).json({ 
        success: false, 
        message: err.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token',
        statusCode: 403
      });
    }
    req.user = user; // Attach user to the request
    next();
  });
};