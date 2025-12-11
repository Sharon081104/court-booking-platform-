import mongoose from 'mongoose';

const EquipmentSchema = new mongoose.Schema({
    // Store current stock of resources
    rackets: {
        type: Number,
        required: true,
        default: 50,
        min: 0,
    },
    shoes: {
        type: Number,
        required: true,
        default: 30,
        min: 0,
    },
    // You could add other items like balls, towels, etc.
}, {
    timestamps: true
});

// FIX: Ensure the default export is used for ES Modules
const Equipment = mongoose.model('Equipment', EquipmentSchema);
export default Equipment;

// Note: Because this document holds configuration, you might only ever create one instance.