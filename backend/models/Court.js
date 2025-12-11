import mongoose from 'mongoose';

const CourtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['Indoor', 'Outdoor', 'Clay', 'Grass'],
        required: true,
    },
    hourlyPrice: {
        type: Number,
        required: true,
        default: 10.00, // Base price for Phase 4 calculation
    },
}, {
    timestamps: true
});

// FIX: Ensure the default export is used for ES Modules
const Court = mongoose.model('Court', CourtSchema);
export default Court;