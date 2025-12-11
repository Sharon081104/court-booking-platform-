// C:\Users\Sharon\Documents\project assignment\root\backend\controllers\bookingController.js

// --- 1. Imports ---
import asyncHandler from 'express-async-handler'; // Used for simplified error handling
import Booking from '../models/Booking.js';
import Coach from '../models/Coach.js'; 
import Equipment from '../models/Equipment.js'; 
import { calculateBookingPrice } from '../utils/priceCalculator.js'; // Named import for utility


// --- 2. Availability Utility Functions ---

/**
 * Checks if a specific resource (Court or Coach) is already booked during the requested time.
 * @param {ObjectId} resourceId - ID of the Court or Coach.
 * @param {string} resourceKey - 'court' or 'coach'.
 * @param {Date} startTime - Requested start time.
 * @param {Date} endTime - Requested end time.
 * @returns {Promise<boolean>} - True if available, False if overlap found.
 */
async function checkOverlap(resourceId, resourceKey, startTime, endTime) {
    if (!resourceId) return true; // If the resource is optional (like coach) and not requested, skip check

    const query = {
        [resourceKey]: resourceId,
        status: 'confirmed', // Only check confirmed bookings
        $or: [
            // Case 1: Existing booking starts during the requested slot
            { startTime: { $lt: endTime, $gte: startTime } },
            // Case 2: Existing booking ends during the requested slot
            { endTime: { $gt: startTime, $lte: endTime } },
            // Case 3: Existing booking completely contains the requested slot
            { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
        ]
    };

    const existingBooking = await Booking.findOne(query);
    return !existingBooking; 
}

// Helper wrappers 
const checkCourtOverlap = (courtId, start, end) => checkOverlap(courtId, 'court', start, end);
const checkCoachOverlap = (coachId, start, end) => checkOverlap(coachId, 'coach', start, end);


/**
 * Checks if enough equipment stock is available, considering current confirmed bookings.
 * @param {object} requestedResources - { rackets: number, shoes: number }
 * @param {Date} startTime - Requested start time.
 * @param {Date} endTime - Requested end time.
 * @returns {Promise<{status: boolean, message?: string}>}
 */
async function checkEquipmentAvailability(requestedResources, startTime, endTime) {
    const stockConfig = await Equipment.findOne({}); // Assumes stock is stored in a single document
    if (!stockConfig) return { status: false, message: 'Equipment stock configuration not found.' };

    const overlappingBookings = await Booking.find({
        status: 'confirmed',
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        ]
    });

    let maxBookedRackets = 0;
    let maxBookedShoes = 0;
    
    overlappingBookings.forEach(booking => {
        maxBookedRackets += booking.resources?.rackets || 0;
        maxBookedShoes += booking.resources?.shoes || 0;
    });

    const neededRackets = (requestedResources.rackets || 0) + maxBookedRackets;
    const neededShoes = (requestedResources.shoes || 0) + maxBookedShoes;

    if (neededRackets > stockConfig.rackets) {
        return { status: false, message: `Not enough rackets available. Stock: ${stockConfig.rackets}, Currently Booked: ${maxBookedRackets}.` };
    }
    if (neededShoes > stockConfig.shoes) {
        return { status: false, message: `Not enough shoes available. Stock: ${stockConfig.shoes}, Currently Booked: ${maxBookedShoes}.` };
    }

    return { status: true };
}


// --- 3. Main Controller Logic ---

/**
 * @desc Get the live price breakdown for a requested booking slot
 * @route POST /api/bookings/calculate-price
 * @access Public
 *
 * NOTE: This function was missing, causing the repeated SyntaxError.
 */
const calculatePriceController = asyncHandler(async (req, res) => {
    const { courtId, start, end, coachId, requestedResources } = req.body;
    
    // Use the New Date() constructor to ensure consistency
    const startTime = new Date(start);
    const endTime = new Date(end);

    if (endTime <= startTime) {
        return res.status(400).json({ message: 'End time must be after start time.' });
    }

    try {
        // Use your existing pricing utility function
        const pricingBreakdown = await calculateBookingPrice(
            courtId,
            startTime,
            endTime,
            requestedResources,
            coachId
        );
        res.status(200).json(pricingBreakdown);
    } catch (error) {
        console.error('Price calculation failed:', error.message);
        res.status(400).json({ message: 'Failed to calculate price.', error: error.message });
    }
});


/**
 * @desc Create a new booking
 * @route POST /api/bookings
 * @access Public/Private (depending on app design)
 */
const createBooking = asyncHandler(async (req, res) => {
    const { 
        courtId, 
        userId, 
        start, 
        end,
        coachId, 
        requestedResources = { rackets: 0, shoes: 0 } 
    } = req.body; 

    const startTime = new Date(start);
    const endTime = new Date(end);

    if (endTime <= startTime) {
        return res.status(400).json({ message: 'End time must be after start time.' });
    }

    // --- A. Check Court Availability ---
    const isCourtFree = await checkCourtOverlap(courtId, startTime, endTime);
    if (!isCourtFree) {
        return res.status(409).json({ message: 'Court is already booked for this time slot.' });
    }

    // --- B. Check Coach Availability (if requested) ---
    if (coachId) {
        const isCoachFree = await checkCoachOverlap(coachId, startTime, endTime);
        if (!isCoachFree) {
            return res.status(409).json({ message: 'The requested Coach is unavailable during this time.' });
        }
    }

    // --- C. Check Equipment Stock ---
    const equipmentCheck = await checkEquipmentAvailability(requestedResources, startTime, endTime);
    if (equipmentCheck.status === false) {
        return res.status(409).json({ message: equipmentCheck.message });
    }

    // --- D. Pricing Calculation ---
    let pricingBreakdown;
    try {
        pricingBreakdown = await calculateBookingPrice(
            courtId, 
            startTime,
            endTime,
            requestedResources, 
            coachId
        );
    } catch (error) {
        console.error('Pricing Calculation Error:', error);
        return res.status(500).json({ message: 'Failed to calculate booking price.' });
    }
    
    // --- E. Create and Save Booking ---
    try {
        const newBooking = new Booking({
            user: userId, // Ensure you capture the logged-in user ID here
            court: courtId,
            startTime: startTime,
            endTime: endTime,
            resources: requestedResources,
            coach: coachId,
            status: 'confirmed', // Final confirmation
            totalPrice: pricingBreakdown.total, // Store the final price
             priceDetails: pricingBreakdown
        });

        const savedBooking = await newBooking.save();
        res.status(201).json({ message: 'Booking successful!', booking: savedBooking });
        
    } catch (error) {
        console.error("Database Save Error:", error);
        res.status(500).json({ message: 'Failed to save booking to the database.', error: error.message });
    }
});


/**
 * @desc Fetches a list of all confirmed bookings (Admin access required).
 * @route GET /api/bookings/admin
 * @access Private/Admin
 */
const getAllBookings = asyncHandler(async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('court', 'name hourlyPrice') // Fetch details from linked collections
            .populate('coach', 'name hourlyRate') 
            .sort({ startTime: 1 })
            .lean();

        res.status(200).json(bookings);

    } catch (error) {
        console.error('Error fetching all bookings:', error);
        res.status(500).json({ message: 'Server error fetching bookings.' });
    }
});


// --- 4. Module Exports (The FIX that resolves the SyntaxError) ---
export { 
    createBooking,
    getAllBookings,
    calculatePriceController, // <-- THIS MUST BE EXPORTED FOR THE ROUTER TO FIND IT!
    checkCourtOverlap,
    checkCoachOverlap,
    checkEquipmentAvailability
};