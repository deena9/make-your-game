document.addEventListener("DOMContentLoaded", function () {
  const isGamePage = document.getElementById("counter") !== null;

  if (isGamePage) {
    const boxes = document.createElement("div");
    boxes.classList.add("boxes-container");
    document.body.appendChild(boxes);

    const arrow = document.createElement("div");
    arrow.classList.add("arrow");
    document.body.appendChild(arrow);

    const allBoxProperties = [];
    const allEnemiesProperties = [];

    moveWithKeys(boxes, arrow, allBoxProperties);

    function checkProximity() {
      isNearby(boxes, arrow, allBoxProperties);
      setTimeout(checkProximity, 100);
    }
    checkProximity();

    function checkEnemyCollisions() {
      isOverlap(boxes, arrow, [], allEnemiesProperties);
      setTimeout(checkEnemyCollisions, 100);
    }
    checkEnemyCollisions();

    function checkAndCreateEnemies() {
      if (allBoxProperties.length <= 5 && allEnemiesProperties.length === 0) {
        for (let i = 0; i < 2; i++) {
          createEnemies(boxes, allEnemiesProperties);
        }
      }
      setTimeout(checkAndCreateEnemies, 1000);
    }
    setTimeout(() => checkAndCreateEnemies(), 5000);

    requestAnimationFrame(() => updateTimer());

    for (let i = 1; i < 10; i++) {
      createBoxes(boxes, allBoxProperties);
    }
  } else {
    document.addEventListener("keydown", startGame);
  }
});

function startGame() {
  window.location.href = "index.html";
  document.removeEventListener("keydown", startGame);
}

//FPS counter
document.addEventListener("DOMContentLoaded", function () {
  const fpsDisplay = document.getElementById("fps"); // Get the FPS element

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

    fpsDisplay.textContent = `${currentFPS}`;

    requestAnimationFrame(renderFps);
  }
  requestAnimationFrame(renderFps);
});

function createBoxes(boxes, allBoxProperties) {
  const box = document.createElement("div");
  box.classList.add("box");
  let boxX = Math.random() * (window.innerWidth - 100) + 50;
  let boxY = Math.random() * (window.innerHeight - 100) + 50;
  let boxDx = Math.random() * 4 - 2;
  let boxDy = Math.random() * 4 - 2;
  const boxProperties = {
    boxX,
    boxY,
    boxDx,
    boxDy,
    box,
    speedIncreased: false,
  };
  let isEnemy = false;
  moveBoxes(boxProperties, isEnemy);
  boxes.appendChild(box);
  allBoxProperties.push(boxProperties);
}

function createEnemies(boxes, allEnemiesProperties) {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  let enemyX = Math.random() * (window.innerWidth - 100) + 50;
  let enemyY = Math.random() * (window.innerHeight - 100) + 50;
  let enemyDx = Math.random() * 4 - 2;
  let enemyDy = Math.random() * 4 - 2;
  const enemyProperties = {
    enemyX,
    enemyY,
    enemyDx,
    enemyDy,
    box: enemy,
    speedIncreased: false,
  };
  let isEnemy = true;
  moveBoxes(enemyProperties, isEnemy);
  boxes.appendChild(enemy);
  allEnemiesProperties.push(enemyProperties);
}

function moveBoxes(props, isEnemy, arrow) {
  if (!isEnemy) {
    props.boxX += props.boxDx;
    props.boxY += props.boxDy;
    if (props.boxX >= window.innerWidth - 50 || props.boxX <= 0) {
      props.boxDx *= -1;
    }
    if (props.boxY >= window.innerHeight - 50 || props.boxY <= 0) {
      props.boxDy *= -1;
    }
    props.box.style.transform = `translate(${props.boxX}px, ${props.boxY}px)`;
    requestAnimationFrame(() => moveBoxes(props, isEnemy, arrow));
  } else {
    const arrow = document.querySelector(".arrow");
    const arrowRect = arrow.getBoundingClientRect();
    const arrowX = arrowRect.left + arrowRect.width / 2;
    const arrowY = arrowRect.top + arrowRect.height / 2;
    let dirX = arrowX - props.enemyX;
    let dirY = arrowY - props.enemyY;
    let length = Math.sqrt(dirX * dirX + dirY * dirY);
    if (length > 0) {
      dirX /= length;
      dirY /= length;
    }
    const speed = 2;
    props.enemyDx = dirX * speed;
    props.enemyDy = dirY * speed;
    props.enemyX += props.enemyDx;
    props.enemyY += props.enemyDy;
    props.box.style.transform = `translate(${props.enemyX}px, ${props.enemyY}px)`;
    requestAnimationFrame(() => moveBoxes(props, isEnemy, arrow));
  }
}

function moveWithKeys(boxes, arrow, allBoxProperties) {
  let x = window.innerWidth / 2;
  let y = window.innerHeight - 100;
  const step = 30;
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

    if (keys["ArrowLeft"]) {
      x = Math.max(0, x - step);
      moved = true;
    }
    if (keys["ArrowRight"]) {
      x = Math.min(window.innerWidth - 50, x + step);
      moved = true;
    }
    if (keys["ArrowUp"]) {
      y = Math.max(0, y - step);
      moved = true;
    }
    if (keys["ArrowDown"]) {
      y = Math.min(window.innerHeight - 50, y + step);
      moved = true;
    }

    if (keys[" "]) {
      isOverlap(boxes, arrow, allBoxProperties, []);
    }

    if (moved) {
      arrow.style.left = `${x}px`;
      arrow.style.top = `${y}px`;
    }
  }
}

function isNearby(boxes, arrow, allBoxProperties) {
  const arrowRect = arrow.getBoundingClientRect();
  for (let i = 0; i < boxes.children.length; i++) {
    const box = boxes.children[i];
    const boxRect = boxes.children[i].getBoundingClientRect();
    const boxProps = allBoxProperties.find((props) => props.box === box);
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
          boxProps.dx *= 1.5;
          boxProps.dy *= 1.5;
          boxProps.speedIncreased = true;
        }
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
        alert("well done");
        allBoxProperties.splice(i, 1);
        boxes.removeChild(boxProps.box);
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

function updateScore() {
  let count = parseInt(document.getElementById("counter").textContent);
  count++;
  document.getElementById("counter").textContent = count;
}

function checkGameOver() {
  let life = parseInt(document.getElementById("life").textContent);
  let timer = parseInt(document.getElementById("timer").textContent);
  if (life <= 0 || timer <= 0) {
    alert("GAME OVER");
    setTimeout(() => {
      window.location.href = "index.html"
    }, 1000)
  }
}

function updateLife() {
  let life = parseInt(document.getElementById("life").textContent);
  life--;
  document.getElementById("life").textContent = life;
  checkGameOver();
}

function updateTimer() {
  let timer = parseInt(document.getElementById("timer").textContent);
  if (timer <= 0) {
    checkGameOver();
    return;
  }
  timer--;
  document.getElementById("timer").textContent = timer;
  setTimeout(updateTimer, 1000);
}
