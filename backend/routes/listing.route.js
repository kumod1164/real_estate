import express from 'express';
import { createListing, getListing } from '../controller/listing.controller.js';
import { verifyToken } from '../middleware.js';

const router = express.Router();

// Create a new listing (requires authentication)
router.post('/', verifyToken, createListing);

// Get a single listing by ID (public route)
router.get('/:id', getListing);

export default router;
