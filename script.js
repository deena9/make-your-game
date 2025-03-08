document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game-container");
    const scoreDisplay = document.getElementById("score");
    const livesDisplay = document.getElementById("lives");
    const timerDisplay = document.getElementById("timer");
    const fpsDisplay = document.getElementById("fps"); // Get the FPS element

    let score = 0;
    let lives = 3;
    let ducks = [];
    let difficulty = 1;
    let timeLeft = 60;

    let frameCount = 0;
    let lastFPSTime = performance.now();
    let currentFPS = 0;

    function updateFPS(timestamp) {
        frameCount++;
        const elapsedSinceLastFPS = timestamp - lastFPSTime;
        if (elapsedSinceLastFPS >= 1000) {
            currentFPS = frameCount;
            frameCount = 0;
            lastFPSTime = timestamp;
            fpsDisplay.textContent = currentFPS; // Update FPS in HTML
        }
        requestAnimationFrame(updateFPS);
    }

    // Crosshair settings
    const crosshair = document.createElement("div");
    crosshair.id = "crosshair";
    gameContainer.appendChild(crosshair);

    let crosshairX = window.innerWidth / 2;
    let crosshairY = window.innerHeight / 2;
    let crosshairSpeed = 30;

    function updateCrosshairPosition() {
        crosshair.style.left = `${crosshairX}px`;
        crosshair.style.top = `${crosshairY}px`;
    }

    const MAX_DUCKS = 6;
    const MAX_TOTAL_DUCKS = 10;
    let totalDucksSpawned = 0;

    function spawnDuck() {
        if (lives <= 0 || ducks.length >= MAX_DUCKS || totalDucksSpawned >= MAX_TOTAL_DUCKS) return;

        const duck = document.createElement("div");
        duck.classList.add("duck");

        const startX = Math.random() > 0.5 ? -50 : window.innerWidth + 50;
        const startY = Math.random() * (window.innerHeight - 150) + 50;
        duck.style.left = `${startX}px`;
        duck.style.top = `${startY}px`;

        gameContainer.appendChild(duck);
        ducks.push({
            element: duck,
            x: startX,
            y: startY,
            speedX: (startX < 0 ? 1 : -1) * (1 + Math.random() * 1.5 * difficulty)
        });

        totalDucksSpawned++;
    }

    function gameLoop() {
        ducks.forEach((duck) => {
            duck.x += duck.speedX;
            duck.y += (Math.random() - 0.5) * 2;

            if (duck.x < -50) {
                duck.x = window.innerWidth + 50;
            } else if (duck.x > window.innerWidth + 50) {
                duck.x = -50;
            }

            duck.element.style.left = `${duck.x}px`;
            duck.element.style.top = `${duck.y}px`;
        });

        requestAnimationFrame(gameLoop);
    }

    function shoot() {
        ducks.forEach((duck, index) => {
            const duckRect = duck.element.getBoundingClientRect();
            const crosshairRect = crosshair.getBoundingClientRect();

            if (
                crosshairRect.left < duckRect.right &&
                crosshairRect.right > duckRect.left &&
                crosshairRect.top < duckRect.bottom &&
                crosshairRect.bottom > duckRect.top
            ) {
                score++;
                scoreDisplay.textContent = score;

                duck.element.remove();
                ducks.splice(index, 1);
            }
        });
    }

    function updateTimer() {
        timerDisplay.textContent = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            if (ducks.length > 0) {
                lives--;
                livesDisplay.textContent = `Lives: ${lives}`;
                if (lives <= 0) {
                    alert("Game Over!");
                    return;
                }
            }
            timeLeft = 60;
        } else {
            timeLeft--;
        }
    }

    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowUp":
                crosshairY = Math.max(0, crosshairY - crosshairSpeed);
                break;
            case "ArrowDown":
                crosshairY = Math.min(window.innerHeight, crosshairY + crosshairSpeed);
                break;
            case "ArrowLeft":
                crosshairX = Math.max(0, crosshairX - crosshairSpeed);
                break;
            case "ArrowRight":
                crosshairX = Math.min(window.innerWidth, crosshairX + crosshairSpeed);
                break;
            case " ":
                shoot();
                break;
        }
        updateCrosshairPosition();
    });

    setInterval(spawnDuck, 2000);
    setInterval(updateTimer, 1000);
    setInterval(() => {
        difficulty += 0.2;
    }, 10000);

    gameLoop();
    updateCrosshairPosition();
    requestAnimationFrame(updateFPS); // Start FPS counter
});