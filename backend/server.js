// C:\Users\Sharon\Documents\project assignment\root\backend\server.js

// --- 1. CORE IMPORTS (Must use ESM syntax) ---
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Required to fix the CORS policy blocking frontend access

// --- 2. CONFIG & UTILITY IMPORTS (Must use .js extension) ---
import connectDB from './config/db.js';

// --- 3. ROUTE IMPORTS (Must use .js extension) ---
import userRoutes from './routes/userRoutes.js';
import courtRoutes from './routes/courtRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
 import coachRoutes from './routes/coachRoutes.js'; // Assuming you have one

// --- 4. CONFIGURATION ---

// Load environment variables from .env file
dotenv.config();

// Connect to Database
connectDB(); 

const app = express();

// Define the port, defaulting to 5000 from the .env file
const PORT = process.env.PORT || 5000;


// --- 5. MIDDLEWARE ---

// CORS Middleware Configuration (Fixes the frontend access issue)
const allowedOrigins = [
    'http://localhost:3000', // Your React development server
    // Add other frontend domains here if your app is hosted elsewhere
];

const corsOptions = {
    origin: (origin, callback) => {
        // Check if the request origin is in the allowed list, or if it's undefined (like for Postman/cURL)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Block requests from unauthorized origins
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies/authorization headers
};

// Apply CORS middleware
app.use(cors(corsOptions)); 

// Body Parser Middleware (allows Express to read JSON data from the request body)
app.use(express.json());

// URL-encoded Middleware (for form submissions)
app.use(express.urlencoded({ extended: true }));


// --- 6. API ROUTES ---

// Public Welcome Route
app.get('/', (req, res) => res.send('API is running...'));

// Primary Application Routes
app.use('/api/users', userRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/coaches', coachRoutes);// Uncomment when ready

// --- 7. START SERVER ---

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));