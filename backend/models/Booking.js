// C:\Users\Sharon\Documents\project assignment\root\backend\models\Booking.js

import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Reference to the User model
        },
        court: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Court', // Reference to the Court model
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        coach: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coach', // Reference to the Coach model (optional)
        },
        resources: {
            rackets: { type: Number, default: 0 },
            shoes: { type: Number, default: 0 },
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        priceDetails: {
            // Store the full price breakdown at the time of booking
            type: Object,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;