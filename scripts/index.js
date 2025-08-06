// Selecting the DOM elements
const player = document.getElementById("player");
console.log(player);

// Creating a function to make the player jump
function jump(e) {
  e.preventDefault();
  const playerClasses = Array.from(player.classList);
  if (playerClasses.includes("jump")) return;
  const isValidInput =
    e.key === " " || e.key === "ArrowUp" || e.type === "click";

  if (!isValidInput) return;

  // Adding the 'jump' class to the player
  player.classList.add("jump");

  // Removing the 'jump' class after 500 milliseconds
  setTimeout(() => {
    player.classList.remove("jump");
  }, 500);
}

// Adding an event listener for both the 'keydown' and the "click" event
["keydown", "click"].forEach((event) => {
  document.addEventListener(event, jump);
});
