import mongoose from 'mongoose';

const PricingRuleSchema = new mongoose.Schema({
    // A descriptive name for the rule (e.g., "Weekend Surcharge", "Peak Hour Multiplier")
    name: {
        type: String,
        required: true,
        trim: true
    },
    // The type dictates how the calculator applies the rule
    type: {
        type: String,
        enum: [
            'MULTIPLIER', // e.g., Peak Hour x 1.5
            'SURCHARGE',  // e.g., Weekend + $5
            'FLAT_FEE'    // e.g., Holiday Flat Fee + $10
        ],
        required: true
    },
    // The value used by the rule type
    value: {
        type: Number,
        required: true
    },
    // Conditions for when the rule applies
    appliesTo: {
        // e.g., 'COURT', 'COACH', 'EQUIPMENT'
        type: String, 
        required: true
    },
    // Time/Day constraints
    startHour: { // Used for rules like Peak Hour
        type: Number,
        min: 0,
        max: 23,
    },
    endHour: { // Used for rules like Peak Hour
        type: Number,
        min: 0,
        max: 23,
    },
    dayOfWeek: { // Used for rules like Weekend Surcharge (0-6)
        type: [Number],
        default: [] 
    },
    // Status
    isActive: {
        type: Boolean,
        default: true
    },
    // Record of who created/last modified the rule
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: false
    }
}, { timestamps: true });
const PricingRule = mongoose.model('PricingRule', PricingRuleSchema);
export default PricingRule;