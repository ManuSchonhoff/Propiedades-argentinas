"use client";

export default function SplineScene() {
    return (
        <div className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center overflow-hidden">
            {/* Animated robot representation */}
            <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-600 flex items-center justify-center animate-pulse shadow-2xl">
                    <span className="text-5xl md:text-6xl">🤖</span>
                </div>
                {/* Orbit rings */}
                <div className="absolute inset-[-20px] rounded-full border border-neutral-200 animate-spin" style={{ animationDuration: "8s" }} />
                <div className="absolute inset-[-40px] rounded-full border border-neutral-100 animate-spin" style={{ animationDuration: "12s", animationDirection: "reverse" }} />
                <div className="absolute inset-[-60px] rounded-full border border-neutral-100/50 animate-spin" style={{ animationDuration: "16s" }} />
            </div>
            {/* Floating particles */}
            <div className="absolute top-10 left-1/4 w-2 h-2 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="absolute top-20 right-1/3 w-1 h-1 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0.5s" }} />
            <div className="absolute bottom-16 left-1/3 w-1.5 h-1.5 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: "1s" }} />
        </div>
    );
}
