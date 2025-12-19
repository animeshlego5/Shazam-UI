"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TextScrambleProps {
  children: string;
  speed?: number;
  characterSet?: string;
  className?: string;
  cycles?: number; // how many scramble cycles per letter
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function getRandomChar(charSet: string) {
  return charSet[Math.floor(Math.random() * charSet.length)];
}

export const TextScramble = ({
  children,
  speed = 50,
  characterSet = DEFAULT_CHARS,
  className,
  cycles = 3, // default: scramble each letter for 4 cycles
  ...motionProps
}: TextScrambleProps) => {
  const [text, setText] = useState(children);

  useEffect(() => {
    let step = 0;
    const totalSteps = children.length * cycles;

    const interval = setInterval(() => {
      let scrambled = "";

      for (let i = 0; i < children.length; i++) {
        if (step >= (i + 1) * cycles) {
          scrambled += children[i];
        } else if (children[i] === " ") {
          scrambled += " ";
        } else {
          scrambled += getRandomChar(characterSet);
        }
      }

      setText(scrambled);
      step++;

      if (step > totalSteps) {
        clearInterval(interval);
        setText(children);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [children, speed, characterSet, cycles]);

  return (
    <motion.span className={className} {...motionProps}>
      {text}
    </motion.span>
  );
};
