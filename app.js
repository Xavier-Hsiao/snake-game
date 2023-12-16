// Select HTML elements
const board = document.querySelector("#game-board");
const instructionText = document.querySelector("#instruction-text");
const logo = document.querySelector("#logo-image");
const score = document.querySelector("#score");
const highScoreText = document.querySelector("#high-score");

// Variables
const gridSize = 20;
let snakeCoordinate = [
  {
    // Coordinate of snake pixels in the 20x20 grid map
    x: 10,
    y: 10,
  },
];
let foodCoordinate = generateFoodCoordinate();
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;

// Write a function to draw game elements
function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
}

// Write a function to draw the snake 🐍
function drawSnake() {
  // Don't show the snake until the game started
  if (gameStarted) {
    snakeCoordinate.forEach((segment) => {
      const snakeElement = createGameElement("div", "snake");
      setPosition(snakeElement, segment);
      board.appendChild(snakeElement);
    });
  }
}

// Write a function to draw food
function drawFood() {
  // Don't show food until the game started
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, foodCoordinate);
    board.appendChild(foodElement);
  }
}

// Write a function to create snake or food HTML elements
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;

  return element;
}

// Write a function to set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Write a function to generate food at a random place
function generateFoodCoordinate() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;

  return { x, y };
}

// Write a function to move the snake
function moveSnake() {
  // Use shallow copy tp avoid altering the original object
  const head = { ...snakeCoordinate[0] };
  switch (direction) {
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
  }
  // Put the new head coordinate to the start of the snake object
  snakeCoordinate.unshift(head);

  // If the snake eats the food
  if (head.x === foodCoordinate.x && head.y === foodCoordinate.y) {
    // Regenerate food
    foodCoordinate = generateFoodCoordinate();
    // Clear past interval function
    clearInterval(gameInterval);
    // Increase game speed
    increaseSpeed();
    // Update score
    updateScore();
    gameInterval = setInterval(() => {
      moveSnake();
      checkCollision();
      draw();
    }, gameSpeedDelay);
    // If the snake did not eat the food after moving
  } else {
    // Remove the last segment of the snake
    snakeCoordinate.pop();
  }
}

function startGame() {
  gameStarted = true;
  // Hide instruction text and logo once the game has started
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    moveSnake();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Write a function to increase game speed
function increaseSpeed() {
  console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

// Write a function to check if the snake hit the wall or touched its tail
function checkCollision() {
  const head = snakeCoordinate[0];
  // Check if the snake hit the wall
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }
  // Check if the snake touched its tal. Notice that we start the loop from index 1 because index 0 is snake's head so the body begins with index 1
  for (let i = 1; i < snakeCoordinate.length; i++) {
    if (head.x === snakeCoordinate[i].x && head.y === snakeCoordinate[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  // Reset the game elements
  snakeCoordinate = [{ x: 10, y: 10 }];
  foodCoordinate = generateFoodCoordinate();
  direction = "right";
  gameSpeedDelay = 200;
  // Update score
  updateScore();
}

function updateScore() {
  // The default snake segment number is one so we have to minus that to get the real score
  const currentScore = snakeCoordinate.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

function updateHighScore() {
  const currentScore = snakeCoordinate.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  // Recall the instruction text
  instructionText.style.display = "block";
  // Recall the logo
  logo.style.display = "block";
}

// Listen for key press event
function handleKeyPress(event) {
  // Start the game if user pressed space key
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === "")
  ) {
    startGame();
  } else {
    // Press keys to move the snake
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }
}

document.addEventListener("keydown", handleKeyPress);
