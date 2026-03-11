// ===================================
// TRIPS CONTROLLER
// ===================================

const { promisePool } = require('../config/database');

/**
 * @route   POST /api/trips
 * @desc    Create new trip
 * @access  Private
 */
const createTrip = async (req, res) => {
    try {
        const { destination, start_date, end_date, budget, travel_type, notes, status } = req.body;
        const userId = req.user.id;
        
        const [result] = await promisePool.query(
            `INSERT INTO trips (user_id, destination, start_date, end_date, budget, travel_type, notes, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, destination, start_date, end_date, budget || 0, travel_type || 'leisure', notes || '', status || 'upcoming']
        );
        
        // Get the created trip
        const [trips] = await promisePool.query(
            'SELECT * FROM trips WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json({
            success: true,
            message: 'Trip created successfully',
            data: {
                trip: trips[0]
            }
        });
        
    } catch (error) {
        console.error('Create Trip Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating trip',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/trips
 * @desc    Get all trips for logged-in user
 * @access  Private
 */
const getTrips = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;
        
        let query = 'SELECT * FROM trips WHERE user_id = ?';
        let params = [userId];
        
        // Filter by status if provided
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY start_date DESC';
        
        const [trips] = await promisePool.query(query, params);
        
        res.status(200).json({
            success: true,
            count: trips.length,
            data: {
                trips: trips
            }
        });
        
    } catch (error) {
        console.error('Get Trips Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching trips',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/trips/:id
 * @desc    Get single trip by ID
 * @access  Private
 */
const getTripById = async (req, res) => {
    try {
        const tripId = req.params.id;
        const userId = req.user.id;
        
        const [trips] = await promisePool.query(
            'SELECT * FROM trips WHERE id = ? AND user_id = ?',
            [tripId, userId]
        );
        
        if (trips.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }
        
        // Get itinerary for this trip
        const [itinerary] = await promisePool.query(
            'SELECT * FROM itinerary WHERE trip_id = ? ORDER BY day_number, time',
            [tripId]
        );
        
        // Get expenses for this trip
        const [expenses] = await promisePool.query(
            'SELECT * FROM expenses WHERE trip_id = ? ORDER BY date DESC',
            [tripId]
        );
        
        res.status(200).json({
            success: true,
            data: {
                trip: trips[0],
                itinerary: itinerary,
                expenses: expenses
            }
        });
        
    } catch (error) {
        console.error('Get Trip Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching trip',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/trips/:id
 * @desc    Update trip
 * @access  Private
 */
const updateTrip = async (req, res) => {
    try {
        const tripId = req.params.id;
        const userId = req.user.id;
        const { destination, start_date, end_date, budget, travel_type, notes, status } = req.body;
        
        // Check if trip exists and belongs to user
        const [existingTrips] = await promisePool.query(
            'SELECT id FROM trips WHERE id = ? AND user_id = ?',
            [tripId, userId]
        );
        
        if (existingTrips.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found or unauthorized'
            });
        }
        
        // Update trip
        await promisePool.query(
            `UPDATE trips 
             SET destination = ?, start_date = ?, end_date = ?, budget = ?, 
                 travel_type = ?, notes = ?, status = ?
             WHERE id = ? AND user_id = ?`,
            [destination, start_date, end_date, budget, travel_type, notes, status, tripId, userId]
        );
        
        // Get updated trip
        const [trips] = await promisePool.query(
            'SELECT * FROM trips WHERE id = ?',
            [tripId]
        );
        
        res.status(200).json({
            success: true,
            message: 'Trip updated successfully',
            data: {
                trip: trips[0]
            }
        });
        
    } catch (error) {
        console.error('Update Trip Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating trip',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/trips/:id
 * @desc    Delete trip
 * @access  Private
 */
const deleteTrip = async (req, res) => {
    try {
        const tripId = req.params.id;
        const userId = req.user.id;
        
        // Check if trip exists and belongs to user
        const [existingTrips] = await promisePool.query(
            'SELECT id FROM trips WHERE id = ? AND user_id = ?',
            [tripId, userId]
        );
        
        if (existingTrips.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found or unauthorized'
            });
        }
        
        // Delete trip (cascade will delete related itinerary and expenses)
        await promisePool.query(
            'DELETE FROM trips WHERE id = ? AND user_id = ?',
            [tripId, userId]
        );
        
        res.status(200).json({
            success: true,
            message: 'Trip deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete Trip Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting trip',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/trips/stats
 * @desc    Get trip statistics for user
 * @access  Private
 */
const getTripStats = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get total trips
        const [totalTrips] = await promisePool.query(
            'SELECT COUNT(*) as total FROM trips WHERE user_id = ?',
            [userId]
        );
        
        // Get upcoming trips
        const [upcomingTrips] = await promisePool.query(
            'SELECT COUNT(*) as upcoming FROM trips WHERE user_id = ? AND status = "upcoming"',
            [userId]
        );
        
        // Get completed trips
        const [completedTrips] = await promisePool.query(
            'SELECT COUNT(*) as completed FROM trips WHERE user_id = ? AND status = "completed"',
            [userId]
        );
        
        // Get total budget
        const [totalBudget] = await promisePool.query(
            'SELECT SUM(budget) as total_budget FROM trips WHERE user_id = ?',
            [userId]
        );
        
        res.status(200).json({
            success: true,
            data: {
                stats: {
                    total: totalTrips[0].total,
                    upcoming: upcomingTrips[0].upcoming,
                    completed: completedTrips[0].completed,
                    totalBudget: totalBudget[0].total_budget || 0
                }
            }
        });
        
    } catch (error) {
        console.error('Get Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics',
            error: error.message
        });
    }
};

module.exports = {
    createTrip,
    getTrips,
    getTripById,
    updateTrip,
    deleteTrip,
    getTripStats
};
