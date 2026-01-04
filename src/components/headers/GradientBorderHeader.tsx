"use client";

import Link from "next/link";
import { FlashlightText } from "@/components/ui/flashlight-text";
import { motion } from "framer-motion";

const navItems = [
    { label: "About", href: "#about" },
    { label: "Journey", href: "#journey" },
    { label: "Github", href: "https://github.com/animeshlego5/NoteSpy" },
];

export function GradientBorderHeader() {
    return (
        <header className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-4">
            <motion.nav
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative flex items-center gap-2 px-2 py-2 rounded-full"
            >
                {/* Border with subtle shimmer effect */}
                <div className="absolute inset-0 rounded-full -z-10">
                    {/* Static dark gradient border */}
                    <div
                        className="absolute inset-0 rounded-full p-[1px]"
                        style={{
                            background: "linear-gradient(135deg, #1e3a5f 0%, #0a0a0a 50%, #2d1b4e 100%)",
                        }}
                    >
                        <div className="w-full h-full rounded-full bg-black/95 backdrop-blur-lg" />
                    </div>

                    {/* Subtle shimmer sweep */}
                    <motion.div
                        className="absolute inset-0 rounded-full overflow-hidden"
                        style={{ opacity: 0.4 }}
                    >
                        <motion.div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
                                width: "50%",
                            }}
                            animate={{
                                x: ["-100%", "300%"],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 4,
                                ease: "easeInOut",
                            }}
                        />
                    </motion.div>
                </div>

                {/* Logo with Flashlight Effect */}
                <Link
                    href="#hero"
                    className="flex items-center justify-center px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                >
                    <FlashlightText
                        enableTextBeam={true}
                        className="text-xl font-bold tracking-tight text-white font-syne"
                        spotlightSize={50}
                        enableAutoTrigger={true}
                        autoTriggerInitialDelay={1000}
                        autoTriggerDelay={2500}
                    >
                        NoteSpy
                    </FlashlightText>
                </Link>

                {/* Divider */}
                <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/30 to-transparent" />

                {/* Nav Items */}
                <div className="flex items-center gap-1">
                    {navItems.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 * (index + 1) }}
                            className="relative group"
                        >
                            {item.href.startsWith("http") ? (
                                <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative px-5 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white transition-all duration-300 uppercase tracking-wide overflow-hidden"
                                >
                                    <span className="relative z-10">{item.label}</span>
                                    {/* Hover gradient fill */}
                                    <span
                                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            background: "linear-gradient(90deg, rgba(96,165,250,0.2), rgba(167,139,250,0.2))",
                                        }}
                                    />
                                </a>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="relative px-5 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white transition-all duration-300 uppercase tracking-wide overflow-hidden"
                                >
                                    <span className="relative z-10">{item.label}</span>
                                    {/* Hover gradient fill */}
                                    <span
                                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            background: "linear-gradient(90deg, rgba(96,165,250,0.2), rgba(167,139,250,0.2))",
                                        }}
                                    />
                                </Link>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.nav>
        </header>
    );
}
