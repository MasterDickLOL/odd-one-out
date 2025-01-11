// script.js
const gameContainer = document.getElementById("game-container");
const scoreElement = document.getElementById("score");

let score = 0;
if (!localStorage.getItem("highScore")) {
    localStorage.setItem("highScore", 0);
}
let highScore = localStorage.getItem("highScore");
let gridSize = 3;
let colorDifference = 50;
let countdown;
let timeLeft = 10;

// Display high score on the page
const highScoreElement = document.createElement("div");
highScoreElement.style.position = "absolute";
highScoreElement.style.top = "40px";
highScoreElement.style.right = "10px";
highScoreElement.style.fontSize = "20px";
highScoreElement.style.color = "white";
highScoreElement.textContent = `High Score: ${highScore}`;
document.body.appendChild(highScoreElement);

function randomColor() {
  return Math.floor(Math.random() * 256);
}

function generateGrid() {
  gameContainer.innerHTML = "";
  resetTimer();

  const maxGridSize = Math.min(window.innerWidth, window.innerHeight) * 0.8;
  const cellSize = Math.floor(maxGridSize / gridSize);
  gameContainer.style.width = `${gridSize * cellSize}px`;
  gameContainer.style.height = `${gridSize * cellSize}px`;
  gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
  gameContainer.style.gridTemplateRows = `repeat(${gridSize}, ${cellSize}px)`;

  const baseRed = randomColor();
  const baseGreen = randomColor();
  const baseBlue = randomColor();

  const diffRed = Math.min(255, baseRed + Math.floor(Math.random() * colorDifference));
  const diffGreen = Math.min(255, baseGreen + Math.floor(Math.random() * colorDifference));
  const diffBlue = Math.min(255, baseBlue + Math.floor(Math.random() * colorDifference));

  const oddRow = Math.floor(Math.random() * gridSize);
  const oddCol = Math.floor(Math.random() * gridSize);

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const circle = document.createElement("div");
      circle.style.width = `${cellSize * 0.8}px`;
      circle.style.height = `${cellSize * 0.8}px`;
      circle.style.borderRadius = "50%";
      circle.style.margin = "auto";

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

function onCorrectClick() {
  score++;
  scoreElement.textContent = score;

  if (score % 5 === 0) {
    gridSize++;
    colorDifference = Math.max(10, colorDifference - 5);
  }

  generateGrid();
}

function onGameOver() {
  clearInterval(countdown);

  // Update high score if the current score is higher
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore); // Save high score in localStorage
    highScoreElement.textContent = `High Score: ${highScore}`;
  }

  alert(`Game Over! Your score: ${score}`);
  resetGame();
}

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

function resetTimer() {
  clearInterval(countdown);
  const existingTimer = document.getElementById("timer");
  if (existingTimer) {
    document.body.removeChild(existingTimer);
  }
  timeLeft = 10;
  startTimer();
}

function resetGame() {
  score = 0;
  gridSize = 3;
  colorDifference = 50;
  scoreElement.textContent = score;
  generateGrid();
}

generateGrid();
