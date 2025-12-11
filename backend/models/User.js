import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false, // Prevents password from being returned by default query
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    // Required for the Admin Dashboard access check (Phase 6)
    role: { 
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, { 
    timestamps: true 
});

// --- 1. Middleware: Hash Password Before Saving ---
// This runs before the .save() call to hash the password
UserSchema.pre('save', async function (next) {
    // Only run if the password field was modified
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- 2. Custom Methods (for Login/Auth) ---

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    // Note: 'this.password' works because we specifically selected it in authMiddleware
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate a JWT token (used upon login/registration)
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};


// FIX: Use the ES Module default export
// This must match the 'import User from ...' statement in authMiddleware.js
const User = mongoose.model('User', UserSchema);
export default User;