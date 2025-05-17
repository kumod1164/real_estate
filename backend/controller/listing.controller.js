import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";


export const createListing = async (req, res, next) => {
    try {
      console.log('=== Incoming Request ===');
      console.log('Headers:', req.headers);
      console.log('Request Body:', req.body);
      console.log('User from Token (req.user):', req.user); // If using JWT
  
      if (!req.body.userRef) {
        console.error('Missing userRef in request body');
        return next(errorHandler(400, "User reference is required"));
      }
  
      const listing = await Listing.create(req.body);
      console.log('Listing created:', listing);
  
      res.status(201).json({
        success: true,
        listing
      });
    } catch (error) {
      console.error('Error creating listing:', error);
      next(error);
    }
  };