"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

import './scrambled-text.css';

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

interface ScrambledTextProps {
    radius?: number;
    duration?: number;
    speed?: number;
    scrambleChars?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    text?: string; // support for legacy prop just in case, or remove
}

const ScrambledText = ({
    radius = 100,
    duration = 1.2,
    speed = 0.5,
    scrambleChars = '.:',
    className = '',
    style = {},
    children,
    text,
}: ScrambledTextProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const charsRef = useRef<HTMLElement[]>([]);

    useEffect(() => {
        if (!rootRef.current) return;

        // SplitText might create nested divs? The original code splits 'p'
        const split = SplitText.create(rootRef.current.querySelector('p'), {
            type: 'words,chars',
            charsClass: 'char',
            wordsClass: 'word'
        });
        // @ts-expect-error - GSAP types might conflict or need specific casting
        charsRef.current = split.chars;

        charsRef.current.forEach((c) => {
            gsap.set(c, {
                display: 'inline-block',
                attr: { 'data-content': c.innerHTML }
            });
        });

        // Ensure words don't break internally
        if (split.words) {
            gsap.set(split.words, {
                display: 'inline-block',
                whiteSpace: 'nowrap'
            });
        }

        const handleMove = (e: MouseEvent) => {
            charsRef.current.forEach((c) => {
                const { left, top, width, height } = c.getBoundingClientRect();
                const dx = e.clientX - (left + width / 2);
                const dy = e.clientY - (top + height / 2);
                const dist = Math.hypot(dx, dy);

                if (dist < radius) {
                    gsap.to(c, {
                        overwrite: true,
                        duration: duration * (1 - dist / radius),
                        scrambleText: {
                            text: c.getAttribute('data-content') || '',
                            chars: scrambleChars,
                            speed
                        },
                        ease: 'none'
                    });
                }
            });
        };

        // Need to cast to any or HTMLElement to add event listener if refs mismatch
        const el = rootRef.current;
        el.addEventListener('pointermove', handleMove);

        return () => {
            el.removeEventListener('pointermove', handleMove);
            split.revert();
        };
    }, [radius, duration, speed, scrambleChars]);

    return (
        <div ref={rootRef} className={`text-block ${className}`} style={style}>
            <p className="font-mono">{children || text}</p>
        </div>
    );
};

export default ScrambledText;
export { ScrambledText };
