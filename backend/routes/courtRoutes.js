// C:\Users\Sharon\Documents\project assignment\root\backend\routes\courtRoutes.js

// FIX 1: Change 'require' to 'import'
import express from 'express';
const router = express.Router();

// Assuming you have functions like getAllCourts and getCourtById
// FIX 2: Change require to import, use .js extension
import { 
    getAllCourts, 
    getCourtById 
} from '../controllers/courtController.js'; 

// --- Route Definitions ---
// Example routes for public access
router.route('/')
    .get(getAllCourts);

router.route('/:id')
    .get(getCourtById);

// FIX 3: Replace 'module.exports = router;' with 'export default router;'
export default router;