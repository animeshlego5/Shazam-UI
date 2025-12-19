"use client";

import { useRef, useEffect } from "react";

interface LetterGlitchProps {
    glitchColors?: string[];
    glitchSpeed?: number;
    centerVignette?: boolean;
    outerVignette?: boolean;
    smooth?: boolean;
    className?: string;
}

export const LetterGlitch = ({
    glitchColors = ["#2b2b2b", "#3d3d3d", "#5c5c5c", "#888888", "#b3b3b3"],
    glitchSpeed = 50,
    centerVignette = false,
    outerVignette = true,
    smooth = true,
    className,
}: LetterGlitchProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(null);
    const letters = useRef<{ char: string; color: string; targetColor: string; colorProgress: number }[]>([]);
    const grid = useRef<{ columns: number; rows: number }>({ columns: 0, rows: 0 });
    const context = useRef<CanvasRenderingContext2D | null>(null);
    const lastGlitchTime = useRef<number>(0);

    const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

    const getRandomChar = () => {
        return charSet[Math.floor(Math.random() * charSet.length)];
    };

    const getRandomColor = () => {
        return glitchColors[Math.floor(Math.random() * glitchColors.length)];
    };

    const setupCanvas = () => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        context.current = ctx;

        const resize = () => {
            if (!canvasRef.current) return;
            const parent = canvasRef.current.parentElement;
            if (parent) {
                canvasRef.current.width = parent.clientWidth;
                canvasRef.current.height = parent.clientHeight;
            }

            // Calculate grid
            const fontSize = 16;
            const columns = Math.ceil(canvasRef.current.width / fontSize);
            const rows = Math.ceil(canvasRef.current.height / fontSize);

            grid.current = { columns, rows };
            letters.current = [];

            for (let i = 0; i < columns * rows; i++) {
                letters.current.push({
                    char: getRandomChar(),
                    color: getRandomColor(),
                    targetColor: getRandomColor(),
                    colorProgress: 1,
                });
            }
        };

        window.addEventListener("resize", resize);
        resize();

        return () => window.removeEventListener("resize", resize);
    };

    const draw = (timestamp: number) => {
        if (!canvasRef.current || !context.current) return;
        const ctx = context.current;
        const { width, height } = canvasRef.current;
        const { columns, rows } = grid.current;
        const fontSize = 16;

        ctx.clearRect(0, 0, width, height);
        ctx.font = `${fontSize}px monospace`;
        ctx.textBaseline = "top";

        // Handle Glitch
        if (timestamp - lastGlitchTime.current > glitchSpeed) {
            for (let i = 0; i < letters.current.length; i++) {
                // 5% chance to change character
                if (Math.random() < 0.05) {
                    letters.current[i].char = getRandomChar();
                    letters.current[i].targetColor = getRandomColor();
                    letters.current[i].colorProgress = 0;
                }
            }
            lastGlitchTime.current = timestamp;
        }

        // Draw Letters
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                const index = y * columns + x;
                const letter = letters.current[index];

                if (!letter) continue;

                // Smooth color transition
                if (smooth && letter.colorProgress < 1) {
                    letter.colorProgress += 0.05;
                } else {
                    letter.color = letter.targetColor;
                }

                ctx.fillStyle = letter.color;
                // Interpolate only if smooth
                // For simplicity in this version, just use the target color or current color

                ctx.fillText(letter.char, x * fontSize, y * fontSize);
            }
        }

        // Apply Vignette
        if (outerVignette) {
            const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 1.5);
            gradient.addColorStop(0, "rgba(0,0,0,0)");
            gradient.addColorStop(1, "rgba(0,0,0,1)"); // Stronger vignette
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }

        if (centerVignette) {
            const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2);
            gradient.addColorStop(0, "rgba(0,0,0,0.8)"); // Dark center
            gradient.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }

        animationRef.current = requestAnimationFrame(draw);
    };

    useEffect(() => {
        const cleanup = setupCanvas();
        animationRef.current = requestAnimationFrame(draw);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (cleanup) cleanup();
        };
    }, [glitchSpeed, smooth]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ display: "block", width: "100%", height: "100%" }}
        />
    );
};
