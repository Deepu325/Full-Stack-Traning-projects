// ===================================
// EXPENSE CONTROLLER
// ===================================

const { promisePool } = require('../config/database');

/**
 * @route   POST /api/trips/:tripId/expenses
 * @desc    Add expense to trip
 * @access  Private
 */
const addExpense = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const userId = req.user.id;
        const { expense_name, amount, category, date, notes } = req.body;
        
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
        
        // Add expense
        const [result] = await promisePool.query(
            'INSERT INTO expenses (trip_id, expense_name, amount, category, date, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [tripId, expense_name, amount, category || 'other', date, notes || null]
        );
        
        // Get created expense
        const [expense] = await promisePool.query(
            'SELECT * FROM expenses WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json({
            success: true,
            message: 'Expense added successfully',
            data: {
                expense: expense[0]
            }
        });
        
    } catch (error) {
        console.error('Add Expense Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding expense',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/trips/:tripId/expenses
 * @desc    Get all expenses for a trip
 * @access  Private
 */
const getExpenses = async (req, res) => {
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
        
        // Get expenses
        const [expenses] = await promisePool.query(
            'SELECT * FROM expenses WHERE trip_id = ? ORDER BY date DESC',
            [tripId]
        );
        
        // Calculate total expenses
        const [total] = await promisePool.query(
            'SELECT SUM(amount) as total FROM expenses WHERE trip_id = ?',
            [tripId]
        );
        
        res.status(200).json({
            success: true,
            count: expenses.length,
            totalAmount: total[0].total || 0,
            data: {
                expenses: expenses
            }
        });
        
    } catch (error) {
        console.error('Get Expenses Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching expenses',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/trips/:tripId/expenses/summary
 * @desc    Get expense summary by category
 * @access  Private
 */
const getExpenseSummary = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const userId = req.user.id;
        
        // Verify trip belongs to user
        const [trips] = await promisePool.query(
            'SELECT id, budget FROM trips WHERE id = ? AND user_id = ?',
            [tripId, userId]
        );
        
        if (trips.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found or unauthorized'
            });
        }
        
        // Get expenses by category
        const [summary] = await promisePool.query(
            `SELECT category, SUM(amount) as total, COUNT(*) as count
             FROM expenses 
             WHERE trip_id = ?
             GROUP BY category`,
            [tripId]
        );
        
        // Get total expenses
        const [total] = await promisePool.query(
            'SELECT SUM(amount) as total FROM expenses WHERE trip_id = ?',
            [tripId]
        );
        
        const budget = trips[0].budget;
        const totalExpenses = total[0].total || 0;
        const remaining = budget - totalExpenses;
        
        res.status(200).json({
            success: true,
            data: {
                budget: budget,
                totalExpenses: totalExpenses,
                remaining: remaining,
                byCategory: summary
            }
        });
        
    } catch (error) {
        console.error('Get Expense Summary Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching expense summary',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/expenses/:id
 * @desc    Update expense
 * @access  Private
 */
const updateExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const userId = req.user.id;
        const { expense_name, amount, category, date, notes } = req.body;
        
        // Verify expense belongs to user's trip
        const [expense] = await promisePool.query(
            `SELECT e.id FROM expenses e
             JOIN trips t ON e.trip_id = t.id
             WHERE e.id = ? AND t.user_id = ?`,
            [expenseId, userId]
        );
        
        if (expense.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found or unauthorized'
            });
        }
        
        // Update expense
        await promisePool.query(
            'UPDATE expenses SET expense_name = ?, amount = ?, category = ?, date = ?, notes = ? WHERE id = ?',
            [expense_name, amount, category, date, notes, expenseId]
        );
        
        // Get updated expense
        const [updated] = await promisePool.query(
            'SELECT * FROM expenses WHERE id = ?',
            [expenseId]
        );
        
        res.status(200).json({
            success: true,
            message: 'Expense updated successfully',
            data: {
                expense: updated[0]
            }
        });
        
    } catch (error) {
        console.error('Update Expense Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating expense',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete expense
 * @access  Private
 */
const deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const userId = req.user.id;
        
        // Verify expense belongs to user's trip
        const [expense] = await promisePool.query(
            `SELECT e.id FROM expenses e
             JOIN trips t ON e.trip_id = t.id
             WHERE e.id = ? AND t.user_id = ?`,
            [expenseId, userId]
        );
        
        if (expense.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found or unauthorized'
            });
        }
        
        // Delete expense
        await promisePool.query(
            'DELETE FROM expenses WHERE id = ?',
            [expenseId]
        );
        
        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete Expense Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting expense',
            error: error.message
        });
    }
};

module.exports = {
    addExpense,
    getExpenses,
    getExpenseSummary,
    updateExpense,
    deleteExpense
};
