// C:\Users\Sharon\Documents\project assignment\root\backend\routes\userRoutes.js

import express from 'express';
const router = express.Router();

// Import necessary controller functions (assuming you will create these later)
// import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';

// --- Define Minimal Routes to allow server start ---

// router.post('/', registerUser); // Placeholder for user registration
// router.post('/login', loginUser); // Placeholder for user login
// router.route('/profile').get(getUserProfile); // Placeholder for user profile

// A simple test route to ensure the router loads
router.get('/test', (req, res) => res.send('User Routes loaded successfully!'));

// Export the router using ESM default export
export default router;