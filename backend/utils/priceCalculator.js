// C:\Users\Sharon\Documents\project assignment\root\backend\utils\priceCalculator.js

// --- 1. Imports ---
// We must ensure these Mongoose models exist in your /models folder
import Court from '../models/Court.js';
import PricingRule from '../models/PricingRule.js';
import Coach from '../models/Coach.js'; 

/**
 * @desc Calculates the final price of a booking based on court, time, rules, and resources.
 * @param {string} courtId - The ID of the court.
 * @param {Date} startTime - Start time of the booking.
 * @param {Date} endTime - End time of the booking.
 * @param {object} requestedResources - { rackets: number, shoes: number }
 * @param {string} coachId - The ID of the coach (optional).
 * @returns {object} pricingBreakdown - Detailed price breakdown.
 */
const calculateBookingPrice = async (courtId, startTime, endTime, requestedResources, coachId) => {
    // --- A. Data Validation and Fetching ---
    const court = await Court.findById(courtId);
    if (!court) {
        throw new Error("Court not found for pricing.");
    }
    
    // --- B. Duration Calculation ---
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);

    // --- C. Base Price Calculation (Court Rate) ---
    let baseCourtFee = durationHours * court.hourlyPrice;
    
    // --- D. Coach Cost Calculation ---
    let baseCoachFee = 0;
    if (coachId) {
        const coach = await Coach.findById(coachId);
        // Fallback to a hardcoded rate if the coach doesn't have one
        const coachRate = coach?.hourlyRate || 60.00; 
        baseCoachFee = coachRate * durationHours;
    }
    
    // --- E. Pricing Rule Adjustments (Placeholder for now) ---
    // In a real app, this is where you apply peak pricing, discounts, etc.
    const rules = await PricingRule.find({ status: 'active' });
    let ruleAdjustments = 0; // Example: ruleAdjustments = baseCourtFee * 0.10 (for 10% surcharge)
    
    // --- F. Resource Cost ---
    // Note: Assuming a hardcoded price of $5/racket and $3/shoe for now
    const racketRentalPrice = 5.00;
    const shoeRentalPrice = 3.00; 

    let equipmentFee = (requestedResources.rackets || 0) * racketRentalPrice;
    equipmentFee += (requestedResources.shoes || 0) * shoeRentalPrice;

    // --- G. Final Total ---
    const total = baseCourtFee + baseCoachFee + equipmentFee + ruleAdjustments;

    // Return the breakdown object
    return {
        baseCourtFee: parseFloat(baseCourtFee.toFixed(2)),
        baseCoachFee: parseFloat(baseCoachFee.toFixed(2)),
        equipmentFee: parseFloat(equipmentFee.toFixed(2)),
        ruleAdjustments: parseFloat(ruleAdjustments.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
    };
};

// --- Export the Correct Function ---
export {
    calculateBookingPrice
};