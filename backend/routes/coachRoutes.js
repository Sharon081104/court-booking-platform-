// C:\Users\Sharon\Documents\project assignment\root\backend\routes\coachRoutes.js

import express from 'express';
const router = express.Router();
import { getAllCoaches } from '../controllers/coachController.js';
// Placeholder for the controller function (you will create this next)
// import { getAllCoaches } from '../controllers/coachController.js'; 

// Route to get all coaches (used to populate the frontend dropdown)
router.get('/', getAllCoaches);
// Export the router using ESM default export
export default router;