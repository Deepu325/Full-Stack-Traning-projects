// ===================================
// EXPENSE ROUTES
// ===================================

const express = require('express');
const router = express.Router();
const {
    addExpense,
    getExpenses,
    getExpenseSummary,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseController');
const { validateExpense, checkValidation } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/trips/:tripId/expenses
 * @desc    Add expense to trip
 * @access  Private
 */
router.post('/trips/:tripId/expenses', validateExpense, checkValidation, addExpense);

/**
 * @route   GET /api/trips/:tripId/expenses
 * @desc    Get all expenses for a trip
 * @access  Private
 */
router.get('/trips/:tripId/expenses', getExpenses);

/**
 * @route   GET /api/trips/:tripId/expenses/summary
 * @desc    Get expense summary by category
 * @access  Private
 */
router.get('/trips/:tripId/expenses/summary', getExpenseSummary);

/**
 * @route   PUT /api/expenses/:id
 * @desc    Update expense
 * @access  Private
 */
router.put('/expenses/:id', validateExpense, checkValidation, updateExpense);

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete expense
 * @access  Private
 */
router.delete('/expenses/:id', deleteExpense);

module.exports = router;
