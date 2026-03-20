const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const dbPath = path.join(__dirname, "data", "snake.db");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Ensure data directory exists (Windows friendly)
const fs = require("fs");
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to open database", err);
    process.exit(1);
  }
});

// Create schema if missing
const schema = `
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
`;

db.exec(schema, (err) => {
  if (err) {
    console.error("Failed to ensure schema", err);
    process.exit(1);
  }
});

app.post("/api/score", (req, res) => {
  const { name, score } = req.body;
  if (!name || typeof score !== "number") {
    return res.status(400).json({ error: "Request must include 'name' and numeric 'score'" });
  }

  const sanitizedName = name.trim().slice(0, 40);
  const now = new Date().toISOString();

  db.serialize(() => {
    const insertPlayer = `
      INSERT INTO players (name, high_score, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(name) DO UPDATE SET
        high_score = CASE WHEN excluded.high_score > players.high_score THEN excluded.high_score ELSE players.high_score END,
        updated_at = CASE WHEN excluded.high_score > players.high_score THEN excluded.updated_at ELSE players.updated_at END;
    `;

    db.run(insertPlayer, [sanitizedName, score, now], function (err) {
      if (err) return res.status(500).json({ error: "Failed to write player record" });

      const getPlayerId = `SELECT id, high_score FROM players WHERE name = ?`;
      db.get(getPlayerId, [sanitizedName], (err, player) => {
        if (err || !player) return res.status(500).json({ error: "Could not find player" });

        const insertGame = `INSERT INTO games (player_id, score, played_at) VALUES (?, ?, ?)`;
        db.run(insertGame, [player.id, score, now], (err) => {
          if (err) return res.status(500).json({ error: "Failed to store game result" });

          return res.json({ player: sanitizedName, score, highScore: player.high_score });
        });
      });
    });
  });
});

app.get("/api/player/:name", (req, res) => {
  const name = String(req.params.name).trim();
  if (!name) return res.status(400).json({ error: "Missing player name" });

  const query = `SELECT name, high_score FROM players WHERE name = ?`;
  db.get(query, [name], (err, row) => {
    if (err) return res.status(500).json({ error: "Failed to query player" });
    if (!row) return res.status(404).json({ error: "Player not found" });

    res.json({ player: row.name, highScore: row.high_score });
  });
});

app.get("/api/leaderboard", (req, res) => {
  const query = `
    SELECT
      p.name AS player,
      p.high_score AS score,
      g.played_at
    FROM players p
    LEFT JOIN games g ON g.player_id = p.id AND g.score = p.high_score
    ORDER BY p.high_score DESC, g.played_at DESC
    LIMIT 10;
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to load leaderboard" });

    res.json(
      rows.map((row) => ({
        player: row.player,
        score: row.score,
        playedAt: row.played_at,
      }))
    );
  });
});

// Fallback to serve index.html for SPA-style routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Snake Game server started: http://localhost:${PORT}`);
});
