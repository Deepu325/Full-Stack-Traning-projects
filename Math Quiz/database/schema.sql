-- =============================================
-- MATH PUZZLE QUIZ - Complete Database Schema
-- =============================================

-- Create database
CREATE DATABASE IF NOT EXISTS math_quiz;
USE math_quiz;

-- =============================================
-- USERS TABLE
-- =============================================
-- Stores user account information
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
-- Quiz categories/topics
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- =============================================
-- QUESTIONS TABLE
-- =============================================
-- Quiz questions with multiple choice options
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    question_text TEXT NOT NULL,
    options JSON NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    explanation TEXT,
    time_limit INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_difficulty (difficulty)
);

-- =============================================
-- SCORES TABLE
-- =============================================
-- User quiz attempt records
CREATE TABLE scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    score INT NOT NULL DEFAULT 0,
    time_taken INT DEFAULT 0,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_question (question_id),
    INDEX idx_date (answered_at)
);

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Insert Categories
INSERT INTO categories (name, description) VALUES
('Arithmetic', 'Basic arithmetic operations including addition, subtraction, multiplication, and division'),
('Logical Reasoning', 'Problems requiring logical thinking and reasoning abilities'),
('Number Patterns', 'Identify and complete number sequences and patterns'),
('Time Challenges', 'Quick math problems to be solved within time limits');

-- =============================================
-- ARITHMETIC QUESTIONS
-- =============================================

-- Easy Arithmetic Questions
INSERT INTO questions (category_id, question_text, options, correct_answer, difficulty, explanation, time_limit) VALUES
(1, 'What is 15 + 23?', '["36", "38", "40", "42"]', '38', 'Easy', 'Simply add 15 + 23 = 38', 30),
(1, 'What is 50 - 17?', '["33", "32", "35", "34"]', '33', 'Easy', '50 - 17 = 33', 30),
(1, 'What is 8 × 6?', '["44", "48", "52", "45"]', '48', 'Easy', '8 multiplied by 6 equals 48', 30),
(1, 'What is 144 ÷ 12?', '["11", "12", "13", "14"]', '12', 'Easy', '144 divided by 12 equals 12', 30),
(1, 'What is 9 + 11 + 5?', '["24", "25", "26", "27"]', '25', 'Easy', 'Adding all three numbers: 9 + 11 + 5 = 25', 30),

-- Medium Arithmetic Questions
INSERT INTO questions (category_id, question_text, options, correct_answer, difficulty, explanation, time_limit) VALUES
(1, 'What is 23 × 15?', '["335", "340", "345", "350"]', '345', 'Medium', '23 × 15 = 345. You can calculate as (20×15) + (3×15) = 300 + 45 = 345', 40),
(1, 'If a number is multiplied by 3 and then 5 is added, the result is 26. What is the number?', '["5", "6", "7", "8"]', '7', 'Medium', 'Let x be the number. 3x + 5 = 26, so 3x = 21, therefore x = 7', 45),
(1, 'What is 15% of 200?', '["20", "25", "30", "35"]', '30', 'Medium', '15% of 200 = (15/100) × 200 = 30', 40),
(1, 'What is 456 ÷ 8?', '["56", "57", "58", "59"]', '57', 'Medium', '456 ÷ 8 = 57', 40),
(1, 'If 2x - 5 = 15, what is x?', '["8", "9", "10", "11"]', '10', 'Medium', '2x - 5 = 15, so 2x = 20, therefore x = 10', 45),

-- Hard Arithmetic Questions
INSERT INTO questions (category_id, question_text, options, correct_answer, difficulty, explanation, time_limit) VALUES
(1, 'What is 128 × 125 ÷ 100?', '["160", "165", "170", "175"]', '160', 'Hard', 'First multiply 128 × 125 = 16000, then divide by 100 = 160', 50),
(1, 'The sum of three consecutive numbers is 54. What is the largest number?', '["17", "18", "19", "20"]', '19', 'Hard', 'Let the numbers be x, x+1, x+2. Sum = 3x + 3 = 54, so x = 17. Largest is 19', 50),
(1, 'What is the square root of 144?', '["10", "11", "12", "13"]', '12', 'Hard', '12 × 12 = 144, so √144 = 12', 45),
(1, 'If a product costs 250 and there is 20% discount, what is the final price?', '["180", "190", "200", "210"]', '200', 'Hard', '20% of 250 = 50. Final price = 250 - 50 = 200', 50),
(1, 'What is (5 + 3)² - 4?', '["60", "64", "68", "72"]', '60', 'Hard', '(5+3)² - 4 = 8² - 4 = 64 - 4 = 60', 50),

-- =============================================
-- LOGICAL REASONING QUESTIONS
-- =============================================

-- Easy Logical Reasoning
INSERT INTO questions (category_id, question_text, options, correct_answer, difficulty, explanation, time_limit) VALUES
(2, 'If all cats are animals and all animals are living things, then all cats are what?', '["living things", "pets", "mammals", "furry"]', 'living things', 'Easy', 'By the logic of categories: cats → animals → living things', 30),
(2, 'Which number comes next: 2, 4, 6, 8, ?', '["9", "10", "11", "12"]', '10', 'Easy', 'This is a sequence of even numbers increasing by 2 each time', 30),
(2, 'If A is taller than B, and B is taller than C, then A is what compared to C?', '["taller", "shorter", "equal", "unknown"]', 'taller', 'Easy', 'Transitive property: A > B and B > C means A > C', 30),
(2, 'What comes next in the sequence: A, B, C, D, ?', '["E", "F", "G", "H"]', 'E', 'Easy', 'Alphabetical sequence', 30),
(2, 'If John is Sam\'s father, and Sam is Maya\'s mother, what is John to Maya?', '["father", "grandfather", "uncle", "brother"]', 'grandfather', 'Easy', 'Family relationships: John is father of Sam, Sam is mother of Maya, so John is grandfather of Maya', 30),

-- Medium Logical Reasoning
INSERT INTO questions (category_id, question_text, options, correct_answer, difficulty, explanation, time_limit) VALUES
(2, 'If 3 people can paint a house in 4 days, how many people are needed to paint it in 2 days?', '["4", "5", "6", "7"]', '6', 'Medium', 'Total work = 3 × 4 = 12 person-days. For 2 days: 12 ÷ 2 = 6 people', 40),
(2, 'Which number does not belong: 2, 3, 5, 7, 11, 15', '["15", "11", "7", "5"]', '15', 'Medium', 'All except 15 are prime numbers. 15 = 3 × 5', 45),
(2, 'If BOOK is coded as 2-15-15-11, then CAT would be coded as?', '["3-1-20", "2-1-19", "3-1-19", "2-1-20"]', '3-1-20', 'Medium', 'Using position in alphabet: C=3, A=1, T=20', 45),
(2, 'A man walks 5 km north, then 3 km west, then 5 km south. How far is he from his starting point?', '["3 km", "8 km", "13 km", "5 km"]', '3 km', 'Medium', 'He ends up 3 km west of his starting point', 45),
(2, 'If the day before yesterday was Saturday, what is tomorrow?', '["Tuesday", "Wednesday", "Thursday", "Friday"]', 'Tuesday', 'Medium', 'Day before yesterday = Saturday, so yesterday = Sunday, today = Monday, tomorrow = Tuesday', 50),

-- Hard Logical Reasoning
INSERT INTO questions (category_id, question_text, options, correct_answer, difficulty, explanation, time_limit) VALUES
(2, 'In a race, A finishes before B, B finishes before C. If D finishes before A, what is the order?', '["A-B-C-D", "D-A-B-C", "B-D-A-C", "C-B-D-A"]', 'D-A-B-C', 'Hard', 'D < A (D before A), A < B, B < C, so D-A-B-C', 50),
(2, 'If all roses are flowers and some flowers are red, then which statement is true?', '["All roses are red", "Some roses are red", "No roses are red", "Cannot be determined"]', 'Cannot be determined', 'Hard', 'Just because some flowers are red doesn\'t mean all roses are red', 50),
(2, 'Three boxes contain gold, silver, or pearl. Box A says "I contain silver", Box B says "I don\'t contain gold", Box C says "I contain pearl". Exactly one statement is true. Which box contains gold?', '["A", "B", "C", "None"]', 'B', 'Hard', 'If B is true, then B doesn\'t have gold (could be silver). A would be false (no silver), C false (no pearl). This works with B having silver.', 55),
(2, 'If MATHEMATICS is coded as 78910111213111415121619, what is the code for STUDENT?', '["192021202223242526", "19151208140419152612", "19-20-21-4-5-14-20", "191320091204"]', '19151208140419152612', 'Hard', 'Each letter is replaced by its position in alphabet', 55),
(2, 'A is twice B, B is half of C, C is 3/4 of D. If D is 40, what is A?', '["15", "20", "30", "25"]', '30', 'Hard', 'D=40, C=(3/4)×40=30, B=30/2=15, A=2×15=30', 55),

-- =============================================
-- NUMBER PATTERNS QUESTIONS
-- =============================================

-- Easy Patterns
INSERT INTO questions (category_id, question_text, options, correct_answer, difficulty, explanation, time_limit) VALUES
(3, 'What comes next: 1, 2, 3, 4, ?', '["5", "6", "7", "8"]', '5', 'Easy', 'Simple sequence increasing by 1 each time', 30),
(3, 'What comes next: 2, 4, 6, 8, ?', '["9", "10", "12", "14"]', '10', 'Easy', 'Even numbers increasing by 2 each time', 30),
(3, 'What comes next: 1, 1, 2, 3, 5, ?', '["8", "9", "10", "12"]', '8', 'Easy', 'Fibonacci sequence: each number is sum of previous two', 30),
(3, 'What comes next: 10, 9, 8, 7, ?', '["5", "6", "7", "8"]', '6', 'Easy', 'Decreasing sequence by 1 each time', 30),
(3, 'What comes next: 1, 4, 9, 16, ?', '["25", "26", "27", "28"]', '25', 'Easy', 'Perfect squares: 1², 2², 3², 4², 5²', 30),

-- Medium Patterns
INSERT INTO questions (category_id, question_text, options, correct_answer, difficulty, explanation, time_limit) VALUES
(3, 'What comes next: 1, 4, 7, 10, 13, ?', '["16", "17", "18", "19"]', '16', 'Medium', 'Arithmetic sequence with common difference of 3', 40),
(3, 'What comes next: 1, 2, 4, 8, 16, ?', '["24", "30", "32", "36"]', '32', 'Medium', 'Geometric sequence where each term is doubled', 40),
(3, 'What comes next: 2, 5, 10, 17, 26, ?', '["35", "36", "37", "38"]', '37', 'Medium', 'Differences are: 3, 5, 7, 9... so next difference is 11, making answer 37', 45),
(3, 'What comes next: 1, 3, 6, 10, 15, ?', '["20", "21", "22", "24"]', '21', 'Medium', 'Triangular numbers: 1, 1+2=3, 1+2+3=6, 1+2+3+4=10, etc.', 45),
(3, 'What comes next: 5, 10, 20, 40, ?', '["80", "85", "90", "95"]', '80', 'Medium', 'Each term is doubled (geometric sequence with ratio 2)', 40),

-- Hard Patterns
INSERT INTO questions (category_id, question_text, options, correct_answer, difficulty, explanation, time_limit) VALUES
(3, 'What comes next: 2, 3, 5, 7, 11, 13, ?', '["15", "17", "19", "21"]', '17', 'Hard', 'Prime numbers sequence', 50),
(3, 'What comes next: 1, 1, 2, 3, 5, 8, 13, ?', '["19", "20", "21", "22"]', '21', 'Hard', 'Fibonacci sequence: 13 + 8 = 21', 50),
(3, 'What comes next: 1, 4, 9, 16, 25, 36, ?', '["48", "49", "50", "51"]', '49', 'Hard', 'Perfect squares: 1², 2², 3², 4², 5², 6², 7²', 50),
(3, 'What comes next: 1, 3, 7, 15, 31, ?', '["61", "62", "63", "64"]', '63', 'Hard', 'Pattern: each number is 2^n - 1. Next is 2^6 - 1 = 63', 55),
(3, 'What comes next: 2, 6, 12, 20, 30, ?', '["40", "41", "42", "43"]', '42', 'Hard', 'Pattern: n(n+1) where n = 1,2,3,4,5,6. So 6×7 = 42', 55),

-- =============================================
-- TIME CHALLENGES (Quick Problems)
-- =============================================

-- Easy Time Challenges
INSERT INTO questions (category_id, question_text, options, correct_answer, difficulty, explanation, time_limit) VALUES
(4, 'Quick: 7 + 3 = ?', '["9", "10", "11", "12"]', '10', 'Easy', 'Basic addition: 7 + 3 = 10', 20),
(4, 'Quick: 20 - 8 = ?', '["10", "11", "12", "13"]', '12', 'Easy', 'Basic subtraction: 20 - 8 = 12', 20),
(4, 'Quick: 6 × 4 = ?', '["20", "24", "28", "32"]', '24', 'Easy', 'Basic multiplication: 6 × 4 = 24', 20),
(4, 'Quick: 30 ÷ 5 = ?', '["5", "6", "7", "8"]', '6', 'Easy', 'Basic division: 30 ÷ 5 = 6', 20),
(4, 'Quick: 9 + 11 + 10 = ?', '["28", "29", "30", "31"]', '30', 'Easy', 'Adding three numbers: 9 + 11 + 10 = 30', 20),

-- Medium Time Challenges
INSERT INTO questions (category_id, question_text, options, correct_answer, difficulty, explanation, time_limit) VALUES
(4, 'Quick: 45 ÷ 9 + 5 = ?', '["10", "11", "12", "13"]', '10', 'Medium', 'Division first: 45 ÷ 9 = 5, then 5 + 5 = 10', 25),
(4, 'Quick: 8 × 7 - 14 = ?', '["34", "42", "50", "56"]', '42', 'Medium', 'Multiplication first: 8 × 7 = 56, then 56 - 14 = 42', 25),
(4, 'Quick: 25% of 80 = ?', '["15", "20", "25", "30"]', '20', 'Medium', '25% of 80 = (25/100) × 80 = 20', 25),
(4, 'Quick: 12² + 5 = ?', '["144", "149", "154", "159"]', '149', 'Medium', '12² = 144, then 144 + 5 = 149', 25),
(4, 'Quick: 100 - 23 - 17 = ?', '["50", "55", "60", "65"]', '60', 'Medium', '100 - 23 = 77, then 77 - 17 = 60', 25),

-- Hard Time Challenges
INSERT INTO questions (category_id, question_text, options, correct_answer, difficulty, explanation, time_limit) VALUES
(4, 'Quick: (9 + 3) × 2 - 8 = ?', '["16", "20", "24", "28"]', '16', 'Hard', 'Parentheses first: (9+3) = 12, then 12 × 2 = 24, then 24 - 8 = 16', 30),
(4, 'Quick: 176 ÷ 8 + 5 = ?', '["27", "28", "29", "30"]', '27', 'Hard', '176 ÷ 8 = 22, then 22 + 5 = 27', 30),
(4, 'Quick: What is 15% of 200 + 50? ', '["80", "100", "130", "150"]', '80', 'Hard', '15% of 200 = 30, then 30 + 50 = 80', 30),
(4, 'Quick: (7 × 8) - (6 × 5) = ?', '["26", "30", "34", "38"]', '26', 'Hard', '7 × 8 = 56, 6 × 5 = 30, then 56 - 30 = 26', 30),
(4, 'Quick: 2³ + 3² + 4 = ?', '["17", "21", "25", "28"]', '21', 'Hard', '2³ = 8, 3² = 9, so 8 + 9 + 4 = 21', 30);

-- =============================================
-- VIEWS FOR ANALYTICS
-- =============================================

-- User Performance View
CREATE VIEW user_performance AS
SELECT 
    u.id,
    u.username,
    COUNT(DISTINCT s.id) as total_attempts,
    SUM(CASE WHEN s.score > 0 THEN 1 ELSE 0 END) as correct_answers,
    SUM(s.score) as total_score,
    ROUND(AVG(s.score), 2) as avg_score,
    SUM(s.time_taken) as total_time
FROM users u
LEFT JOIN scores s ON u.id = s.user_id
GROUP BY u.id, u.username;

-- Category Performance View
CREATE VIEW category_performance AS
SELECT 
    c.name as category,
    COUNT(s.id) as total_attempts,
    SUM(CASE WHEN s.score > 0 THEN 1 ELSE 0 END) as correct_answers,
    ROUND(AVG(s.score), 2) as avg_score,
    AVG(s.time_taken) as avg_time
FROM categories c
LEFT JOIN questions q ON c.id = q.category_id
LEFT JOIN scores s ON q.id = s.question_id
GROUP BY c.id, c.name;

-- Leaderboard View
CREATE VIEW leaderboard AS
SELECT 
    u.username,
    COUNT(s.id) as questions_attempted,
    SUM(CASE WHEN s.score > 0 THEN 1 ELSE 0 END) as correct_answers,
    SUM(s.score) as total_score,
    ROUND(AVG(s.score), 2) as avg_score,
    MAX(s.answered_at) as last_quiz_date
FROM users u
LEFT JOIN scores s ON u.id = s.user_id
GROUP BY u.id, u.username
ORDER BY total_score DESC, questions_attempted DESC;