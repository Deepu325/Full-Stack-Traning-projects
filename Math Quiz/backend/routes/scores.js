const express = require('express');
const router = express.Router();

// Submit score
router.post('/', (req, res) => {
  const { userId, questionId, score, timeTaken } = req.body;

  // Validation
  if (!userId || !questionId || score === undefined || timeTaken === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO scores (user_id, question_id, score, time_taken) VALUES (?, ?, ?, ?)';
  
  global.db.query(query, [userId, questionId, score, timeTaken], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ 
      id: result.insertId,
      message: 'Score recorded successfully'
    });
  });
});

// Get user scores
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const query = `SELECT s.*, q.question_text, q.difficulty, c.name as category_name 
                 FROM scores s 
                 JOIN questions q ON s.question_id = q.id
                 JOIN categories c ON q.category_id = c.id
                 WHERE s.user_id = ? 
                 ORDER BY s.answered_at DESC`;

  global.db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get leaderboard
router.get('/leaderboard', (req, res) => {
  const query = `SELECT u.id, u.username, COUNT(s.id) as questions_attempted, 
                 SUM(s.score) as total_score, AVG(s.score) as avg_score,
                 MAX(s.answered_at) as last_quiz_date
                 FROM users u
                 LEFT JOIN scores s ON u.id = s.user_id
                 GROUP BY u.id, u.username
                 ORDER BY total_score DESC, questions_attempted DESC
                 LIMIT 50`;

  global.db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get user statistics
router.get('/stats/:userId', (req, res) => {
  const { userId } = req.params;
  const query = `SELECT 
                 COUNT(*) as total_questions,
                 SUM(CASE WHEN score > 0 THEN 1 ELSE 0 END) as correct_answers,
                 AVG(score) as avg_score,
                 SUM(score) as total_score,
                 SUM(time_taken) as total_time
                 FROM scores
                 WHERE user_id = ?`;

  global.db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    const stats = results[0] || {
      total_questions: 0,
      correct_answers: 0,
      avg_score: 0,
      total_score: 0,
      total_time: 0
    };
    
    res.json(stats);
  });
});

module.exports = router;