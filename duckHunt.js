const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let ducks = [];

const maxDucks = 7;

function spawnDuck() {
    if (ducks.length < maxDucks) {
        let duck = {
            x: Math.random() * canvas.width, 
            y: Math.random() * canvas.height,
            speedX: Math.random() * 3 + 1, 
            speedY: Math.random() * 2 - 1, 
            width: 50,
            height: 50,
        };
        ducks.push(duck);
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ducks.forEach((duck, index) => {
        duck.x += duck.speedX;
        duck.y += duck.speedY;
        
        if (duck.y <= 0 || duck.y >= canvas.height - duck.height) {
            duck.speedY *= -1;
        }
        if (duck.x <= 0 || duck.x >= canvas.width - duck.width) {
            duck.speedX *= -1; 
        }
        
        ctx.fillStyle = "yellow";
        ctx.fillRect(duck.x, duck.y, duck.width, duck.height);
    });
    
    requestAnimationFrame(update);
}

for (let i = 0; i < maxDucks; i++) {
    spawnDuck();
}

update();