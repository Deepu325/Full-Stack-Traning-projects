// ===================================
// ITINERARY ROUTES
// ===================================

const express = require('express');
const router = express.Router();
const {
    addItinerary,
    getItinerary,
    updateItinerary,
    deleteItinerary
} = require('../controllers/itineraryController');
const { validateItinerary, checkValidation } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/trips/:tripId/itinerary
 * @desc    Add itinerary item to trip
 * @access  Private
 */
router.post('/trips/:tripId/itinerary', validateItinerary, checkValidation, addItinerary);

/**
 * @route   GET /api/trips/:tripId/itinerary
 * @desc    Get all itinerary items for a trip
 * @access  Private
 */
router.get('/trips/:tripId/itinerary', getItinerary);

/**
 * @route   PUT /api/itinerary/:id
 * @desc    Update itinerary item
 * @access  Private
 */
router.put('/itinerary/:id', validateItinerary, checkValidation, updateItinerary);

/**
 * @route   DELETE /api/itinerary/:id
 * @desc    Delete itinerary item
 * @access  Private
 */
router.delete('/itinerary/:id', deleteItinerary);

module.exports = router;
