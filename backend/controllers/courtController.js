// C:\Users\Sharon\Documents\project assignment\root\backend\controllers\courtController.js

// FIX 1: Change CJS 'require' to ESM 'import' with .js extension
import Court from '../models/Court.js'; 

/**
 * @desc Get all available courts
 * @route GET /api/courts
 * @access Public
 */
// FIX 2: Define using 'const' for proper ESM named export
const getAllCourts = async (req, res) => {
    try {
        const courts = await Court.find({});
        res.status(200).json(courts);
    } catch (error) {
        console.error('Error fetching courts:', error);
        res.status(500).json({ message: 'Server error while fetching courts.' });
    }
};

/**
 * @desc Get a single court by ID
 * @route GET /api/courts/:id
 * @access Public
 */
// FIX 2: Define using 'const' for proper ESM named export
const getCourtById = async (req, res) => {
    try {
        const court = await Court.findById(req.params.id);
        if (court) {
            res.status(200).json(court);
        } else {
            res.status(404).json({ message: 'Court not found.' });
        }
    } catch (error) {
        console.error('Error fetching court by ID:', error);
        res.status(500).json({ message: 'Server error fetching court.' });
    }
};

// FIX 3: Replace CJS export (if any) with ESM named export
export {
    getAllCourts,
    getCourtById
};