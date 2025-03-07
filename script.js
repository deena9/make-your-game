document.addEventListener("DOMContentLoaded", function () {
  const isGamePage = document.getElementById("counter") !== null

  if (isGamePage) {
    const boxes = document.createElement("div")
    boxes.classList.add("boxes-container")
    document.body.appendChild(boxes)

    const arrow = document.createElement("div")
    arrow.classList.add("arrow")
    document.body.appendChild(arrow)

    const allBoxProperties = []
    const allEnemiesProperties = []

    moveWithKeys(boxes, arrow, allBoxProperties)

    function checkProximity() {
      isNearby(boxes, arrow, allBoxProperties)
      setTimeout(checkProximity, 100)
    }
    checkProximity()

    function checkEnemyCollisions() {
      isOverlap(boxes, arrow, [], allEnemiesProperties)
      setTimeout(checkEnemyCollisions, 100)
    }
    checkEnemyCollisions()

    function checkAndCreateEnemies() {
      if (allBoxProperties.length <= 5 && allEnemiesProperties.length === 0) {
        for (let i = 0; i < 2; i++) {
          createEnemies(boxes, allEnemiesProperties)
        }
      }
      setTimeout(checkAndCreateEnemies, 1000)
    }
    setTimeout(() => checkAndCreateEnemies(), 5000)

    requestAnimationFrame(() => updateTimer())

    for (let i = 1; i < 10; i++) {
      createBoxes(boxes, allBoxProperties)
    }

    if (allBoxProperties.length <= 5) {
      for (let i = 1; i < allBoxProperties.length / 2; i++) {
        createEnemies(boxes, allEnemiesProperties)
      }
    }
  } else {
    document.addEventListener("keydown", startGame)
  }
})

function startGame() {
  window.location.href = "index.html"
  document.removeEventListener("keydown", startGame)
}

//FPS counter
document.addEventListener("DOMContentLoaded", function () {
  const fpsDisplay = document.createElement("div");
  fpsDisplay.id = "fps-display";
  document.body.appendChild(fpsDisplay);

  let frameCount = 0;
  let lastFPSTime = performance.now();
  let currentFPS = 0;

  function renderFps(timestamp) {
    frameCount++;

    const elapsedSinceLastFPS = timestamp - lastFPSTime;
    if (elapsedSinceLastFPS >= 1000) {
      currentFPS = frameCount;
      frameCount = 0;
      lastFPSTime = timestamp;
    }

    fpsDisplay.textContent = `FPS: ${currentFPS}`;

    requestAnimationFrame(renderFps);
  }
  requestAnimationFrame(renderFps);
});

function createBoxes(boxes, allBoxProperties) {
  const box = document.createElement("div")
  box.classList.add("box")
  let x = Math.random() * (window.innerWidth - 100) + 50
  let y = Math.random() * (window.innerHeight - 100) + 50
  let dx = Math.random() * 4 - 2
  let dy = Math.random() * 4 - 2
  const boxProperties = { x, y, dx, dy, box, speedIncreased: false }
  moveBoxes(boxProperties)
  boxes.appendChild(box)
  allBoxProperties.push(boxProperties)
}

let isEnemy = false

function createEnemies(boxes, allEnemiesProperties) {
  const enemy = document.createElement("div")
  enemy.classList.add("enemy")
  let x = Math.random() * (window.innerWidth - 100) + 50
  let y = Math.random() * (window.innerHeight - 100) + 50
  let dx = Math.random() * 4 - 2
  let dy = Math.random() * 4 - 2
  const enemyProperties = { x, y, dx, dy, box: enemy, speedIncreased: false }
  moveBoxes(enemyProperties)
  boxes.appendChild(enemy)
  allEnemiesProperties.push(enemyProperties)
}

function moveBoxes(props) {
  props.x += props.dx;
  props.y += props.dy;
  if (props.x >= window.innerWidth - 50 || props.x <= 0) {
    props.dx *= -1;
  }
  if (props.y >= window.innerHeight - 50 || props.y <= 0) {
    props.dy *= -1;
  }
  props.box.style.transform = `translate(${props.x}px, ${props.y}px)`;
  requestAnimationFrame(() => moveBoxes(props));
}

function moveWithKeys(boxes, arrow, allBoxProperties) {
  let x = window.innerWidth / 2;
  let y = window.innerHeight - 100;
  const step = 10;
  const keys = {};

  arrow.style.left = `${x}px`;
  arrow.style.top = `${y}px`;

  document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    moveArrow();
  });

  document.addEventListener("keyup", (e) => {
    delete keys[e.key];
  });

  function moveArrow() {
    let moved = false;

    if (keys["ArrowLeft"] && keys["ArrowUp"]) {
      x = Math.max(0, x - step);
      y = Math.max(0, y - step);
      moved = true;
    } else if (keys["ArrowLeft"] && keys["ArrowDown"]) {
      x = Math.max(0, x - step);
      y = Math.min(window.innerHeight - 50, y + step);
      moved = true;
    } else if (keys["ArrowRight"] && keys["ArrowUp"]) {
      x = Math.min(window.innerWidth - 50, x + step);
      y = Math.max(0, y - step);
      moved = true;
    } else if (keys["ArrowRight"] && keys["ArrowDown"]) {
      x = Math.min(window.innerWidth - 50, x + step);
      y = Math.min(window.innerHeight - 50, y + step);
      moved = true;
    } else if (keys["ArrowLeft"]) {
      x = Math.max(0, x - step);
      moved = true;
    } else if (keys["ArrowRight"]) {
      x = Math.min(window.innerWidth - 50, x + step);
      moved = true;
    } else if (keys["ArrowUp"]) {
      y = Math.max(0, y - step);
      moved = true;
    } else if (keys["ArrowDown"]) {
      y = Math.min(window.innerHeight - 50, y + step);
      moved = true;
    }

    if (moved) {
      arrow.style.left = `${x}px`;
      arrow.style.top = `${y}px`;
    }
  }
}

function isNearby(boxes, arrow, allBoxProperties) {
  const arrowRect = arrow.getBoundingClientRect()
  for (let i = 0; i < boxes.children.length; i++) {
    const box = boxes.children[i]
    const boxRect = boxes.children[i].getBoundingClientRect()
    const boxProps = allBoxProperties.find((props) => props.box === box)
    if (boxProps) {
      if (
        !(
          arrowRect.right < boxRect.left - 30 ||
          arrowRect.left > boxRect.right + 30 ||
          arrowRect.bottom < boxRect.top - 30 ||
          arrowRect.top > boxRect.bottom + 30
        )
      ) {
        if (
          Math.abs(boxProps.dx) < 50 &&
          Math.abs(boxProps.dy) < 50 &&
          !boxProps.speedIncreased
        ) {
          boxProps.dx *= 1.5
          boxProps.dy *= 1.5
          boxProps.speedIncreased = true
        }
      }
    }
  }
}

let collisionCooldown = false

function isOverlap(boxes, arrow, allBoxProperties, allEnemiesProperties) {
  const arrowRect = arrow.getBoundingClientRect()

  if (allBoxProperties.length > 0) {
    for (let i = 0; i < allBoxProperties.length; i++) {
      const boxProps = allBoxProperties[i]
      const boxRect = boxProps.box.getBoundingClientRect()
      if (
        arrowRect.right >= boxRect.left &&
        arrowRect.left <= boxRect.right &&
        arrowRect.bottom >= boxRect.top &&
        arrowRect.top <= boxRect.bottom
      ) {
        alert("well done")
        allBoxProperties.splice(i, 1)
        boxes.removeChild(boxProps.box)
        updateScore()
        break
      }
    }
  }

  if (allEnemiesProperties.length > 0) {
    for (let i = 0; i < allEnemiesProperties.length; i++) {
      const enemyProps = allEnemiesProperties[i]
      const enemyRect = enemyProps.box.getBoundingClientRect()
      if (
        arrowRect.right >= enemyRect.left &&
        arrowRect.left <= enemyRect.right &&
        arrowRect.bottom >= enemyRect.top &&
        arrowRect.top <= enemyRect.bottom
      ) {
        if (!collisionCooldown) {
          updateLife()
          collisionCooldown = true
          setTimeout(() => {
            collisionCooldown = false
          }, 1000)
        }
        break
      }
    }
  }
}

function updateScore() {
  let count = parseInt(document.getElementById("counter").textContent)
  count++
  document.getElementById("counter").textContent = count
}

function checkGameOver() {
  let life = parseInt(document.getElementById("life").textContent)
  let timer = parseInt(document.getElementById("timer").textContent)
  if (life <= 0 || timer <= 0) {
    alert("GAME OVER")
    setTimeout(() => {
      window.location.href = "home.html"
    }, 1000)
  }
}

function updateLife() {
  let life = parseInt(document.getElementById("life").textContent)
  life--
  document.getElementById("life").textContent = life
  checkGameOver()
}

function updateTimer() {
  let timer = parseInt(document.getElementById("timer").textContent)
  if (timer <= 0) {
    checkGameOver()
    return
  }
  timer--
  document.getElementById("timer").textContent = timer
  setTimeout(updateTimer, 1000)
}
