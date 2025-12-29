import { Users, Heart, Briefcase, Home, MapPin } from "lucide-react";

const ImpactSection = () => {
    const impacts = [
        { id: 1, label: "Lives Impacted", value: "10k+", icon: Users, color: "bg-rafahiyah-gold", text: "text-rafahiyah-dark-blue" },
        { id: 2, label: "Families Supported", value: "500+", icon: Heart, color: "bg-rafahiyah-deep-red", text: "text-white" },
        { id: 3, label: "Projects Completed", value: "50+", icon: Briefcase, color: "bg-[#1E2542]", text: "text-white" },
        { id: 4, label: "Volunteers Engaged", value: "200+", icon: Users, color: "bg-rafahiyah-gold", text: "text-rafahiyah-dark-blue" },
        { id: 5, label: "Cities Reached", value: "15+", icon: MapPin, color: "bg-rafahiyah-deep-red", text: "text-white" },
    ];

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-odibee text-gray-800 mb-16 uppercase tracking-wider">
                    OUR IMPACT SO FAR
                </h2>
            </div>

            {/* Marquee Container - Full Width */}
            <div className="relative w-full overflow-hidden mb-12">
                <div className="flex w-max animate-scroll">
                    {/* First set of stats */}
                    {impacts.map((item, index) => (
                        <div key={`a-${index}`} className="w-screen sm:w-[50vw] md:w-[33.33vw] lg:w-[25vw] flex-shrink-0 flex flex-col items-center justify-center group">
                            <div className={`w-16 h-16 md:w-20 md:h-20 ${item.color} rounded-2xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105 mb-4`}>
                                <item.icon className={`w-8 h-8 md:w-9 md:h-9 ${item.text}`} />
                            </div>
                            <div className="text-center">
                                <span className="block text-2xl md:text-3xl font-odibee text-gray-800 mb-1">{item.value}</span>
                                <span className="block text-xs font-sans text-gray-500 uppercase tracking-widest">{item.label}</span>
                            </div>
                        </div>
                    ))}
                    {/* Duplicate set for seamless scrolling */}
                    {impacts.map((item, index) => (
                        <div key={`b-${index}`} className="w-screen sm:w-[50vw] md:w-[33.33vw] lg:w-[25vw] flex-shrink-0 flex flex-col items-center justify-center group">
                            <div className={`w-16 h-16 md:w-20 md:h-20 ${item.color} rounded-2xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105 mb-4`}>
                                <item.icon className={`w-8 h-8 md:w-9 md:h-9 ${item.text}`} />
                            </div>
                            <div className="text-center">
                                <span className="block text-2xl md:text-3xl font-odibee text-gray-800 mb-1">{item.value}</span>
                                <span className="block text-xs font-sans text-gray-500 uppercase tracking-widest">{item.label}</span>
                            </div>
                        </div>
                    ))}
                    {/* Triplicate set for wider screens/seamless scrolling */}
                    {impacts.map((item, index) => (
                        <div key={`c-${index}`} className="w-screen sm:w-[50vw] md:w-[33.33vw] lg:w-[25vw] flex-shrink-0 flex flex-col items-center justify-center group">
                            <div className={`w-16 h-16 md:w-20 md:h-20 ${item.color} rounded-2xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105 mb-4`}>
                                <item.icon className={`w-8 h-8 md:w-9 md:h-9 ${item.text}`} />
                            </div>
                            <div className="text-center">
                                <span className="block text-2xl md:text-3xl font-odibee text-gray-800 mb-1">{item.value}</span>
                                <span className="block text-xs font-sans text-gray-500 uppercase tracking-widest">{item.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 text-center">
                <style>{`
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-33.33%); } 
                    }
                    .animate-scroll {
                        animation: scroll 20s linear infinite;
                    }
                    /* Pause on hover if desired, user didn't ask but good UX */
                    .animate-scroll:hover {
                        animation-play-state: paused;
                    }
                `}</style>
            </div>
        </section>
    );
};

export default ImpactSection;
