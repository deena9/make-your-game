document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game-container");
    const scoreDisplay = document.getElementById("score");
    const livesDisplay = document.getElementById("lives");

    let score = 0;
    let lives = 3;
    let ducks = [];
    let difficulty = 1; // Ducks speed increases over time

    // Crosshair settings
    const crosshair = document.createElement("div");
    crosshair.id = "crosshair";
    gameContainer.appendChild(crosshair);

    let crosshairX = window.innerWidth / 2;
    let crosshairY = window.innerHeight / 2;
    let crosshairSpeed = 30; // Faster movement

    function updateCrosshairPosition() {
        crosshair.style.left = `${crosshairX}px`;
        crosshair.style.top = `${crosshairY}px`;
    }

    function spawnDuck() {
        if (lives <= 0) return;

        const duck = document.createElement("div");
        duck.classList.add("duck");

        // Random starting position (left or right)
        const startX = Math.random() > 0.5 ? -50 : window.innerWidth + 50;
        const startY = Math.random() * (window.innerHeight - 150) + 50;
        duck.style.left = `${startX}px`;
        duck.style.top = `${startY}px`;

        gameContainer.appendChild(duck);
        ducks.push({
            element: duck,
            x: startX,
            y: startY,
            speedX: (startX < 0 ? 1 : -1) * (1 + Math.random() * 1.5 * difficulty) // Slower start, increases over time
        });

        setTimeout(() => {
            if (gameContainer.contains(duck)) {
                lives--;
                livesDisplay.textContent = lives;
                duck.remove();
                if (lives <= 0) {
                    alert("Game Over!");
                }
            }
        }, 5000);
    }

    function gameLoop() {
        ducks.forEach((duck, index) => {
            duck.x += duck.speedX;
            duck.element.style.left = `${duck.x}px`;

            // Remove ducks when they leave the screen
            if (duck.x < -100 || duck.x > window.innerWidth + 100) {
                duck.element.remove();
                ducks.splice(index, 1);
            }
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

    // Move crosshair with keyboard
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
                shoot(); // Spacebar shoots
                break;
        }
        updateCrosshairPosition();
    });

    setInterval(spawnDuck, 2000);

    // Increase difficulty over time
    setInterval(() => {
        difficulty += 0.2; // Ducks get faster every 10 seconds
    }, 10000);

    gameLoop();
    updateCrosshairPosition();
});