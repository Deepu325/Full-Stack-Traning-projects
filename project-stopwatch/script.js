// Stopwatch logic explained with comments for beginners.
//
// Core idea:
// - Keep track of elapsed time in seconds.
// - Use window.setInterval to update elapsed time every 1000ms (1 second).
// - Provide Start/Stop toggle and Reset functionality.
// - Format the time as HH:MM:SS for display.

(function () {
  // Get references to DOM elements
  const display = document.getElementById('display');
  const startStopBtn = document.getElementById('startStopBtn');
  const resetBtn = document.getElementById('resetBtn');

  // Stopwatch state
  let elapsedSeconds = 0;    // total elapsed time in seconds
  let intervalId = null;     // holds the setInterval id when running
  let running = false;       // is the stopwatch currently running?

  // Utility: format seconds to HH:MM:SS
  // Example: 3661 -> "01:01:01"
  function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Pad single-digit numbers with leading zero
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    return `${hh}:${mm}:${ss}`;
  }

  // Update the visual display based on elapsedSeconds
  function updateDisplay() {
    display.textContent = formatTime(elapsedSeconds);
  }

  // Start the stopwatch: schedule an interval that increments elapsedSeconds every second
  function start() {
    if (running) return; // guard: if already running, do nothing
    running = true;
    startStopBtn.textContent = 'Stop'; // update button label

    // Use setInterval to increment elapsedSeconds every 1000ms
    intervalId = setInterval(() => {
      elapsedSeconds += 1;
      updateDisplay();
    }, 1000);
  }

  // Stop/pause the stopwatch: clear the scheduled interval
  function stop() {
    if (!running) return; // guard: if already stopped, do nothing
    running = false;
    startStopBtn.textContent = 'Start';
    clearInterval(intervalId);
    intervalId = null;
  }

  // Reset the stopwatch back to zero and update UI
  function reset() {
    // If running, stop first
    if (running) {
      stop();
    }
    elapsedSeconds = 0;
    updateDisplay();
  }

  // Toggle start/stop when primary button is clicked
  startStopBtn.addEventListener('click', function () {
    if (!running) {
      start();
    } else {
      stop();
    }
  });

  // Reset when reset button is clicked
  resetBtn.addEventListener('click', function () {
    reset();
  });

  // Initialize display on page load
  updateDisplay();

  // Optional: keyboard shortcuts for convenience (Space = Start/Stop, R = Reset)
  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
      e.preventDefault(); // avoid page scroll
      startStopBtn.click();
    } else if (e.key.toLowerCase() === 'r') {
      resetBtn.click();
    }
  });
})();
