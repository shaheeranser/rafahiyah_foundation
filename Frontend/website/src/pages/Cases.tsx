import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import toast from "react-hot-toast";

// Import Assets
import programImg1 from "@/assets/women-learning-leading.jpg";
import programImg2 from "@/assets/women-supporting-each-other.jpg";
import programImg3 from "@/assets/hero-women-empowerment.jpg";
import caseImg1 from "@/assets/success-story-woman.jpg";
import caseImg2 from "@/assets/hero-empowered-women.jpg";
import caseImg3 from "@/assets/women-learning-leading.jpg";

const Cases = () => {
    const { hash } = useLocation();
    const [selectedItem, setSelectedItem] = useState<any>(null);

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
        {
            _id: "P001",
            title: "Community Outreach",
            description: "Engaging directly with local communities to understand their needs and provide immediate support through food, clothing, and shelter assistance.",
            image: programImg1
        },
        {
            _id: "P002",
            title: "Health Awareness",
            description: "Conducting workshops and seminars to educate families about hygiene, nutrition, and disease prevention to foster healthier communities.",
            image: programImg2
        },
        {
            _id: "P003",
            title: "Water Safety",
            description: "Implementing sustainable water filtration systems and educating villagers on the importance of clean drinking water for a healthy life.",
            image: programImg3
        },
    ];

    const currentCases = [
        {
            _id: "001",
            title: "Urgent Heart Surgery",
            description: "Baby Zainab needs an urgent heart surgery to correct a congenital defect. Your donation can save her life and give her a bright future.",
            raised: 5000,
            goal: 10000,
            image: caseImg1
        },
        {
            _id: "002",
            title: "Flood Relief Fund",
            description: "Families displaced by recent floods are in desperate need of food, dry rations, and tents. Help us provide them with immediate relief.",
            raised: 7500,
            goal: 12000,
            image: caseImg2
        },
        {
            _id: "003",
            title: "School Rebuilding",
            description: "Rebuilding a dilapidated school in a remote village to ensure children have a safe and conducive environment for learning.",
            raised: 3000,
            goal: 15000,
            image: caseImg3
        },
    ];

    return (
        <div className="min-h-screen font-sans bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-start overflow-hidden pt-20">
                {/* Background Overlay */}
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="absolute inset-0 z-0">
                    <img
                        src={programImg2}
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="container mx-auto px-4 relative z-20">
                    <div className="max-w-4xl text-left">
                        <h1 className="text-5xl md:text-8xl font-odibee text-white mb-6 drop-shadow-lg leading-[0.9] tracking-tight">
                            Traverse Through Our Active <br /> Events and Programs
                        </h1>
                        <p className="text-xl md:text-3xl font-odibee text-rafahiyah-gold drop-shadow-md">
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
                            <div key={index} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-start h-full hover:shadow-xl transition-shadow duration-300">
                                <div className="w-full h-56 rounded-2xl mb-6 overflow-hidden cursor-pointer" onClick={() => setSelectedItem(item)}>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-black mb-4 font-odibee tracking-wide">{item.title}</h3>
                                <p className="text-gray-600 mb-8 flex-grow leading-relaxed font-sans text-sm">
                                    {item.description}
                                </p>
                                <div className="flex gap-4 w-full mt-auto">
                                    <button
                                        className="flex-1 bg-[#FFD700] text-black py-3 rounded-xl text-sm font-bold font-odibee hover:bg-[#FDB931] transition-colors uppercase tracking-wider"
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        Read More
                                    </button>
                                    <button
                                        className="flex-1 bg-rafahiyah-deep-red text-white py-3 rounded-xl text-sm font-bold font-odibee hover:bg-[#6b2416] transition-colors uppercase tracking-wider"
                                        onClick={() => toast.success("Join Us request simulated")}
                                    >
                                        Join Us
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
                            <div key={index} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
                                <div className="w-full h-56 rounded-2xl mb-6 overflow-hidden relative cursor-pointer" onClick={() => setSelectedItem(caseItem)}>
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-rafahiyah-deep-red uppercase tracking-wider z-10 shadow-sm">
                                        Urgent
                                    </div>
                                    <img
                                        src={caseItem.image}
                                        alt={caseItem.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                <h3 className="text-2xl font-bold text-black mb-4 font-odibee tracking-wide">{caseItem.title}</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed font-sans text-sm min-h-[80px]">
                                    {caseItem.description}
                                </p>

                                {/* Progress Bar Container */}
                                <div className="w-full mb-8">
                                    <div className="flex justify-between items-center mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest font-sans">
                                        <span className="text-rafahiyah-deep-red">Raised: ${caseItem.raised.toLocaleString()}</span>
                                        <span>Goal: ${caseItem.goal.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-[#8B2D1B] h-full transition-all duration-1000 ease-out rounded-full"
                                            style={{ width: `${(caseItem.raised / caseItem.goal) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 w-full mt-auto">
                                    <button
                                        className="flex-1 bg-[#FFD700] text-black py-3 rounded-xl text-sm font-bold font-odibee hover:bg-[#FDB931] transition-colors uppercase tracking-wider"
                                        onClick={() => setSelectedItem(caseItem)}
                                    >
                                        Details
                                    </button>
                                    <button
                                        className="flex-1 bg-rafahiyah-deep-red text-white py-3 rounded-xl text-sm font-bold font-odibee hover:bg-[#6b2416] transition-colors uppercase tracking-wider shadow-md hover:shadow-lg"
                                        onClick={() => toast.success("Donation flow simulated")}
                                    >
                                        Donate Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Detail Modal */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-4xl bg-white rounded-3xl p-6 md:p-8 overflow-hidden">
                    {selectedItem && (
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Left Side: Image */}
                                <div className="w-full md:w-5/12">
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
                                        <img
                                            src={selectedItem.image}
                                            alt={selectedItem.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Right Side: Title & Stats */}
                                <div className="w-full md:w-7/12 space-y-6">
                                    <div>
                                        <h2 className="text-4xl md:text-5xl font-odibee text-rafahiyah-dark-blue mb-2">
                                            {selectedItem.title}
                                        </h2>
                                    </div>

                                    <div className="space-y-3 font-sans text-sm md:text-base">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900 uppercase tracking-wide">CASE NUMBER:</span>
                                            <span className="text-gray-600">CASE-{selectedItem._id || Math.floor(Math.random() * 1000).toString().padStart(3, '0')}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900 uppercase tracking-wide">CATEGORY:</span>
                                            <span className="text-gray-600">{selectedItem.goal ? "Medical / Relief" : "Community Program"}</span>
                                        </div>

                                        {selectedItem.goal ? (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900 uppercase tracking-wide">TOTAL AMOUNT:</span>
                                                    <span className="text-gray-600">${selectedItem.goal.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900 uppercase tracking-wide">COLLECTED AMOUNT:</span>
                                                    <span className="text-gray-600">${selectedItem.raised.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900 uppercase tracking-wide">REMAINING AMOUNT:</span>
                                                    <span className="text-rafahiyah-deep-red font-bold">${(selectedItem.goal - selectedItem.raised).toLocaleString()}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900 uppercase tracking-wide">STATUS:</span>
                                                <span className="text-emerald-600 font-bold">Active Program</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section: Description & Actions */}
                            <div className="flex flex-col md:flex-row gap-8 items-stretch">
                                {/* Description Box */}
                                <div className="w-full md:w-8/12 bg-gray-100 rounded-2xl p-6 text-gray-700 leading-relaxed font-sans text-sm md:text-base">
                                    <p>{selectedItem.description}</p>
                                    <p className="mt-4">
                                        This initiative requires immediate attention. Your contribution can help save lives or restore dignity to those affected. We ensure 100% transparency in funds utilization.
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="w-full md:w-4/12 flex flex-col justify-end gap-3">
                                    <Button
                                        variant="secondary"
                                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-6 rounded-xl shadow-sm text-lg"
                                        onClick={() => setSelectedItem(null)}
                                    >
                                        {selectedItem.goal ? "Urgent Need" : "View Schedule"}
                                    </Button>
                                    <Button
                                        className="w-full bg-[#8B2D1B] hover:bg-[#6b2416] text-white font-bold py-6 rounded-xl shadow-md text-lg transition-transform hover:scale-[1.02]"
                                        onClick={() => {
                                            toast.success(selectedItem.goal ? "Proceeding to Donation..." : "Application Started");
                                            setSelectedItem(null);
                                        }}
                                    >
                                        {selectedItem.goal ? "Donate Now" : "Join Now"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
};

export default Cases;
