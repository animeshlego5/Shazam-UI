"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

function AccordionItem({ title, children, isOpen, onToggle }: AccordionItemProps) {
    return (
        <div className="border-b border-white/10 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full py-6 flex items-center justify-between text-left group transition-colors hover:text-purple-400"
            >
                <span className="text-xl md:text-2xl font-medium text-white group-hover:text-purple-400 transition-colors">
                    {title}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex-shrink-0 ml-4"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white/60 group-hover:text-purple-400 transition-colors"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 text-white/70 text-base md:text-lg leading-relaxed">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface AccordionProps {
    items: {
        id: string;
        title: string;
        content: React.ReactNode;
    }[];
    allowMultiple?: boolean;
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const handleToggle = (id: string) => {
        setOpenItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                if (!allowMultiple) {
                    newSet.clear();
                }
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <div className="w-full">
            {items.map((item) => (
                <AccordionItem
                    key={item.id}
                    title={item.title}
                    isOpen={openItems.has(item.id)}
                    onToggle={() => handleToggle(item.id)}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
}

export default Accordion;
