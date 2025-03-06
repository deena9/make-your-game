document.addEventListener("DOMContentLoaded", function () {
    function createShootingStar() {
        const star = document.createElement("div");
        star.classList.add("shooting-star");

        // Random start position
        let startX = Math.random() * window.innerWidth;
        let startY = Math.random() * window.innerHeight;
        star.style.left = `${startX}px`;
        star.style.top = `${startY}px`;

        // Random movement direction
        let angle = Math.random() * 360; // Random angle in degrees
        let distance = Math.random() * 300 + 100; // Random travel distance

        let endX = startX + distance * Math.cos(angle * (Math.PI / 180));
        let endY = startY + distance * Math.sin(angle * (Math.PI / 180));

        // Apply animation dynamically
        star.style.transition = `transform 2s linear, opacity 2s linear`;
        document.body.appendChild(star);

        requestAnimationFrame(() => {
            star.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;
            star.style.opacity = "0";
        });

        // Remove star after animation
        setTimeout(() => {
            star.remove();
        }, 2000);
    }

    // Generate a new shooting star every 1.5 seconds
    setInterval(createShootingStar, 1500);
});