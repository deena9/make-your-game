let paused = false; // Track the paused state
let pauseMenu; // Store the pause menu element
let timerInterval; // Store the timer interval ID
let gameOver = false; // Track the game over state
let gameWin = false; // Track the game win state

document.addEventListener("DOMContentLoaded", function () {
  const boxes = document.createElement("div");
  boxes.classList.add("boxes-container");
  document.body.appendChild(boxes); // Append to DOM before calling createBoxes()

  const arrow = document.createElement("div");
  arrow.classList.add("arrow");
  boxes.appendChild(arrow);

  const allBoxProperties = [];
  const allEnemiesProperties = [];

  moveWithKeys(boxes, arrow, allBoxProperties);

  function checkProximityAndCollisions() {
    if (!paused && !gameOver && !gameWin) {
      isNearby(boxes, arrow, allBoxProperties);
      isOverlap(boxes, arrow, [], allEnemiesProperties);
    }
    setTimeout(checkProximityAndCollisions, 100);
  }
  checkProximityAndCollisions();

  function checkAndCreateEnemies() {
    if (
      !paused &&
      !gameOver &&
      !gameWin &&
      allBoxProperties.length <= 5 &&
      allEnemiesProperties.length === 0
    ) {
      for (let i = 0; i < 2; i++) {
        createEnemies(boxes, allEnemiesProperties);
      }
    }
    setTimeout(checkAndCreateEnemies, 1000);
  }
  setTimeout(() => checkAndCreateEnemies(), 3000);

  // Start the timer when the game starts
  timerInterval = setTimeout(updateTimer, 1000);

  for (let i = 1; i <= 10; i++) {
    createBoxes(boxes, allBoxProperties);
  }

  // Add the pause menu
  createPauseMenu();
  fpsCounter();

  // Consolidated keydown event listener for pause/resume and restart functionality
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !gameOver && !gameWin) {
      togglePause(); // Use Escape to toggle pause/resume
    } else if (e.key === "Enter") {
      if (paused || gameOver || gameWin) {
        restartGame(); // Use Enter to restart when the game is paused
      }
    }
  });
});

function createPauseMenu() { 
  pauseMenu = document.createElement("div");
  pauseMenu.classList.add("message-display");
  pauseMenu.innerHTML = `
      <h2>Game Paused</h2>
      <button id="resumeBtn">Press ESC to resume</button>
      <button id="restartBtn">Press Enter to restart</button>
  `;
  document.body.appendChild(pauseMenu);

  // Hide the menu initially
  pauseMenu.style.display = "none";
}

function togglePause() {
  if (paused) {
    resumeGame();
  } else {
    pauseGame();
  }
}

function pauseGame() {
  paused = true;
  clearTimeout(timerInterval); // Stop the timer when paused
  pauseMenu.style.display = "block"; // Show the pause menu
}

function resumeGame() {
  paused = false;
  pauseMenu.style.display = "none"; // Hide the pause menu
  timerInterval = setTimeout(updateTimer, 1000); // Restart the timer
}

function restartGame() {
  window.location.reload(); // Reload the page to restart the game
}

// FPS counter
function fpsCounter() {
  const fpsDisplay = document.getElementById("fps"); // Get the FPS element

  let frameCount = 0;
  let lastFPSTime = performance.now();
  let currentFPS = 60;

  function renderFps(timestamp) {
    frameCount++;

    const elapsedSinceLastFPS = timestamp - lastFPSTime;
    if (elapsedSinceLastFPS >= 1000) {
      currentFPS = frameCount;
      frameCount = 0;
      lastFPSTime = timestamp;
    }

    fpsDisplay.textContent = `${currentFPS}`;

    requestAnimationFrame(renderFps); // Continue the loop regardless of the pause
  }
  requestAnimationFrame(renderFps);
}

function randomAnimals() {
  const randomNum = Math.floor(Math.random() * 3) + 1;
  return randomNum;
}

let jetNumber = 4;
function randomjets() {
  const currentJet = jetNumber;
  jetNumber++;
  return currentJet;
}

function updateTimer() {
  if (paused || gameOver || gameWin) return; // Don't update the timer if paused

  let timer = parseInt(document.getElementById("timer").textContent);
  if (timer <= 0) {
    checkGameOver();
    return;
  }
  timer--;
  document.getElementById("timer").textContent = timer;

  // Continue updating the timer after 1 second
  timerInterval = setTimeout(updateTimer, 1000);
}

function createBoxes(boxes, allBoxProperties) {
  const containerRect = boxes.getBoundingClientRect(); // Directly use 'boxes'

  const box = document.createElement("div");
  box.classList.add("box");

  box.style.backgroundImage = `url('./assets/${randomAnimals()}.png')`;

  let boxX = Math.random() * (containerRect.width - 70); // Remove offsets
  let boxY = Math.random() * (containerRect.height - 70);

  let boxDx = Math.random() * 2 + 1; // Random value between 1 and 2
  let boxDy = Math.random() * 2 + 1; // Random value between 1 and 2

  // Ensure both X and Y move in the same direction
  if (Math.random() < 0.5) {
    boxDx = -boxDx; // Set both to negative
    boxDy = -boxDy; // Set both to negative
  }

  boxDx = Math.max(Math.min(boxDx, 2), -2); // Ensure the value is between -2 and 2
  boxDy = Math.max(Math.min(boxDy, 2), -2); // Ensure the value is between -2 and 2

  const boxProperties = {
    boxX,
    boxY,
    boxDx,
    boxDy,
    originalDx: boxDx, // Store initial speed
    originalDy: boxDy, // Store initial speed
    box,
    speedIncreased: false,
  };

  moveBoxes(boxProperties, false);
  boxes.appendChild(box);
  allBoxProperties.push(boxProperties);
}

function createEnemies(boxes, allEnemiesProperties) {
  const containerRect = boxes.getBoundingClientRect(); // Directly use 'boxes'
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");

  enemy.style.backgroundImage = `url('./assets/${randomjets()}.png')`;

  let enemyX = Math.random() * (containerRect.width - 70);
  let enemyY = Math.random() * (containerRect.height - 70);

  let enemyDx = Math.random() * 2 + 1; // Random value between 1 and 2
  let enemyDy = Math.random() * 2 + 1; // Random value between 1 and 2

  // Ensure both X and Y move in the same direction
  if (Math.random() < 0.5) {
    enemyDx = -enemyDx; // Set both to negative
    enemyDy = -enemyDy; // Set both to negative
  }

  enemyDx = Math.max(Math.min(enemyDx, 2), -2); // Ensure the value is between -2 and 2
  enemyDy = Math.max(Math.min(enemyDy, 2), -2); // Ensure the value is between -2 and 2

  const enemyProperties = {
    enemyX,
    enemyY,
    enemyDx,
    enemyDy,
    box: enemy,
    speedIncreased: false,
  };

  moveBoxes(enemyProperties, true);
  boxes.appendChild(enemy);
  allEnemiesProperties.push(enemyProperties);
}

function moveBoxes(props, isEnemy) {
  if (paused) {
    requestAnimationFrame(() => moveBoxes(props, isEnemy));
    return;
  }

  const boxesContainer = document.querySelector(".boxes-container");
  const containerRect = boxesContainer.getBoundingClientRect();

  if (!isEnemy) {
    props.boxX += props.boxDx;
    props.boxY += props.boxDy;

    // Ensure box stays within the container boundaries
    if (props.boxX >= containerRect.width - 70) {
      //props.boxX = containerRect.width - 70;
      props.boxDx *= -1;
    }
    if (props.boxX <= 0) {
      //props.boxX = 0;
      props.boxDx *= -1;
    }
    if (props.boxY >= containerRect.height - 70) {
      //props.boxY = containerRect.height - 70;
      props.boxDy *= -1;
    }
    if (props.boxY <= 0) {
      //props.boxY = 0;
      props.boxDy *= -1;
    }

    props.box.style.transform = `translate(${props.boxX}px, ${props.boxY}px)`;

    requestAnimationFrame(() => moveBoxes(props, isEnemy));
  } else {
    const arrow = document.querySelector(".arrow");
    const arrowRect = arrow.getBoundingClientRect();
    const arrowX = arrowRect.left - containerRect.left + arrowRect.width / 2;
    const arrowY = arrowRect.top - containerRect.top + arrowRect.height / 2;

    let dirX = arrowX - props.enemyX;
    let dirY = arrowY - props.enemyY;
    let distance = Math.sqrt(dirX * dirX + dirY * dirY);
    // diagonal movement accelerates the player. we can also include a speed variable to control the speed of the player that corresponds to the speed of the movement when it goes left or right.

    if (distance > 0) {
      dirX /= distance;
      dirY /= distance;
    }

    const speed = 3;
    props.enemyDx = dirX * speed;
    props.enemyDy = dirY * speed;

    props.enemyX += props.enemyDx;
    props.enemyY += props.enemyDy;

    // Ensure enemy stays inside the box
    props.enemyX = Math.max(
      0,
      Math.min(props.enemyX, containerRect.width - 70)
    );
    props.enemyY = Math.max(
      0,
      Math.min(props.enemyY, containerRect.height - 70)
    );

    props.box.style.transform = `translate(${props.enemyX}px, ${props.enemyY}px)`;

    requestAnimationFrame(() => moveBoxes(props, isEnemy));
  }
}

function moveWithKeys(boxes, arrow, allBoxProperties) {
  const containerRect = boxes.getBoundingClientRect(); // Directly use 'boxes'

  let x = containerRect.width / 2;
  let y = containerRect.height / 2;
  const step = 5; // Adjust the step size for smoother movement
  const keys = {};

  arrow.style.transform = `translate(${x}px, ${y}px)`;

  document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
  });

  document.addEventListener("keyup", (e) => {
    delete keys[e.key];
  });

  function moveArrow() {
    if (paused) {
      requestAnimationFrame(moveArrow);
      return;
    }

    let moved = false;

    if (keys["ArrowLeft"]) {
      x = Math.max(0, x - step);
      moved = true;
    }
    if (keys["ArrowRight"]) {
      x = Math.min(containerRect.width - 70, x + step);
      moved = true;
    }
    if (keys["ArrowUp"]) {
      y = Math.max(0, y - step);
      moved = true;
    }
    if (keys["ArrowDown"]) {
      y = Math.min(containerRect.height - 70, y + step);
      moved = true;
    }

    if (keys[" "]) {
      isOverlap(boxes, arrow, allBoxProperties, []);
    }

    if (moved) {
      arrow.style.transform = `translate(${x}px, ${y}px)`;
    }
    requestAnimationFrame(moveArrow);
  }
  requestAnimationFrame(moveArrow);
}

function isNearby(boxes, arrow, allBoxProperties) {
  const arrowRect = arrow.getBoundingClientRect();

  for (const boxProps of allBoxProperties) {
    const boxRect = boxProps.box.getBoundingClientRect();

    if (
      !(
        arrowRect.right < boxRect.left - 30 ||
        arrowRect.left > boxRect.right + 30 ||
        arrowRect.bottom < boxRect.top - 30 ||
        arrowRect.top > boxRect.bottom + 30
      )
    ) {
      if (!boxProps.speedIncreased) {
        boxProps.boxDx *= -1.5;
        boxProps.boxDy *= -1.5;
        boxProps.speedIncreased = true;

        // Reset speed after 2 seconds
        setTimeout(() => {
          boxProps.boxDx = boxProps.originalDx;
          boxProps.boxDy = boxProps.originalDy;
          boxProps.speedIncreased = false;
        }, 2000);
      }
    }
  }
}

let collisionCooldown = false;

function isOverlap(boxes, arrow, allBoxProperties, allEnemiesProperties) {
  const arrowRect = arrow.getBoundingClientRect();

  if (allBoxProperties.length > 0) {
    for (let i = 0; i < allBoxProperties.length; i++) {
      const boxProps = allBoxProperties[i];
      const boxRect = boxProps.box.getBoundingClientRect();
      if (
        arrowRect.right >= boxRect.left &&
        arrowRect.left <= boxRect.right &&
        arrowRect.bottom >= boxRect.top &&
        arrowRect.top <= boxRect.bottom
      ) {
        const captureSound = new Audio(
          "./assets/sound_effects/captureSound.wav"
        );
        captureSound.play();

        boxProps.box.classList.add("glow-fade");
        allBoxProperties.splice(i, 1);
        setTimeout(() => {
          boxes.removeChild(boxProps.box);
        }, 2000);
        updateScore();
        break;
      }
    }
  }

  if (allEnemiesProperties.length > 0) {
    for (let i = 0; i < allEnemiesProperties.length; i++) {
      const enemyProps = allEnemiesProperties[i];
      const enemyRect = enemyProps.box.getBoundingClientRect();
      if (
        arrowRect.right >= enemyRect.left &&
        arrowRect.left <= enemyRect.right &&
        arrowRect.bottom >= enemyRect.top &&
        arrowRect.top <= enemyRect.bottom
      ) {
        if (!collisionCooldown) {
          const hitSound = new Audio(
            "./assets/sound_effects/hitSound_even_shorter.wav"
          );
          arrow.classList.add("hit-glow");
          setTimeout(() => {
            arrow.classList.remove("hit-glow");
            arrow.classList.add("fade-out");
          }, 500);
          setTimeout(() => {
            arrow.classList.remove("fade-out");
          }, 500);
          hitSound.play();
          updateLife();
          collisionCooldown = true;
          setTimeout(() => {
            collisionCooldown = false;
          }, 1000);
        }
        break;
      }
    }
  }
}

function showHitMessage() {
  const hitMessage = document.createElement("div");
  hitMessage.classList.add("hit-message");
  hitMessage.textContent = "You've been hit!";
  document.body.appendChild(hitMessage);

  setTimeout(() => {
    hitMessage.remove();
  }, 800);
}

function updateScore() {
  let count = parseInt(document.getElementById("counter").textContent);
  count++;
  document.getElementById("counter").textContent = count;

  // Check for win condition
  if (count === 10) {
    showWinMessage();
  }
}

function showWinMessage() {
  gameWin = true;
  paused = true;
  const winSound = new Audio("./assets/sound_effects/winSound.wav");
  winSound.play();
  const winMessage = document.createElement("div");
  winMessage.classList.add("message-display");
  winMessage.innerHTML = `
      <h2>You Won!</h2>
      <button id="restartBtn">Press Enter to restart</button>
  `;
  document.body.appendChild(winMessage);

  // // Add event listener to restart the game when Enter is pressed
  // document.addEventListener("keydown", (e) => {
  //   if (e.key === "Enter") {
  //     restartGame();
  //   }
  // });

  // paused = true; // Pause the game when the player wins
}

function checkGameOver() {
  if (gameOver) return;
  let life = parseInt(document.getElementById("life").textContent);
  let timer = parseInt(document.getElementById("timer").textContent);
  if (life <= 0 || timer <= 0) {
    gameOver = true;
    paused = true;
    pauseMenu = document.createElement("div");
    pauseMenu.classList.add("message-display");
    pauseMenu.innerHTML = `
            <h2>GAME OVER</h2>
            <button id="restartBtn">Press Enter to restart</button>
        `;
    document.body.appendChild(pauseMenu);
    paused = true;
    const gameOverSound = new Audio("./assets/sound_effects/gameOver.mp3");
    setTimeout(() => {
      gameOverSound.play();
    }, 500);
  }

  // document.addEventListener("keydown", (e) => {
  //   if (e.key === "Enter") {
  //     restartGame(); // Use Enter to restart when the game is paused
  //   }
  // });
}

function updateLife() {
  let life = parseInt(document.getElementById("life").textContent);
  if (life > 0) {
    life--;
    document.getElementById("life").textContent = life;
    showHitMessage();
  }
  checkGameOver();
}
