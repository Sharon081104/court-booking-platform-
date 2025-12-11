import mongoose from 'mongoose';

const CoachSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    hourlyRate: {
        type: Number,
        required: true,
        default: 20.00,
    },
    specialties: {
        type: [String],
        default: [],
    },
}, { 
    timestamps: true 
});

// FIX: Replace 'module.exports = ...' with 'export default ...'
const Coach = mongoose.model('Coach', CoachSchema);
export default Coach;