// ===================================
// TRIP ROUTES
// ===================================

const express = require('express');
const router = express.Router();
const {
    createTrip,
    getTrips,
    getTripById,
    updateTrip,
    deleteTrip,
    getTripStats
} = require('../controllers/tripController');
const { validateTrip, checkValidation } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/trips/stats
 * @desc    Get trip statistics
 * @access  Private
 */
router.get('/stats', getTripStats);

/**
 * @route   POST /api/trips
 * @desc    Create new trip
 * @access  Private
 */
router.post('/', validateTrip, checkValidation, createTrip);

/**
 * @route   GET /api/trips
 * @desc    Get all trips for logged-in user
 * @access  Private
 */
router.get('/', getTrips);

/**
 * @route   GET /api/trips/:id
 * @desc    Get single trip by ID
 * @access  Private
 */
router.get('/:id', getTripById);

/**
 * @route   PUT /api/trips/:id
 * @desc    Update trip
 * @access  Private
 */
router.put('/:id', validateTrip, checkValidation, updateTrip);

/**
 * @route   DELETE /api/trips/:id
 * @desc    Delete trip
 * @access  Private
 */
router.delete('/:id', deleteTrip);

module.exports = router;
