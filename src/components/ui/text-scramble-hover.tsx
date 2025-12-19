"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";


interface TextScrambleHoverProps {
  text: string;
  scrambleSpeed?: number;    // ms per step
  scrambleCycles?: number;   // cycles per character
  hoverDuration?: number;    // Aceternity duration in seconds (can be ignored if always visible)
  className?: string;
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function getRandomChar(charSet: string) {
  return charSet[Math.floor(Math.random() * charSet.length)];
}

export const TextScrambleHover = ({
  text,
  scrambleSpeed = 50,
  scrambleCycles = 5,
  className,
}: TextScrambleHoverProps) => {
  const [scrambled, setScrambled] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let step = 0;
    const totalSteps = text.length * scrambleCycles;

    intervalRef.current = setInterval(() => {
      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (step >= (i + 1) * scrambleCycles) {
          result += text[i];
        } else if (text[i] === " ") {
          result += " ";
        } else {
          result += getRandomChar(DEFAULT_CHARS);
        }
      }
      setScrambled(result);
      step++;

      if (step > totalSteps && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, scrambleSpeed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, scrambleSpeed, scrambleCycles]);

  // Always render hover text with currently scrambled/real text
  return (
    <div className={className} style={{ minHeight: "2em" }}>
      <TextHoverEffect text={scrambled} duration={0} />
    </div>
  );
};
