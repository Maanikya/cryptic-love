import { useEffect, useRef } from "react";
import useWindowDimensions from "./WindowDimensions";

const ParticleAnimation = () => {
    const { height, width } = useWindowDimensions();
    const rafRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const c = canvasRef.current;
        const ctx = c.getContext("2d");
        const dpr = window.devicePixelRatio;
        const w = width;
        const h = height;
        const clearStyle = "hsla(0, 0%, 0%, 0.3)";
        const particles = [];
        const particleCount = 500;
        const particlePath = 7;
        const pillars = [];
        const pillarCount = 30;
        const pillarGrowth = 0.5;
        const pillarReduction = 0.1;
        // const pillarStyle = "hsla(0, 80%, 30%, 0.3)";
        const pillarStyle = "hsla(0, 10%, 8%, 0.3)";
        let hue = 0;
        const hueRange = 100;
        const hueChange = 1;
        const gravity = 0.175;
        const lineWidth = 1;
        const lineCap = "butt";
        const PI = Math.PI;
        const TWO_PI = PI * 2;
        let lastTime = Date.now();
        let currentTime = Date.now();
        let deltaTime = 0;

        c.width = w * dpr;
        c.height = h * dpr;
        ctx.scale(dpr, dpr);

        const rand = (min, max) => Math.random() * (max - min) + min;

        const distance = (a, b) => {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            return Math.sqrt(dx * dx + dy * dy);
        };

        class Particle {
            constructor() {
                this.path = [];
                this.reset();
            }

            reset() {
                this.radius = 1;
                this.x = rand(0, w);
                this.y = 0;
                this.vx = 0;
                this.vy = 0;
                this.hit = 0;
                this.path.length = 0;
            }

            step() {
                this.hit = 0;

                this.path.unshift([this.x, this.y]);
                if (this.path.length > particlePath) {
                    this.path.pop();
                }

                this.vy += (gravity / 16) * deltaTime;
                this.x += (this.vx / 16) * deltaTime;
                this.y += (this.vy / 16) * deltaTime;

                if (this.y > h + 10) {
                    this.reset();
                }

                let i = pillarCount;
                while (i--) {
                    const pillar = pillars[i];
                    if (
                        distance(this, pillar) <
                        this.radius + pillar.renderRadius
                    ) {
                        this.vx = -(pillar.x - this.x) * rand(0.01, 0.03);
                        this.vy = -(pillar.y - this.y) * rand(0.01, 0.03);
                        pillar.radius -= pillarReduction;
                        this.hit = 1;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.moveTo(this.x, ~~this.y);
                for (let i = 0, length = this.path.length; i < length; i++) {
                    const point = this.path[i];
                    ctx.lineTo(point[0], ~~point[1]);
                }
                // ctx.strokeStyle = `hsla(${rand(hue + this.x / 3, hue + this.x / 3 + hueRange)}, 100%, 50%, 0.8)`;
                ctx.strokeStyle = `hsla(${rand(
                    hue + this.x / 3,
                    hue + this.x / 3 + hueRange
                )}, 50%, 30%, 0.6)`;
                ctx.stroke();

                if (this.hit) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, rand(1, 15), 1, TWO_PI);
                    // ctx.fillStyle = `hsla(${rand(hue + this.x / 3, hue + this.x / 3 + hueRange)}, 0%, 0%, 0.1)`;
                    ctx.fillStyle = `hsla(${rand(
                        hue + this.x / 3,
                        hue + this.x / 3 + hueRange
                    )}, 80%, 15%, 0.1)`;
                    ctx.fill();
                }
            }
        }

        class Pillar {
            constructor() {
                this.reset();
            }

            reset() {
                this.radius = rand(30, 100); // Original radius of the pillar
                this.renderRadius = 0; // Rendering radius for gradual appearance
                this.x = rand(0, w); // Random x-coordinate within canvas width
                this.y = rand(h / 2 - h / 4, h); // Random y-coordinate
                this.active = 0; // State to determine if pillar is fully visible
            }

            step() {
                if (this.active) {
                    if (this.radius <= 1) {
                        this.reset(); // Reset when radius becomes too small
                    } else {
                        this.renderRadius = this.radius; // Maintain the full render radius
                    }
                } else {
                    if (this.renderRadius < this.radius) {
                        this.renderRadius += (pillarGrowth / 16) * deltaTime; // Gradual growth
                    } else {
                        this.active = 1; // Mark as fully grown
                    }
                }
            }

            draw() {
                ctx.save(); // Save the current canvas state
                ctx.translate(this.x, this.y); // Move to the pillar's position
                ctx.scale(this.renderRadius / 50, this.renderRadius / 50); // Scale heart shape relative to `renderRadius`

                ctx.beginPath();
                ctx.moveTo(0, -30); // Starting point of the heart (top center)

                // Create right side of the heart
                ctx.bezierCurveTo(25, -60, 75, -20, 0, 50);

                // Create left side of the heart
                ctx.bezierCurveTo(-75, -20, -25, -60, 0, -30);

                ctx.closePath();
                ctx.fillStyle = pillarStyle; // Use the defined style for filling
                ctx.fill(); // Fill the heart shape

                ctx.restore(); // Restore the canvas state
            }
        }

        const init = () => {
            ctx.lineWidth = lineWidth;
            ctx.lineCap = lineCap;

            for (let i = 0; i < pillarCount; i++) {
                pillars.push(new Pillar());
            }

            loop();
        };

        const step = () => {
            lastTime = currentTime;
            currentTime = Date.now();
            deltaTime = currentTime - lastTime;

            hue += (hueChange / 16) * deltaTime;

            if (particles.length < particleCount) {
                particles.push(new Particle());
            }

            for (let i = 0; i < particles.length; i++) {
                particles[i].step();
            }

            for (let i = 0; i < pillarCount; i++) {
                pillars[i].step();
            }
        };

        const draw = () => {
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = clearStyle;
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = pillarStyle;
            for (let i = 0; i < pillarCount; i++) {
                pillars[i].draw();
            }

            ctx.globalCompositeOperation = "lighter";
            for (let i = 0; i < particles.length; i++) {
                particles[i].draw();
            }
        };

        const loop = () => {
            rafRef.current = window.requestAnimationFrame(loop);
            step();
            draw();
        };

        document.addEventListener("visibilitychange", () => {
            lastTime = Date.now();
            currentTime = Date.now();
            deltaTime = 0;

            window.cancelAnimationFrame(rafRef.current);

            if (document.visibilityState === "visible") {
                loop();
            }
        });

        init();

        return () => {
            window.cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return <canvas ref={canvasRef} />;
};

export default ParticleAnimation;
