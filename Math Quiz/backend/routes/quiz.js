const express = require('express');
const router = express.Router();

// Get all categories
router.get('/categories', (req, res) => {
  const query = 'SELECT * FROM categories';
  
  global.db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get questions by category and difficulty
router.get('/questions', (req, res) => {
  const { categoryId, difficulty, count = 5 } = req.query;

  // Validation
  if (!categoryId || !difficulty) {
    return res.status(400).json({ error: 'categoryId and difficulty are required' });
  }

  const query = `SELECT id, category_id, question_text, options, correct_answer, difficulty, 
                 explanation, time_limit FROM questions 
                 WHERE category_id = ? AND difficulty = ? 
                 ORDER BY RAND() LIMIT ?`;
  
  global.db.query(query, [categoryId, difficulty, parseInt(count) || 5], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'No questions found' });
    }
    
    res.json(results);
  });
});

// Get single question by ID
router.get('/question/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM questions WHERE id = ?';
  
  global.db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(results[0]);
  });
});

// Validate answer
router.post('/validate-answer', (req, res) => {
  const { questionId, userAnswer } = req.body;

  if (!questionId || !userAnswer) {
    return res.status(400).json({ error: 'questionId and userAnswer are required' });
  }

  const query = 'SELECT correct_answer, explanation FROM questions WHERE id = ?';
  
  global.db.query(query, [questionId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const question = results[0];
    const isCorrect = userAnswer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase();

    res.json({
      isCorrect,
      correctAnswer: question.correct_answer,
      explanation: question.explanation,
      score: isCorrect ? 10 : 0
    });
  });
});

module.exports = router;