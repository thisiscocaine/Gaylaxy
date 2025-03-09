const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numParticles = 1000;

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

// Star colors
const starColors = ["#ffffff", "#ffcc00", "#ff4500", "#ff69b4", "#9370db", "#00ffff", "#1e90ff", "#ff1493"];

class Particle {
    constructor() {
        this.size = Math.random() * 2 + 1;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = starColors[Math.floor(Math.random() * starColors.length)];
        this.opacity = Math.random() * 1 + 0.1;
        this.pulseSpeed = Math.random() * 0.1 + 0.1;
        this.trail = [];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap-around effect (infinite space)
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Twinkling effect with pulsing opacity
        this.opacity += this.pulseSpeed;
        if (this.opacity > 1 || this.opacity < 0.2) this.pulseSpeed *= -1;

        // Star trails (leave behind light traces)
        this.trail.push({ x: this.x, y: this.y, opacity: this.opacity });
        if (this.trail.length > 10) this.trail.shift();
    }

    draw() {
        // Draw star trail
        ctx.globalAlpha = this.opacity * 0.5;
        this.trail.forEach((t, i) => {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(t.x, t.y, this.size * (i / 10), 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw main star
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Auto-animating nebula background
let nebulaShift = 0;
function drawBackground() {
    let gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 100,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.2
    );
    gradient.addColorStop(0, `hsl(${nebulaShift}, 100%, 10%)`);
    gradient.addColorStop(0.1, `hsl(${nebulaShift + 50}, 100%, 15%)`);
    gradient.addColorStop(0.3, `hsl(${nebulaShift + 100}, 100%, 5%)`);
    gradient.addColorStop(0.5, "#000010");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    nebulaShift += 0.05;
    if (nebulaShift > 360) nebulaShift = 0;
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
