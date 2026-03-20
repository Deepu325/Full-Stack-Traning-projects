/*
  Simple Snake game with leaderboard integration.
  Uses a canvas grid (21x21) and a backend API for score persistence.
*/

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const playerNameInput = document.getElementById("playerName");
const scoreValueEl = document.getElementById("scoreValue");
const highScoreValueEl = document.getElementById("highScoreValue");
const leaderboardBody = document.getElementById("leaderboardBody");

const modal = document.getElementById("gameOverModal");
const finalScoreEl = document.getElementById("finalScore");
const modalMessage = document.getElementById("modalMessage");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

const GRID_SIZE = 21;
const CELL_SIZE = canvas.width / GRID_SIZE;

let snake;
let direction;
let nextDirection;
let food;
let running;
let score;
let highScore = 0;

const API_BASE = "/api";

function createInitialGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];

  direction = { x: 1, y: 0 };
  nextDirection = direction;
  score = 0;
  running = true;

  spawnFood();
  updateScoreUI();
  clearCanvas();
  draw();
}

function clearCanvas() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.23)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let loopTimer = null;

function draw() {
  if (!running) return;

  // Use a single timeout loop to make pausing / restart simpler.
  loopTimer = setTimeout(gameLoop, 100);
}

function gameLoop() {
  if (!running) return;

  update();
  render();

  const speed = 100 - Math.min(65, score * 2); // speed up as the score grows
  loopTimer = setTimeout(gameLoop, speed);
}

function update() {
  direction = nextDirection;

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (isCollision(head)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    spawnFood();
    updateScoreUI();
  } else {
    snake.pop();
  }
}

function render() {
  clearCanvas();
  drawGrid();
  drawFood();
  drawSnake();
}

function drawGrid() {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_SIZE; i++) {
    const offset = i * CELL_SIZE;
    ctx.beginPath();
    ctx.moveTo(offset, 0);
    ctx.lineTo(offset, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, offset);
    ctx.lineTo(canvas.width, offset);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#6effa2" : "#3cffe0";
    ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
  });
}

function drawFood() {
  ctx.fillStyle = "#ff8f4c";
  ctx.beginPath();
  ctx.arc(
    food.x * CELL_SIZE + CELL_SIZE / 2,
    food.y * CELL_SIZE + CELL_SIZE / 2,
    CELL_SIZE * 0.4,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function spawnFood() {
  const openCells = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      const isOccupied = snake.some((segment) => segment.x === x && segment.y === y);
      if (!isOccupied) openCells.push({ x, y });
    }
  }

  if (openCells.length === 0) {
    // full board - player wins
    endGame();
    return;
  }

  food = openCells[Math.floor(Math.random() * openCells.length)];
}

function isCollision(point) {
  const hitWall = point.x < 0 || point.x >= GRID_SIZE || point.y < 0 || point.y >= GRID_SIZE;
  const hitSelf = snake.some((segment) => segment.x === point.x && segment.y === point.y);
  return hitWall || hitSelf;
}

function setDirection(event) {
  const key = event.key.toLowerCase();
  const mapping = {
    arrowup: { x: 0, y: -1 },
    arrowdown: { x: 0, y: 1 },
    arrowleft: { x: -1, y: 0 },
    arrowright: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    d: { x: 1, y: 0 },
  };

  if (!mapping[key]) return;
  const next = mapping[key];

  // Prevent reversing direction directly
  if (next.x === -direction.x && next.y === -direction.y) return;
  nextDirection = next;
}

function updateScoreUI() {
  scoreValueEl.textContent = score;
  highScoreValueEl.textContent = highScore;
}

function endGame() {
  running = false;
  clearTimeout(loopTimer);
  loopTimer = null;

  finalScoreEl.textContent = score;
  modalMessage.textContent = "Enter your name and save your score to the leaderboard.";
  openModal();
}

function openModal() {
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
}

function resetGame() {
  clearTimeout(loopTimer);
  loopTimer = null;
  createInitialGame();
}

async function loadHighScore() {
  const name = getStoredName();
  if (!name) return;

  try {
    const response = await fetch(`${API_BASE}/player/${encodeURIComponent(name)}`);
    if (!response.ok) return;

    const json = await response.json();
    highScore = json.highScore || 0;
    highScoreValueEl.textContent = highScore;
  } catch (err) {
    // no-op: network may not be available while developing
  }
}

async function fetchLeaderboard() {
  leaderboardBody.innerHTML = '<tr><td colspan="4" class="loading">Loading...</td></tr>';
  try {
    const response = await fetch(`${API_BASE}/leaderboard`);
    if (!response.ok) throw new Error("Failed to fetch leaderboard");
    const data = await response.json();

    if (!data || !data.length) {
      leaderboardBody.innerHTML = '<tr><td colspan="4" class="loading">No scores yet. Play to be the first!</td></tr>';
      return;
    }

    leaderboardBody.innerHTML = data
      .map((row, index) => {
        const playedAt = new Date(row.playedAt).toLocaleString();
        return `<tr><td>${index + 1}</td><td>${escapeHtml(row.player)}</td><td>${row.score}</td><td>${playedAt}</td></tr>`;
      })
      .join("");
  } catch (err) {
    leaderboardBody.innerHTML = '<tr><td colspan="4" class="loading">Unable to fetch leaderboard.</td></tr>';
  }
}

function escapeHtml(text) {
  return text.replace(/["&'<>]/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char] || char;
  });
}

function getStoredName() {
  return localStorage.getItem("snakePlayerName") || "";
}

function storeName(name) {
  localStorage.setItem("snakePlayerName", name);
}

async function submitScore() {
  const name = (playerNameInput.value || getStoredName()).trim();
  if (!name) {
    modalMessage.textContent = "Please enter a player name before saving your score.";
    return;
  }

  storeName(name);

  const payload = {
    name,
    score,
  };

  saveScoreBtn.disabled = true;
  saveScoreBtn.textContent = "Saving...";

  try {
    const response = await fetch(`${API_BASE}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to save score");

    const result = await response.json();

    highScore = result.highScore;
    highScoreValueEl.textContent = highScore;
    modalMessage.textContent = "Score saved! Check the leaderboard below.",
      await fetchLeaderboard();
  } catch (err) {
    modalMessage.textContent = "Unable to save score. Try again when the server is running.";
  }

  saveScoreBtn.disabled = false;
  saveScoreBtn.textContent = "Save Score";
}

function init() {
  const savedName = getStoredName();
  playerNameInput.value = savedName;

  startBtn.addEventListener("click", () => {
    closeModal();
    resetGame();
  });

  window.addEventListener("keydown", setDirection);
  saveScoreBtn.addEventListener("click", submitScore);
  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  loadHighScore();
  fetchLeaderboard();
  createInitialGame();
}

init();
