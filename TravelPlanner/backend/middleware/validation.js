// ===================================
// VALIDATION MIDDLEWARE
// ===================================

const { body, validationResult } = require('express-validator');

/**
 * Validation rules for user registration
 */
const validateRegistration = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

/**
 * Validation rules for user login
 */
const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    
    body('password')
        .notEmpty().withMessage('Password is required')
];

/**
 * Validation rules for creating/updating trip
 */
const validateTrip = [
    body('destination')
        .trim()
        .notEmpty().withMessage('Destination is required'),
    
    body('start_date')
        .notEmpty().withMessage('Start date is required')
        .isDate().withMessage('Invalid start date format'),
    
    body('end_date')
        .notEmpty().withMessage('End date is required')
        .isDate().withMessage('Invalid end date format')
        .custom((value, { req }) => {
            if (new Date(value) < new Date(req.body.start_date)) {
                throw new Error('End date must be after start date');
            }
            return true;
        }),
    
    body('budget')
        .optional()
        .isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
    
    body('travel_type')
        .optional()
        .isIn(['leisure', 'business', 'adventure', 'family', 'solo', 'other'])
        .withMessage('Invalid travel type')
];

/**
 * Validation rules for itinerary
 */
const validateItinerary = [
    body('day_number')
        .notEmpty().withMessage('Day number is required')
        .isInt({ min: 1 }).withMessage('Day number must be a positive integer'),
    
    body('activity')
        .trim()
        .notEmpty().withMessage('Activity is required')
];

/**
 * Validation rules for expense
 */
const validateExpense = [
    body('expense_name')
        .trim()
        .notEmpty().withMessage('Expense name is required'),
    
    body('amount')
        .notEmpty().withMessage('Amount is required')
        .isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    
    body('date')
        .notEmpty().withMessage('Date is required')
        .isDate().withMessage('Invalid date format'),
    
    body('category')
        .optional()
        .isIn(['accommodation', 'food', 'transport', 'activities', 'shopping', 'other'])
        .withMessage('Invalid category')
];

/**
 * Middleware to check validation results
 */
const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    
    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateTrip,
    validateItinerary,
    validateExpense,
    checkValidation
};
