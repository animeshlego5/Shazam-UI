"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testSongs = [
    { artist: "Lil Uzi Vert", title: "20 Min" },
];

export default function TestSongsNote() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-12 right-0 w-64 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl"
                    >
                        <p className="text-white/50 text-xs mb-2">Available test songs:</p>
                        <ul className="space-y-1">
                            {testSongs.map((song, idx) => (
                                <li key={idx} className="text-white/80 text-sm">
                                    <span className="text-white/60">{song.artist}</span>
                                    <span className="text-white/40 mx-1">—</span>
                                    <span className="text-white">{song.title}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="text-white/30 text-xs mt-3 italic">
                            More songs coming soon!
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-colors ${isOpen
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70"
                    }`}
            >
                <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>P.S. Test Songs</span>
            </motion.button>
        </div>
    );
}
