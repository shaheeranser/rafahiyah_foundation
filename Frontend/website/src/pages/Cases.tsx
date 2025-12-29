import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Cases = () => {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace("#", ""));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash]);

    const programs = [
        { title: "title", description: "description" },
        { title: "title", description: "description" },
        { title: "title", description: "description" },
        { title: "title", description: "description" },
        { title: "title", description: "description" },
        { title: "title", description: "description" },
    ];

    const currentCases = [
        { title: "title", description: "description", raised: 5000, goal: 10000 },
        { title: "title", description: "description", raised: 7500, goal: 10000 },
        { title: "title", description: "description", raised: 3000, goal: 10000 },
    ];

    return (
        <div className="min-h-screen font-sans bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-start overflow-hidden pt-20">
                {/* Background Overlay */}
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute inset-0 z-0 bg-[#E5E5E5]" />

                {/* BG text placeholder at bottom right */}
                <div className="absolute bottom-10 right-10 z-20 text-gray-500 font-medium italic">
                    (a bg image from drive)
                </div>

                <div className="container mx-auto px-4 relative z-20">
                    <div className="max-w-4xl text-left">
                        <h1 className="text-6xl md:text-8xl font-odibee text-white mb-6 drop-shadow-lg leading-[0.9] tracking-tight">
                            Traverse Through Our Active <br /> Events and Programs
                        </h1>
                        <p className="text-2xl md:text-3xl font-odibee text-rafahiyah-gold drop-shadow-md">
                            From Events to Projects & Collaborations, <br /> There's Something For Everyone
                        </p>
                    </div>
                </div>
            </section>

            {/* Events & Programs Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-odibee text-rafahiyah-dark-blue">Events & Programs</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {programs.map((item, index) => (
                            <div key={index} className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-start h-full">
                                <div className="w-full h-40 bg-[#D9D9D9] rounded-2xl mb-8 flex items-center justify-center text-gray-500 text-sm italic p-4 text-center">
                                    picture relevant to program
                                </div>
                                <h3 className="text-2xl font-bold text-black mb-4">{item.title}</h3>
                                <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
                                    {item.description}
                                </p>
                                <div className="flex gap-4 w-full">
                                    <button className="flex-1 bg-[#D9D9D9] text-black py-2 rounded-xl text-sm font-medium hover:bg-gray-300 transition-colors">
                                        read more
                                    </button>
                                    <button className="flex-1 bg-[#D9D9D9] text-black py-2 rounded-xl text-sm font-medium hover:bg-gray-300 transition-colors">
                                        join button
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Current Cases Section */}
            <section id="cases" className="py-24 bg-[#FAFAFA]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-odibee text-[#8B2D1B]">Current Cases</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {currentCases.map((caseItem, index) => (
                            <div key={index} className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col h-full">
                                <div className="w-full h-48 bg-[#D9D9D9] rounded-2xl mb-8 flex items-center justify-center text-gray-500 text-sm italic p-4 text-center">
                                    picture relevant to case
                                </div>

                                <h3 className="text-2xl font-bold text-black mb-4">{caseItem.title}</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {caseItem.description}
                                </p>

                                {/* Progress Bar Container */}
                                <div className="w-full mb-10">
                                    <div className="flex justify-between items-center mb-2 text-xs font-medium text-gray-500 uppercase tracking-widest">
                                        <span>Raised: ${caseItem.raised}</span>
                                        <span>Goal: ${caseItem.goal}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-[#8B2D1B] h-full transition-all duration-1000 ease-out"
                                            style={{ width: `${(caseItem.raised / caseItem.goal) * 100}%` }}
                                        />
                                    </div>
                                    <p className="mt-2 text-[10px] text-gray-400 font-medium italic">(dynamic amount raised bar)</p>
                                </div>

                                <div className="flex gap-4 w-full mt-auto">
                                    <button className="flex-1 bg-[#D9D9D9] text-black py-2 rounded-xl text-sm font-medium hover:bg-gray-300 transition-colors">
                                        read more
                                    </button>
                                    <button className="flex-1 bg-[#D9D9D9] text-black py-2 rounded-xl text-sm font-medium hover:bg-gray-300 transition-colors">
                                        donate button
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Cases;
