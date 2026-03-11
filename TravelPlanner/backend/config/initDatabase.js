// ===================================
// DATABASE INITIALIZATION SCRIPT
// ===================================

const mysql = require('mysql2/promise');
require('dotenv').config();

// SQL Schema for all tables
const createDatabaseSQL = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;

const createUsersTableSQL = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createTripsTableSQL = `
CREATE TABLE IF NOT EXISTS trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    destination VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(10, 2) DEFAULT 0.00,
    travel_type VARCHAR(50) DEFAULT 'leisure',
    notes TEXT,
    status ENUM('upcoming', 'completed', 'cancelled') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createItineraryTableSQL = `
CREATE TABLE IF NOT EXISTS itinerary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    day_number INT NOT NULL,
    activity TEXT NOT NULL,
    time VARCHAR(20),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    INDEX idx_trip_id (trip_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const createExpensesTableSQL = `
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    expense_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) DEFAULT 'other',
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    INDEX idx_trip_id (trip_id),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

// Initialize database
async function initializeDatabase() {
    let connection;
    
    try {
        console.log('🚀 Starting Database Initialization...\n');
        
        // Connect to MySQL server (without database)
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });
        
        console.log('✅ Connected to MySQL Server');
        
        // Create database
        await connection.query(createDatabaseSQL);
        console.log(`✅ Database '${process.env.DB_NAME}' created/verified`);
        
        // Use the database
        await connection.query(`USE ${process.env.DB_NAME}`);
        
        // Create tables
        console.log('\n📊 Creating Tables...');
        
        await connection.query(createUsersTableSQL);
        console.log('✅ Users table created');
        
        await connection.query(createTripsTableSQL);
        console.log('✅ Trips table created');
        
        await connection.query(createItineraryTableSQL);
        console.log('✅ Itinerary table created');
        
        await connection.query(createExpensesTableSQL);
        console.log('✅ Expenses table created');
        
        console.log('\n🎉 Database initialization completed successfully!');
        console.log('\n📝 Database Schema:');
        console.log('   - users (id, name, email, password, created_at, updated_at)');
        console.log('   - trips (id, user_id, destination, start_date, end_date, budget, travel_type, notes, status, created_at, updated_at)');
        console.log('   - itinerary (id, trip_id, day_number, activity, time, location, created_at, updated_at)');
        console.log('   - expenses (id, trip_id, expense_name, amount, category, date, notes, created_at, updated_at)');
        console.log('\n✅ You can now start the server with: npm start');
        
    } catch (error) {
        console.error('❌ Database Initialization Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run initialization
initializeDatabase();
