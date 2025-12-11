import express from 'express';

// Note 1: Import express as default.
// Note 2: Include .js extension for local files.
import { protect, admin } from '../middleware/authMiddleware.js'; 
// Note 3: Use named imports for functions from the controller file.
import { 
    createPricingRule, 
    getAllPricingRules, 
    createCourt, 
    createCoach, 
    updateEquipmentStock 
} from '../controllers/adminController.js'; 

const router = express.Router();

// All routes below require both 'protect' (logged in) and 'admin' (admin user) middleware

// Pricing Rules
router.route('/pricing-rules')
    .post(protect, admin, createPricingRule) 
    .get(protect, admin, getAllPricingRules);

// Courts
router.post('/courts', protect, admin, createCourt);

// Coaches
router.post('/coaches', protect, admin, createCoach);

// Equipment Stock
router.put('/equipment', protect, admin, updateEquipmentStock);

// FIX: Replace 'module.exports = router;' with 'export default router;'
export default router;