import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import heroVideo from "@/assets/My Video.mp4";

import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const navigate = useNavigate();
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <section className="relative w-full h-screen overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full z-0">
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                >
                    <source src={heroVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Video Overlay for contrast */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Mute/Unmute Control */}
            <button
                onClick={toggleMute}
                className="absolute bottom-10 right-10 z-30 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all backdrop-blur-sm border border-white/20"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10 pointer-events-none" />

            {/* Content */}
            <div className="relative z-20 container mx-auto h-full flex flex-col justify-center items-start text-left px-4">

                <h1 className="text-6xl md:text-8xl lg:text-9xl font-odibee text-white mb-2 tracking-wide drop-shadow-xl">
                    RAFAHIYAH FOUNDATION
                </h1>

                <h2 className="text-2xl md:text-4xl font-odibee text-rafahiyah-gold mb-8 max-w-4xl tracking-wider drop-shadow-lg">
                    With Compassion and Empathy, Towards Prosperity and Smiling Future
                </h2>

                <p className="text-white/80 font-sans text-lg mb-12 italic max-w-2xl drop-shadow-md">

                </p>

                <Button
                    onClick={() => navigate('/contact', { state: { section: "donate", cause: "General" } })}
                    className="bg-white text-rafahiyah-dark-blue hover:bg-rafahiyah-deep-red hover:text-white transition-colors text-xl px-10 py-6 rounded-full font-odibee tracking-wider shadow-lg"
                >
                    Donate Now To a Cause
                </Button>
            </div>
        </section>
    );
};

export default HeroSection;
