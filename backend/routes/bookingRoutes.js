// C:\Users\Sharon\Documents\project assignment\root\backend\routes\bookingRoutes.js

import express from 'express';
const router = express.Router();

// FIX 1: Change require to import, and ensure .js extension
// Assuming the controller exports: createBooking, getAllBookings, AND calculatePriceController
import { 
    createBooking, 
    getAllBookings,
    calculatePriceController
} from '../controllers/bookingController.js'; 
// Import authentication middleware if you are protecting routes
// import { protect, admin } from '../middleware/authMiddleware.js'; 

// Route definitions

// 1. New Route for Price Calculation (FIXES THE 404 ERROR)
router.post('/calculate-price', calculatePriceController); // Maps to /api/bookings/calculate-price

router.route('/').post(createBooking); // Public booking creation (Maps to /api/bookings/)
router.route('/admin').get(getAllBookings); // Admin view (Maps to /api/bookings/admin)

// FIX 2: Change module.exports = router to export default router
export default router;