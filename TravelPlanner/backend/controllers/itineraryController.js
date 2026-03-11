// ===================================
// ITINERARY CONTROLLER
// ===================================

const { promisePool } = require('../config/database');

/**
 * @route   POST /api/trips/:tripId/itinerary
 * @desc    Add itinerary item to trip
 * @access  Private
 */
const addItinerary = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const userId = req.user.id;
        const { day_number, activity, time, location } = req.body;
        
        // Verify trip belongs to user
        const [trips] = await promisePool.query(
            'SELECT id FROM trips WHERE id = ? AND user_id = ?',
            [tripId, userId]
        );
        
        if (trips.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found or unauthorized'
            });
        }
        
        // Add itinerary item
        const [result] = await promisePool.query(
            'INSERT INTO itinerary (trip_id, day_number, activity, time, location) VALUES (?, ?, ?, ?, ?)',
            [tripId, day_number, activity, time || null, location || null]
        );
        
        // Get created itinerary item
        const [itinerary] = await promisePool.query(
            'SELECT * FROM itinerary WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json({
            success: true,
            message: 'Itinerary item added successfully',
            data: {
                itinerary: itinerary[0]
            }
        });
        
    } catch (error) {
        console.error('Add Itinerary Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding itinerary',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/trips/:tripId/itinerary
 * @desc    Get all itinerary items for a trip
 * @access  Private
 */
const getItinerary = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const userId = req.user.id;
        
        // Verify trip belongs to user
        const [trips] = await promisePool.query(
            'SELECT id FROM trips WHERE id = ? AND user_id = ?',
            [tripId, userId]
        );
        
        if (trips.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found or unauthorized'
            });
        }
        
        // Get itinerary items
        const [itinerary] = await promisePool.query(
            'SELECT * FROM itinerary WHERE trip_id = ? ORDER BY day_number, time',
            [tripId]
        );
        
        res.status(200).json({
            success: true,
            count: itinerary.length,
            data: {
                itinerary: itinerary
            }
        });
        
    } catch (error) {
        console.error('Get Itinerary Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching itinerary',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/itinerary/:id
 * @desc    Update itinerary item
 * @access  Private
 */
const updateItinerary = async (req, res) => {
    try {
        const itineraryId = req.params.id;
        const userId = req.user.id;
        const { day_number, activity, time, location } = req.body;
        
        // Verify itinerary belongs to user's trip
        const [itinerary] = await promisePool.query(
            `SELECT i.id FROM itinerary i
             JOIN trips t ON i.trip_id = t.id
             WHERE i.id = ? AND t.user_id = ?`,
            [itineraryId, userId]
        );
        
        if (itinerary.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Itinerary item not found or unauthorized'
            });
        }
        
        // Update itinerary item
        await promisePool.query(
            'UPDATE itinerary SET day_number = ?, activity = ?, time = ?, location = ? WHERE id = ?',
            [day_number, activity, time, location, itineraryId]
        );
        
        // Get updated itinerary item
        const [updated] = await promisePool.query(
            'SELECT * FROM itinerary WHERE id = ?',
            [itineraryId]
        );
        
        res.status(200).json({
            success: true,
            message: 'Itinerary item updated successfully',
            data: {
                itinerary: updated[0]
            }
        });
        
    } catch (error) {
        console.error('Update Itinerary Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating itinerary',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/itinerary/:id
 * @desc    Delete itinerary item
 * @access  Private
 */
const deleteItinerary = async (req, res) => {
    try {
        const itineraryId = req.params.id;
        const userId = req.user.id;
        
        // Verify itinerary belongs to user's trip
        const [itinerary] = await promisePool.query(
            `SELECT i.id FROM itinerary i
             JOIN trips t ON i.trip_id = t.id
             WHERE i.id = ? AND t.user_id = ?`,
            [itineraryId, userId]
        );
        
        if (itinerary.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Itinerary item not found or unauthorized'
            });
        }
        
        // Delete itinerary item
        await promisePool.query(
            'DELETE FROM itinerary WHERE id = ?',
            [itineraryId]
        );
        
        res.status(200).json({
            success: true,
            message: 'Itinerary item deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete Itinerary Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting itinerary',
            error: error.message
        });
    }
};

module.exports = {
    addItinerary,
    getItinerary,
    updateItinerary,
    deleteItinerary
};
