// Selecting the player element in the DOM
const player = document.getElementById("player");

// Creating a function to make the player jump
// The player can jump by pressing space or the arrow up like in the official game
// It is also possible to jump by clicking anywhere on the screen, useful for mobile users
function jump(e) {
  // Preventing scrolling when pressing space or arrow up
  e.preventDefault();

  // Converting the player class list to an array for easier inspection
  const playerClasses = Array.from(player.classList);

  // Preventing animation resetting by spamming the jump button
  if (playerClasses.includes("jump")) return;

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
