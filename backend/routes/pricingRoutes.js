// backend/routes/pricingRoutes.js
const express = require('express');
const router = express.Router();
// const { isAdmin } = require('../middleware/authMiddleware'); // Uncomment when implemented
const PricingRule = require('../models/PricingRule');

// @route   POST /api/pricing/admin
// @desc    Create a new pricing rule
router.post('/admin', async (req, res) => { // , isAdmin
    try {
        const newRule = new PricingRule(req.body);
        const savedRule = await newRule.save();
        res.status(201).json(savedRule);
    } catch (error) {
        res.status(400).json({ message: 'Failed to add rule: ' + error.message });
    }
});

// @route   GET /api/pricing/admin
// @desc    List all rules (for editing)
router.get('/admin', async (req, res) => { // , isAdmin
    const rules = await PricingRule.find({});
    res.json(rules);
});

module.exports = router;