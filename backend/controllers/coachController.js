// C:\Users\Sharon\Documents\project assignment\root\backend\controllers\coachController.js

import Coach from '../models/Coach.js';

const getAllCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find({});
        res.status(200).json(coaches);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching coaches.', error: error.message });
    }
};

export { getAllCoaches };