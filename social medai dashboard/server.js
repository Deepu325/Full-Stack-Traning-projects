const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database connection
const db = new sqlite3.Database('./database/social_dashboard.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database with tables and sample data
function initializeDatabase() {
    db.serialize(() => {
        // Create tables
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            full_name VARCHAR(100),
            avatar VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS social_accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            platform VARCHAR(50) NOT NULL,
            account_name VARCHAR(100) NOT NULL,
            followers INTEGER DEFAULT 0,
            following INTEGER DEFAULT 0,
            posts_count INTEGER DEFAULT 0,
            status VARCHAR(20) DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            account_id INTEGER,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            platform VARCHAR(50) NOT NULL,
            likes INTEGER DEFAULT 0,
            comments INTEGER DEFAULT 0,
            shares INTEGER DEFAULT 0,
            status VARCHAR(20) DEFAULT 'published',
            scheduled_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (account_id) REFERENCES social_accounts (id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS activity_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            action VARCHAR(100) NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        // Insert default data
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        db.run(`INSERT OR IGNORE INTO users (username, email, password, full_name) 
                VALUES ('admin', 'admin@example.com', ?, 'Admin User')`, [hashedPassword]);

        db.run(`INSERT OR IGNORE INTO social_accounts (user_id, platform, account_name, followers, following, posts_count) 
                VALUES (1, 'Instagram', '@myinstagram', 15420, 892, 156)`);
        db.run(`INSERT OR IGNORE INTO social_accounts (user_id, platform, account_name, followers, following, posts_count) 
                VALUES (1, 'Facebook', 'My Facebook Page', 8930, 245, 89)`);
        db.run(`INSERT OR IGNORE INTO social_accounts (user_id, platform, account_name, followers, following, posts_count) 
                VALUES (1, 'Twitter', '@mytwitter', 5670, 1200, 234)`);

        db.run(`INSERT OR IGNORE INTO posts (user_id, account_id, title, content, platform, likes, comments, shares) 
                VALUES (1, 1, 'Summer Vibes', 'Enjoying the beautiful sunset at the beach! #summer #sunset', 'Instagram', 245, 18, 12)`);
        db.run(`INSERT OR IGNORE INTO posts (user_id, account_id, title, content, platform, likes, comments, shares) 
                VALUES (1, 2, 'New Product Launch', 'Excited to announce our new product line!', 'Facebook', 89, 25, 8)`);
        db.run(`INSERT OR IGNORE INTO posts (user_id, account_id, title, content, platform, likes, comments, shares) 
                VALUES (1, 3, 'Tech Tips', 'Here are 5 productivity tips for developers', 'Twitter', 156, 34, 22)`);
    });
}

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Auth routes
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
            res.json({ token, user: { id: user.id, username: user.username, email: user.email, full_name: user.full_name } });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

app.post('/api/register', (req, res) => {
    const { username, email, password, full_name } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    db.run('INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)', 
           [username, email, hashedPassword, full_name], function(err) {
        if (err) return res.status(400).json({ error: 'User already exists' });
        
        const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET);
        res.json({ token, user: { id: this.lastID, username, email, full_name } });
    });
});

// Dashboard routes
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
    const userId = req.user.id;
    
    db.all(`SELECT 
                COUNT(DISTINCT sa.id) as total_accounts,
                COUNT(DISTINCT p.id) as total_posts,
                SUM(sa.followers) as total_followers,
                SUM(p.likes) as total_likes
            FROM social_accounts sa 
            LEFT JOIN posts p ON sa.id = p.account_id 
            WHERE sa.user_id = ?`, [userId], (err, stats) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(stats[0]);
    });
});

// Social accounts routes
app.get('/api/accounts', authenticateToken, (req, res) => {
    db.all('SELECT * FROM social_accounts WHERE user_id = ?', [req.user.id], (err, accounts) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(accounts);
    });
});

app.post('/api/accounts', authenticateToken, (req, res) => {
    const { platform, account_name, followers, following } = req.body;
    
    db.run('INSERT INTO social_accounts (user_id, platform, account_name, followers, following) VALUES (?, ?, ?, ?, ?)',
           [req.user.id, platform, account_name, followers || 0, following || 0], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ id: this.lastID, message: 'Account added successfully' });
    });
});

app.delete('/api/accounts/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM social_accounts WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Account deleted successfully' });
    });
});

// Posts routes
app.get('/api/posts', authenticateToken, (req, res) => {
    db.all(`SELECT p.*, sa.platform, sa.account_name 
            FROM posts p 
            JOIN social_accounts sa ON p.account_id = sa.id 
            WHERE p.user_id = ? 
            ORDER BY p.created_at DESC`, [req.user.id], (err, posts) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(posts);
    });
});

app.post('/api/posts', authenticateToken, (req, res) => {
    const { account_id, title, content, platform } = req.body;
    
    db.run('INSERT INTO posts (user_id, account_id, title, content, platform) VALUES (?, ?, ?, ?, ?)',
           [req.user.id, account_id, title, content, platform], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ id: this.lastID, message: 'Post created successfully' });
    });
});

app.delete('/api/posts/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM posts WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Post deleted successfully' });
    });
});

// Analytics routes
app.get('/api/analytics/engagement', authenticateToken, (req, res) => {
    db.all(`SELECT platform, SUM(likes) as likes, SUM(comments) as comments, SUM(shares) as shares
            FROM posts p
            JOIN social_accounts sa ON p.account_id = sa.id
            WHERE p.user_id = ?
            GROUP BY platform`, [req.user.id], (err, data) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(data);
    });
});

app.get('/api/analytics/growth', authenticateToken, (req, res) => {
    db.all(`SELECT platform, followers
            FROM social_accounts
            WHERE user_id = ?`, [req.user.id], (err, data) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(data);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});