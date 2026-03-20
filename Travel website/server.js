const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change to your MySQL username
    password: '', // Change to your MySQL password
    database: 'travel_explorer'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API to get destinations
app.get('/api/destinations', (req, res) => {
    db.query('SELECT * FROM destinations', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// API to get packages
app.get('/api/packages', (req, res) => {
    db.query('SELECT * FROM packages', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Handle booking form
app.post('/booking', (req, res) => {
    const { name, email, destination, package, date, message } = req.body;
    const sql = 'INSERT INTO bookings (name, email, destination, package, date, message) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, email, destination, package, date, message], (err, result) => {
        if (err) throw err;
        res.send('Booking submitted successfully!');
    });
});

// Handle contact form
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    const sql = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
    db.query(sql, [name, email, message], (err, result) => {
        if (err) throw err;
        res.send('Message sent successfully!');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});