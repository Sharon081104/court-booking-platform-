// C:\Users\Sharon\Documents\project assignment\root\backend\middleware\authMiddleware.js

// Change 'require' to 'import' for dependencies (Note the .js extension for local file imports)
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // This is a DEFAULT import; // Assuming you have a User model and it uses export default


// Middleware to protect routes (ensure user is logged in)
const protect = async (req, res, next) => {
    // ... (Your existing protect logic here, using req.headers.authorization and jwt.verify) ...
    
    // Remember, the logic inside this function does not change, only the surrounding import/export syntax does.
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            
            // IMPORTANT: If your User model uses 'export default', you must import it as shown above.
            req.user = await User.findById(decoded.id).select('-password'); 

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found.' });
            }

            next(); 
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }
};


// Middleware to check if the logged-in user is an admin
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an administrator.' });
    }
};

// FIX: Replace 'module.exports = { protect, admin };' with 'export { protect, admin };'
// This creates the NAMED EXPORTS that adminRoutes.js is looking for.
export { protect, admin };