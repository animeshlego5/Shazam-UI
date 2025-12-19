"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface FlashlightTextProps {
  children: React.ReactNode;
  className?: string;
  spotlightSize?: number;
  enableTextBeam?: boolean;
}

export function FlashlightText({
  children,
  className,
  spotlightSize = 100,
  enableTextBeam = false,
}: FlashlightTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  // Extract text string from children if it's a simple string for the beam effect
  const textContent = typeof children === 'string' ? children : '';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden cursor-default select-none",
        className
      )}
    >
      {/* Base Text (Always visible, usually dimmer/hidden in dark mode logic) */}
      <div className="text-foreground/20 dark:text-foreground/20 pointer-events-none">
        {children}
      </div>

      {/* Spotlight Revelation Layer */}
      <div
        className="absolute inset-0 pointer-events-none text-foreground"
        style={{
          maskImage: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, black, transparent)`,
          opacity: opacity,
          transition: "opacity 0.2s ease",
        }}
      >
        {children}
      </div>

      {/* Text Border Beam Layer (SVG Overlay) */}
      {enableTextBeam && textContent && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="textBeamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <motion.text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="none"
            stroke="url(#textBeamGradient)"
            strokeWidth="1.5"
            className={cn("font-bold tracking-tighter", className, "text-transparent stroke-current")} // Re-use className for font sizing
            style={{
              // We need to match the font size/family of the parent.
              // Since exact matching via SVG is hard without computed styles, 
              // we rely on the implementation detail that `className` has text-6xl etc.
              // However, SVG text sizing differs from CSS pixels sometimes.
              // Ideally we use foreignObject, but stroke effect works best on <text>.
              // Let's try attempting to inherit styles via currentcolor or class.
            }}
            initial={{ strokeDasharray: "10% 90%", strokeDashoffset: "0%" }}
            animate={{ strokeDashoffset: "-200%" }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            {/* 
              Note: Matching SVG text exactly to HTML text is tricky.
              A better "beam" approach for arbitrary text is using background-clip on a border-box, 
              but "text-outline" specifically implies stroke.
              
              Let's accept that this SVG overlay might need manual tuning or
              we just use the textContent. 
           */}
            {textContent}
          </motion.text>
        </svg>
      )}
    </div>
  );
}
