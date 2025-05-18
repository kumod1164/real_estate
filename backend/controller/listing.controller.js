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

  export const deleteListing = async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);
      
      if (!listing) {
        return next(errorHandler(404, "Listing not found"));
      }
  
      if (req.user.id !== listing.userRef.toString()) {
        return next(errorHandler(401, "You can only delete your own listing"));
      }
  
      await listing.deleteOne();
      res.status(200).json({
        success: true,
        message: "Listing deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  };