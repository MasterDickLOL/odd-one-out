// script.js
const gameContainer = document.getElementById("game-container");
const scoreElement = document.getElementById("score");

let score = 0;
let gridSize = 3; // Start with a 3x3 grid
let colorDifference = 50; // Initial color difference
let countdown; // Interval for the timer
let timeLeft = 10; // Time limit for each round

// Generate a random color
function randomColor() {
  return Math.floor(Math.random() * 256);
}

// Start a new game
function generateGrid() {
  // Clear previous grid and reset timer
  gameContainer.innerHTML = "";
  resetTimer();

  // Set grid size and prevent overflow
  const maxGridSize = Math.min(window.innerWidth, window.innerHeight) * 0.8; // 80% of screen size
  const cellSize = Math.floor(maxGridSize / gridSize); // Calculate cell size
  gameContainer.style.width = `${gridSize * cellSize}px`;
  gameContainer.style.height = `${gridSize * cellSize}px`;
  gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
  gameContainer.style.gridTemplateRows = `repeat(${gridSize}, ${cellSize}px)`;

  // Random base color
  const baseRed = randomColor();
  const baseGreen = randomColor();
  const baseBlue = randomColor();

  // Slightly different color
  const diffRed = Math.min(255, baseRed + Math.floor(Math.random() * colorDifference));
  const diffGreen = Math.min(255, baseGreen + Math.floor(Math.random() * colorDifference));
  const diffBlue = Math.min(255, baseBlue + Math.floor(Math.random() * colorDifference));

  // Pick a random position for the odd one out
  const oddRow = Math.floor(Math.random() * gridSize);
  const oddCol = Math.floor(Math.random() * gridSize);

  // Create grid
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const circle = document.createElement("div");
      circle.style.width = `${cellSize * 0.8}px`;
      circle.style.height = `${cellSize * 0.8}px`;
      circle.style.borderRadius = "50%";
      circle.style.margin = "auto";

      // Set color
      if (row === oddRow && col === oddCol) {
        circle.style.backgroundColor = `rgb(${diffRed}, ${diffGreen}, ${diffBlue})`;
        circle.addEventListener("click", onCorrectClick);
      } else {
        circle.style.backgroundColor = `rgb(${baseRed}, ${baseGreen}, ${baseBlue})`;
        circle.addEventListener("click", onGameOver);
      }

      gameContainer.appendChild(circle);
    }
  }
}

// Handle correct circle click
function onCorrectClick() {
  score++;
  scoreElement.textContent = score;

  // Increase difficulty every 5 levels
  if (score % 5 === 0) {
    gridSize++;
    colorDifference = Math.max(10, colorDifference - 5); // Reduce color difference
  }

  generateGrid();
}

// Handle game over
function onGameOver() {
  clearInterval(countdown); // Stop the timer
  alert(`Game Over! Your score: ${score}`);
  resetGame();
}

// Start the timer
function startTimer() {
  const timerElement = document.createElement("div");
  timerElement.id = "timer";
  timerElement.style.position = "absolute";
  timerElement.style.top = "10px";
  timerElement.style.right = "10px";
  timerElement.style.fontSize = "20px";
  timerElement.style.color = "white";
  timerElement.textContent = `Time left: ${timeLeft}s`;
  document.body.appendChild(timerElement);

  countdown = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      document.body.removeChild(timerElement);
      onGameOver();
    }
  }, 1000);
}

// Reset timer
function resetTimer() {
  clearInterval(countdown); // Stop the previous timer
  const existingTimer = document.getElementById("timer");
  if (existingTimer) {
    document.body.removeChild(existingTimer); // Remove the old timer element
  }
  timeLeft = 10; // Reset time
  startTimer(); // Start a new timer
}

// Reset game
function resetGame() {
  score = 0;
  gridSize = 3;
  colorDifference = 50;
  scoreElement.textContent = score;
  generateGrid();
}

// Initialize game
generateGrid();