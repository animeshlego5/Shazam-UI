import { FlashlightText } from "../../../src/components/ui/flashlight-text";
import { BorderBeam } from "@/components/ui/border-beam";

export default function DesignDemoPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8 gap-12">
            <div className="text-center space-y-4">
                <h2 className="text-xl text-muted-foreground">Dark Mode Demo</h2>
                <div className="relative overflow-hidden p-12 border rounded-xl bg-black">
                    <BorderBeam size={250} duration={12} delay={9} />
                    {/* Note: FlashlightText relies on text-foreground colors vs opacity. 
              In a real dark mode app, background is dark. */}
                    <FlashlightText
                        enableTextBeam={true}
                        className="text-6xl font-bold tracking-tighter text-white"
                    >
                        NoteSpy
                    </FlashlightText>
                </div>
                <p className="text-sm text-neutral-500">
                    Hover over the text above to see the effect.
                </p>
            </div>

            <div className="text-center space-y-4">
                <h2 className="text-xl text-muted-foreground">Light Mode / Static Fallback</h2>
                <div className="relative overflow-hidden p-12 border rounded-xl bg-white">
                    <BorderBeam size={250} duration={12} delay={9} />
                    <div className="text-6xl font-bold tracking-tighter text-black">
                        NoteSpy
                    </div>
                </div>
            </div>
        </div>
    );
}
