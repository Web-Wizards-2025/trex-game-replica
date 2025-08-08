// Selecting the player element in the DOM
const player = document.getElementById("player");

// Creating a function to make the player jump
// The player can jump by pressing space or the arrow up like in the official game
// It is also possible to jump by clicking anywhere on the screen, useful for mobile users
function jump(e) {
  // Preventing scrolling when pressing space or arrow up
  e.preventDefault();

  // Preventing animation resetting by spamming the jump button
  if (Array.from(player.classList).includes("jump")) return;

  // Establishing valid inputs and impeding jumping if they aren't valid
  const isValidInput =
    e.key === " " || e.key === "ArrowUp" || e.type === "click";

  if (!isValidInput) return;

  // Adding the 'jump' class to the player
  player.classList.add("jump");

  // Removing the 'jump' class after 500 milliseconds (the same time as the animation duration in CSS in the "jump" class)
  setTimeout(() => {
    player.classList.remove("jump");
  }, 500);
}

// Adding an event listener for both the 'keydown' and the "click" event
["keydown", "click"].forEach((event) => {
  document.addEventListener(event, jump);
});

// Obstacle Generating Loop
// === Obstacle Generator ===
const gameBox = document.getElementById("game-box");
const startButton = document.getElementById("start-button");

let gameRunning = false;
let gameSpeed = 4000; // starting speed (in ms)
let minGameSpeed = 1500; // how fast it can go
let speedIncreaseRate = 150; // how much to reduce each interval
let speedIncreaseInterval = 5000; // every 5 seconds
let difficultyTimer;

function createObstacle() {
  if (!gameRunning) return;

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  const img = document.createElement("img");
  img.src = "./assets/images/cactus.png";
  img.alt = "Cactus obstacle";

  obstacle.appendChild(img);
  gameBox.appendChild(obstacle);

  const speed = gameSpeed;
  obstacle.style.animationDuration = `${speed}ms`;

  setTimeout(() => {
    obstacle.remove();
  }, speed);
}

function startObstacleLoop() {
  if (!gameRunning) return;

  createObstacle();

  const nextSpawn = 1000 + Math.random() * 1500;
  setTimeout(startObstacleLoop, nextSpawn);
}

startButton.addEventListener("click", () => {
  if (gameRunning) return;
  gameRunning = true;
  gameSpeed = 4000; // reset speed if restarting
  startObstacleLoop();
  increaseDifficulty(); // start ramping up difficulty
});

function increaseDifficulty() {
  difficultyTimer = setInterval(() => {
    if (gameSpeed > minGameSpeed) {
      gameSpeed -= speedIncreaseRate;
      console.log(`Increased speed! New obstacle speed: ${gameSpeed}ms`);
    } else {
      clearInterval(difficultyTimer);
    }
  }, speedIncreaseInterval);
}
