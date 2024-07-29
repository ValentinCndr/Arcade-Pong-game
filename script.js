// DOM Elements
const startText = document.getElementById("startText");
const paddle1 = document.getElementById("paddle1");
const paddle2 = document.getElementById("paddle2");
const ball = document.getElementById("ball");
const player1ScoreElement = document.getElementById("player1Score");
const player2ScoreElement = document.getElementById("player2Score");
const lossSound = document.getElementById("lossSound");
const wallSound = document.getElementById("wallSound");
const paddleSound = document.getElementById("paddleSound");

// Game Variables
let gameRunning = false; // Flag to check if the game is running
let keysPressed = {}; // Object to store pressed keys
let paddle1Speed = 0; // Speed of paddle 1
let paddle1Y = 150; // Initial Y position of paddle 1
let paddle2Speed = 0; // Speed of paddle 2
let paddle2Y = 150; // Initial Y position of paddle 2
let ballX = 370; // Initial X position of the ball gameWidth / 2 - the ball width
let ballSpeedX = 2; // Initial X speed of the ball
let ballY = 155; // Initial Y position of the ball gameHeight / 2 - the ball height
let ballSpeedY = 2; // Initial Y speed of the ball
let player2Score = 0;
let player1Score = 0;

// Game Constants
const paddleAcceleration = 1;
const maxPaddleSpeed = 5;
const paddleDeceleration = 1;
const gameHeight = 350;
const gameWidth = 800;

// Event listeners for key press events
document.addEventListener("keydown", startGame);
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Start game function
function startGame() {
  gameRunning = true; // Set the game running flag to true
  startText.style.display = "none"; // Hide the start text
  document.removeEventListener("keydown", startGame); // Remove the event listener to prevent multiple starts
  gameLoop(); // Start the game loop
}

// Main game loop
function gameLoop() {
  if (gameRunning) {
    updatePaddle1();
    updatePaddle2();
    moveBall();
    setTimeout(gameLoop, 8);
  }
}

// Handle key down events
function handleKeyDown(e) {
  keysPressed[e.key] = true; // Set the pressed key flag to true
}

// Handle key up events
function handleKeyUp(e) {
  keysPressed[e.key] = false; // Set the pressed key flag to false
}

// Update paddle 1 position
function updatePaddle1() {
  if (keysPressed["w"]) {
    paddle1Speed = Math.max(paddle1Speed - paddleAcceleration, -maxPaddleSpeed); // Move paddle 1 up
  } else if (keysPressed["s"]) {
    paddle1Speed = Math.min(paddle1Speed + paddleAcceleration, +maxPaddleSpeed); // Move paddle 1 down
  } else {
    if (paddle1Speed > 0) {
      paddle1Speed = Math.max(paddle1Speed - paddleDeceleration, 0); // Decelerate paddle 1 if moving down
    } else if (paddle1Speed < 0) {
      paddle1Speed = Math.min(paddle1Speed + paddleDeceleration, 0); // Decelerate paddle 1 if moving up
    }
  }

  paddle1Y += paddle1Speed; // Update paddle 1 Y position
  if (paddle1Y < 0) {
    paddle1Y = 0; // Ensure paddle 1 doesn't move out of the game area at the top
  }

  if (paddle1Y > gameHeight - paddle1.clientHeight) {
    paddle1Y = gameHeight - paddle1.clientHeight; // Ensure paddle 1 doesn't move out of the game area at the bottom
  }

  paddle1.style.top = paddle1Y + "px"; // Update paddle 1 position in the DOM converting the paddle1Y into pixels
}

// Update paddle 2 position
function updatePaddle2() {
  if (keysPressed["ArrowUp"]) {
    paddle2Speed = Math.max(paddle2Speed - paddleAcceleration, -maxPaddleSpeed); // Move paddle 2 up
  } else if (keysPressed["ArrowDown"]) {
    paddle2Speed = Math.min(paddle2Speed + paddleAcceleration, +maxPaddleSpeed); // Move paddle 2 down
  } else {
    if (paddle2Speed > 0) {
      paddle2Speed = Math.max(paddle2Speed - paddleDeceleration, 0); // Decelerate paddle 2 if moving down
    } else if (paddle2Speed < 0) {
      paddle2Speed = Math.min(paddle2Speed + paddleDeceleration, 0); // Decelerate paddle 2 if moving up
    }
  }

  paddle2Y += paddle2Speed; // Update paddle 2 Y position
  if (paddle2Y < 0) {
    paddle2Y = 0; // Ensure paddle 2 doesn't move out of the game area at the top
  }

  if (paddle2Y > gameHeight - paddle2.clientHeight) {
    paddle2Y = gameHeight - paddle2.clientHeight; // Ensure paddle 2 doesn't move out of the game area at the bottom
  }

  paddle2.style.top = paddle2Y + "px"; // Update paddle 2 position in the DOM converting the paddle2Y into pixels
}

// Move the ball
function moveBall() {
  ballX += ballSpeedX; // Update ball X position
  ballY += ballSpeedY; // Update ball Y position

  // Wall Collision
  if (ballY >= gameHeight - ball.clientHeight || ballY <= 0) {
    ballSpeedY = -ballSpeedY; // Reverse ball Y speed if it hits the top or bottom wall
    playSound(wallSound); // Play wall collision sound
  }

  // Paddle1 collision
  if (
    ballX <= paddle1.clientWidth &&
    ballY >= paddle1Y &&
    ballY <= paddle1Y + paddle1.clientHeight
  ) {
    ballSpeedX = -ballSpeedX; // Reverse ball X speed if it hits paddle 1
    playSound(paddleSound); // Play paddle collision sound
  }

  // Paddle2 collision
  if (
    ballX >= gameWidth - paddle2.clientWidth - ball.clientWidth &&
    ballY >= paddle2Y &&
    ballY <= paddle2Y + paddle2.clientHeight
  ) {
    ballSpeedX = -ballSpeedX; // Reverse ball X speed if it hits paddle 2
    playSound(paddleSound); // Play paddle collision sound
  }

  // Out of gameArea collision
  if (ballX <= 0) {
    player2Score++; // Increase player 2 score if ball goes out on the left side
    playSound(lossSound);
    updateScoreboard();
    resetBall();
    pauseGame();
  } else if (ballX >= gameWidth - ball.clientWidth) {
    player1Score++; // Increase player 1 score if ball goes out on the right side
    playSound(lossSound);
    updateScoreboard();
    resetBall();
    pauseGame();
  }
  ball.style.left = ballX + "px"; // Update ball X position in the DOM
  ball.style.top = ballY + "px"; // Update ball Y position in the DOM
}

// Update the scoreboard
function updateScoreboard() {
  player1ScoreElement.textContent = player1Score;
  player2ScoreElement.textContent = player2Score;
}

// Reset the ball position
function resetBall() {
  ballX = gameWidth / 2 - ball.clientWidth / 2; // Center the ball horizontally
  ballY = gameHeight / 2 - ball.clientHeight / 2; // Center the ball vertically
  ballSpeedX = Math.random() > 0.5 ? 2 : -2; // Randomize initial X speed direction
  ballSpeedY = Math.random() > 0.5 ? 2 : -2; // Randomize initial Y speed direction
}

// Pause the game
function pauseGame() {
  gameRunning = false; // Set the game running flag to false
  document.addEventListener("keydown", startGame); // Add event listener to start the game on key press
}

// Play sound
function playSound(sound) {
  sound.currentTime = 0; // Reset sound to start
  sound.play(); // Play the sound
}
