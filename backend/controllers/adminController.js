// C:\Users\Sharon\Documents\project assignment\root\backend\controllers\adminController.js

// FIX 1: Change CJS require to ESM import with .js extensions
import Court from '../models/Court.js';
import Coach from '../models/Coach.js';
import Equipment from '../models/Equipment.js';
import PricingRule from '../models/PricingRule.js';

// --- 1. Pricing Rule Management ---

// FIX 2: Change exports.createPricingRule to const createPricingRule
const createPricingRule = async (req, res) => {
    try {
        // Validation: Ensure required fields are present and value is logical
        const { name, type, value, appliesTo } = req.body;
        // ... (rest of the logic) ...
        const newRule = new PricingRule(req.body);
        const savedRule = await newRule.save();

        res.status(201).json({ 
            message: 'Pricing Rule created successfully.', 
            rule: savedRule 
        });

    } catch (error) {
        // ... error handling ...
    }
};

// FIX 3: Change exports.getAllPricingRules to const getAllPricingRules
const getAllPricingRules = async (req, res) => {
    try {
        const rules = await PricingRule.find({});
        res.status(200).json(rules);
    } catch (error) {
        // ... error handling ...
    }
};

// --- 2. Court Management ---

// FIX 4 (Current Error Point): Change exports.createCourt to const createCourt
const createCourt = async (req, res) => {
    try {
        const { name, type, hourlyPrice } = req.body;
        const newCourt = new Court({ 
            name, 
            type, 
            hourlyPrice: hourlyPrice || 10 // Use default if price isn't set
        });
        const savedCourt = await newCourt.save();
        res.status(201).json({ message: 'Court created successfully.', court: savedCourt });
    } catch (error) {
        // ... error handling ...
    }
};

// FIX 5: Change exports.getAllCourts to const getAllCourts
const getAllCourts = async (req, res) => {
    try {
        const courts = await Court.find({});
        res.status(200).json(courts);
    } catch (error) {
        // ... error handling ...
    }
};


// --- 3. Coach Management ---
// NOTE: This function was already correctly defined as 'const createCoach' in your snippet.
const createCoach = async (req, res) => {
    // ... (logic is fine) ...
};

// --- 4. Equipment Management ---

// FIX 6: Change exports.updateEquipmentStock to const updateEquipmentStock
const updateEquipmentStock = async (req, res) => {
    try {
        // ... (rest of the logic) ...
        const updatedEquipment = await Equipment.findOneAndUpdate(
            {}, 
            { $set: req.body }, 
            { new: true, upsert: true }
        );
        res.status(200).json({ message: 'Equipment stock updated successfully.', equipment: updatedEquipment });
    } catch (error) {
        // ... error handling ...
    }
};

// --- 5. Exports (This block is fine) ---
export {
    createPricingRule,
    getAllPricingRules,
    createCourt,
    getAllCourts,
    createCoach, 
    updateEquipmentStock
};