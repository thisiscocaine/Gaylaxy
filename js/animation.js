const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numParticles = 10000; // 10K stars for a real galaxy

// Mouse interaction
const mouse = {
    x: null,
    y: null,
    radius: 100
};

window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Galaxy colors (deep space vibes)
const starColors = [
    "#ffffff", // White
    "#ffd700", // Yellow
    "#ff4500", // Orange-red
    "#ff69b4", // Pink
    "#9370db", // Purple
    "#00ffff", // Cyan blue
    "#1e90ff"  // Deep blue
];

class Particle {
    constructor() {
        this.size = Math.random() * 2 + 0.5;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.color = starColors[Math.floor(Math.random() * starColors.length)];
        this.opacity = Math.random();
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x <= 0 || this.x >= canvas.width) this.speedX *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.speedY *= -1;

        // Mouse interaction: Slight attraction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            this.x -= dx * 0.005;
            this.y -= dy * 0.005;
        }

        // Twinkling effect with pulsing opacity
        this.opacity += this.pulseSpeed;
        if (this.opacity > 1 || this.opacity < 0.3) this.pulseSpeed *= -1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.globalAlpha = 1; // Reset global alpha
    }
}

// Background gradient for deep space
function drawBackground() {
    let gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        100,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
    );
    gradient.addColorStop(0, "#010409");
    gradient.addColorStop(0.3, "#080820");
    gradient.addColorStop(0.6, "#00132d");
    gradient.addColorStop(1, "#00000c");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Initialize particles
function initParticles() {
    particlesArray.length = 0;
    for (let i = 0; i < numParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Animate particles
function animateParticles() {
    drawBackground();
    
    particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateParticles);
}

// Resize handler
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Start animation
initParticles();
animateParticles();
