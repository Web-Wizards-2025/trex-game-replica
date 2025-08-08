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
  }, 700);
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
let gameSpeed = 3000; // starting speed (in ms)
let minGameSpeed = 1500; // how fast it can go
let speedIncreaseRate = 150; // how much to reduce each interval
let speedIncreaseInterval = 5000; // every 5 seconds
let difficultyTimer;

function createObstacle() {
  if (!gameRunning) return;

  const obstacleTypes = [
    {
      name: "small",
      width: "30px",
      height: "30px",
      src: "./assets/images/tumbleweed.png",
      bottom: "0",
    },
    {
      name: "medium",
      width: "40px",
      height: "50px",
      src: "./assets/images/cactus.png",
      bottom: "0",
    },
    {
      name: "large",
      width: "60px",
      height: "70px",
      src: "./assets/images/dead-tree.png",
      bottom: "-2px",
    },
    {
      name: "huge",
      width: "110px",
      height: "90px",
      src: "./assets/images/shack.png",
      bottom: "-6px",
    },
  ];

  const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle", type.name);

  const img = document.createElement("img");
  img.src = type.src;
  img.alt = `${type.name} obstacle`;

  obstacle.style.width = type.width;
  obstacle.style.height = type.height;
  obstacle.style.bottom = type.bottom;

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
  gameSpeed = 3000; // reset speed if restarting
  startObstacleLoop();
  startCollisionLoop();
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

function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const obstacles = document.querySelectorAll(".obstacle");

  // Shrink player's hitbox (grace area)
  const shrink = 10;
  const adjustedPlayerRect = {
    left: playerRect.left + shrink,
    right: playerRect.right - shrink,
    top: playerRect.top + shrink,
    bottom: playerRect.bottom - shrink,
  };

  for (const obstacle of obstacles) {
    const obstacleRect = obstacle.getBoundingClientRect();

    const isColliding =
      adjustedPlayerRect.left < obstacleRect.right &&
      adjustedPlayerRect.right > obstacleRect.left &&
      adjustedPlayerRect.top < obstacleRect.bottom &&
      adjustedPlayerRect.bottom > obstacleRect.top;

    if (isColliding) {
      endGame();
      break;
    }
  }
}

function endGame() {
  gameRunning = false;
  clearInterval(difficultyTimer);

  document.getElementById("game-over-message").classList.remove("hidden");

  document.querySelectorAll(".obstacle").forEach((o) => o.remove());
}

document.getElementById("restart-button").addEventListener("click", () => {
  document.getElementById("game-over-message").classList.add("hidden");
  gameSpeed = 3000;
  gameRunning = true;
  startObstacleLoop();
  startCollisionLoop();
  increaseDifficulty();
});

function startCollisionLoop() {
  if (!gameRunning) return;
  checkCollision();
  requestAnimationFrame(startCollisionLoop);
}
