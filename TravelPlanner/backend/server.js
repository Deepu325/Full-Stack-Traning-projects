// ===================================
// TRAVEL PLANNER BACKEND SERVER
// ===================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Initialize Express app
const app = express();

// ===================================
// MIDDLEWARE
// ===================================

// CORS Configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://127.0.0.1:5500',
    credentials: true
}));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request Logger Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// ===================================
// ROUTES
// ===================================

// Import routes
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api', itineraryRoutes);
app.use('/api', expenseRoutes);

// Root Route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Travel Planner API Server',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            trips: '/api/trips',
            itinerary: '/api/trips/:tripId/itinerary',
            expenses: '/api/trips/:tripId/expenses'
        }
    });
});

// Health Check Route
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// ===================================
// ERROR HANDLING
// ===================================

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// ===================================
// START SERVER
// ===================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Test database connection
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.error('❌ Failed to connect to database');
            console.log('💡 Please run: npm run init-db');
            process.exit(1);
        }
        
        // Start server
        app.listen(PORT, () => {
            console.log('\n🚀 ========================================');
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`📍 API URL: http://localhost:${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
            console.log('🚀 ========================================\n');
            console.log('📝 Available Endpoints:');
            console.log('   POST   /api/auth/register');
            console.log('   POST   /api/auth/login');
            console.log('   GET    /api/auth/me');
            console.log('   GET    /api/trips');
            console.log('   POST   /api/trips');
            console.log('   GET    /api/trips/:id');
            console.log('   PUT    /api/trips/:id');
            console.log('   DELETE /api/trips/:id');
            console.log('   GET    /api/trips/stats');
            console.log('   POST   /api/trips/:tripId/itinerary');
            console.log('   GET    /api/trips/:tripId/itinerary');
            console.log('   PUT    /api/itinerary/:id');
            console.log('   DELETE /api/itinerary/:id');
            console.log('   POST   /api/trips/:tripId/expenses');
            console.log('   GET    /api/trips/:tripId/expenses');
            console.log('   GET    /api/trips/:tripId/expenses/summary');
            console.log('   PUT    /api/expenses/:id');
            console.log('   DELETE /api/expenses/:id');
            console.log('\n✅ Server ready to accept requests!\n');
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

module.exports = app;
