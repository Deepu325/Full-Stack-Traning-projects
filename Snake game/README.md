# Snake Game (Web + SQL Leaderboard)

A beginner-friendly web game built using **HTML/CSS/JavaScript** on the frontend and **Node.js + SQLite** for persisting scores and maintaining a leaderboard.

## 🚀 Features

- Fully playable Snake game in the browser
- Score tracking and high score persistence
- Backend API storing results in a SQLite database
- Top 10 leaderboard display
- Restart after game over

---

## 🧱 Project Structure

- `index.html` — UI layout
- `styles.css` — Styling and responsive layout
- `script.js` — Game logic, scoring, and API interaction
- `server.js` — Node.js + Express server with SQLite persistence
- `data/snake.db` — SQLite database (auto-generated)

---

## ✅ Setup & Run

### 1) Install dependencies

```bash
npm install
```

### 2) Start the server

```bash
npm start
```

Then open `http://localhost:3000` in your browser.

### 3) Play

- Use arrow keys or WASD to move the snake
- Eat food to grow and score points
- Save your score on game over to update the leaderboard

---

## 🧠 Database Schema (SQLite)

### `players`

- `id` INTEGER PRIMARY KEY
- `name` TEXT UNIQUE
- `high_score` INTEGER
- `updated_at` DATETIME

### `games`

- `id` INTEGER PRIMARY KEY
- `player_id` INTEGER (FK to players)
- `score` INTEGER
- `played_at` DATETIME

---

## 🔍 SQL Queries (Examples)

### Create schema

```sql
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  high_score INTEGER NOT NULL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id)
);
```

### Insert a score (upsert player + record game)

```sql
INSERT INTO players (name, high_score, updated_at)
VALUES (?, ?, CURRENT_TIMESTAMP)
ON CONFLICT(name) DO UPDATE SET
  high_score = CASE WHEN excluded.high_score > players.high_score THEN excluded.high_score ELSE players.high_score END,
  updated_at = CASE WHEN excluded.high_score > players.high_score THEN excluded.updated_at ELSE players.updated_at END;

INSERT INTO games (player_id, score) VALUES (?, ?);
```

### Leaderboard

```sql
SELECT p.name AS player, p.high_score AS score, g.played_at
FROM players p
LEFT JOIN games g ON g.player_id = p.id AND g.score = p.high_score
ORDER BY p.high_score DESC, g.played_at DESC
LIMIT 10;
```

---

## 📝 Notes

- Your scores are stored in `data/snake.db`.
- When running locally, if you want to reset the leaderboard, delete `data/snake.db` and restart the server.

---

Have fun building and extending the game! 🎮
