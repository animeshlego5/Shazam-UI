"use client";

import { FlashlightText } from "@/components/ui/flashlight-text";
import PillNav from "@/components/PillNav";

const navItems = [
    { label: "About", href: "#" },
    { label: "Journey", href: "#" },
    { label: "Github", href: "#" },
];

export function OvalHeader() {
    return (
        <header className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-4">
            <PillNav
                items={navItems}
                baseColor="#000"
                pillColor="rgba(255, 255, 255, 0.95)"
                hoveredPillTextColor="#fff"
                pillTextColor="#000"
            >
                <FlashlightText
                    enableTextBeam={true}
                    className="text-xl font-bold tracking-tight text-white font-syne"
                    spotlightSize={50}
                >
                    NoteSpy
                </FlashlightText>
            </PillNav>
        </header>
    );
}
