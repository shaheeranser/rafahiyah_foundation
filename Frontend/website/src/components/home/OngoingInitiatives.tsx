import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEvents } from "../../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Banknote, Target } from "lucide-react";
import educationImg from "@/assets/women-learning-leading.jpg";
import communityImg from "@/assets/women-supporting-each-other.jpg";
import healthcareImg from "@/assets/hero-women-empowerment.jpg";

const OngoingInitiatives = () => {
    const navigate = useNavigate();
    const [initiatives, setInitiatives] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // Mock data based on design
    // const initiatives = [
    //     {
    //         id: 1,
    //         title: "Clean Water Project",
    //         description: "Providing safe and clean drinking water to remote villages.",
    //         image: communityImg,
    //     },
    //     {
    //         id: 2,
    //         title: "Education for All",
    //         description: "Building schools and providing scholarships for underprivileged children.",
    //         image: educationImg,
    //     },
    //     {
    //         id: 3,
    //         title: "Healthcare Outreach",
    //         description: "Mobile clinics delivering essential healthcare services to rural areas.",
    //         image: healthcareImg,
    //     }
    // ];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await getAllEvents();
                if (response.success) {
                    setInitiatives(response.events);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const [selectedInitiative, setSelectedInitiative] = useState<any | null>(null);

    return (
        <section className="py-20 bg-gray-100">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-odibee text-gray-800 mb-12">
                    Explore Our Ongoing Initiatives
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {initiatives.slice(0, 3).map((item) => (
                        <div key={item._id} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-start h-full hover:shadow-xl transition-shadow duration-300">
                            <div className="w-full h-56 rounded-2xl mb-6 overflow-hidden cursor-pointer" onClick={() => setSelectedInitiative(item)}>
                                <img
                                    src={`http://localhost:8000/${item.image}`}
                                    alt={item.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.currentTarget.src = communityImg; // Fallback image
                                    }}
                                />
                            </div>

                            <h3 className="text-2xl font-bold text-black mb-4 font-odibee tracking-wide capitalize text-left w-full">{item.title}</h3>
                            <p className="text-gray-600 mb-6 flex-grow leading-relaxed font-sans text-lg line-clamp-3 text-left w-full">
                                {item.description}
                            </p>

                            {item.requiredAmount > 0 && (
                                <div className="w-full mb-6 text-left">
                                    <div className="flex justify-between items-center mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest font-sans">
                                        <span className="text-rafahiyah-deep-red">Raised: ${item.collectedAmount?.toLocaleString() || 0}</span>
                                        <span>Goal: ${item.requiredAmount?.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-[#8B2D1B] h-full transition-all duration-1000 ease-out rounded-full"
                                            style={{ width: `${Math.min(((item.collectedAmount || 0) / (item.requiredAmount || 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 w-full mt-auto">
                                <button
                                    className="flex-1 bg-[#FFD700] text-black py-3 rounded-xl text-sm font-bold font-odibee hover:bg-[#FDB931] transition-colors uppercase tracking-wider"
                                    onClick={() => setSelectedInitiative(item)}
                                >
                                    Read More
                                </button>
                                <button
                                    className="flex-1 bg-rafahiyah-deep-red text-white py-3 rounded-xl text-sm font-bold font-odibee hover:bg-[#6b2416] transition-colors uppercase tracking-wider"
                                    onClick={() => {
                                        navigate('/contact', {
                                            state: {
                                                section: "join-us",
                                                role: "onsite_volunteer",
                                                eventName: item.title
                                            }
                                        });
                                    }}
                                >
                                    Join Us
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12">
                    <Button
                        onClick={() => navigate('/stories')}
                        className="bg-[#1E2542] text-white hover:bg-[#2a3356] border-none rounded-full px-8 py-6 font-odibee tracking-wider text-xl shadow-md transition-all"
                    >
                        Discover More
                    </Button>
                </div>

                {/* Detailed Modal */}
                <Dialog open={!!selectedInitiative} onOpenChange={(open) => !open && setSelectedInitiative(null)}>
                    <DialogContent className="max-w-5xl bg-white rounded-[2rem] p-0 overflow-hidden shadow-2xl">
                        <DialogHeader className="sr-only">
                            <DialogTitle>{selectedInitiative?.title}</DialogTitle>
                        </DialogHeader>

                        {selectedInitiative && (
                            <div className="flex flex-col md:flex-row h-full max-h-[90vh] md:h-auto overflow-y-auto md:overflow-visible">
                                {/* Left Side: Image */}
                                <div className="w-full md:w-2/5 h-64 md:h-auto bg-gray-100 relative">
                                    <img
                                        src={`http://localhost:8000/${selectedInitiative.image}`}
                                        alt={selectedInitiative.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = communityImg;
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                                    <h3 className="absolute bottom-4 left-4 text-3xl font-odibee text-white md:hidden drop-shadow-md z-10">
                                        {selectedInitiative.title}
                                    </h3>
                                </div>

                                {/* Right Side: Content */}
                                <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col gap-6">
                                    <h3 className="text-4xl md:text-5xl font-odibee text-rafahiyah-dark-blue hidden md:block leading-none">
                                        {selectedInitiative.title}
                                    </h3>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedInitiative.time && (
                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <div className="p-2 bg-blue-100 rounded-lg text-rafahiyah-dark-blue">
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Time</p>
                                                    <p className="font-semibold text-gray-800 text-sm md:text-base">{selectedInitiative.time}</p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedInitiative.date && (
                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <div className="p-2 bg-green-100 rounded-lg text-green-700">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Date</p>
                                                    <p className="font-semibold text-gray-800 text-sm md:text-base">{new Date(selectedInitiative.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedInitiative.location && (
                                            <div className="col-span-2 flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <div className="p-2 bg-red-100 rounded-lg text-rafahiyah-deep-red">
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Location</p>
                                                    <p className="font-semibold text-gray-800 text-sm md:text-base">{selectedInitiative.location}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Funding Progress */}
                                    {selectedInitiative.requiredAmount > 0 && (
                                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
                                            <div className="flex justify-between items-end mb-1">
                                                <div className="flex items-center gap-2 text-rafahiyah-dark-blue font-bold">
                                                    <Target className="w-5 h-5" />
                                                    <span>Goal Progress</span>
                                                </div>
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    {Math.round(Math.min((selectedInitiative.collectedAmount / selectedInitiative.requiredAmount) * 100, 100))}% Funded
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className="bg-rafahiyah-deep-red h-3 rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${Math.min((selectedInitiative.collectedAmount / selectedInitiative.requiredAmount) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-sm font-medium pt-1">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500 uppercase">Raised</span>
                                                    <span className="text-rafahiyah-deep-red font-bold text-lg">${selectedInitiative.collectedAmount?.toLocaleString() || 0}</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs text-gray-500 uppercase">Goal</span>
                                                    <span className="text-gray-900 font-bold text-lg">${selectedInitiative.requiredAmount?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Description */}
                                    <div className="text-gray-600 font-sans leading-relaxed text-base max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                                        {selectedInitiative.description}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-4 mt-auto pt-4 md:pt-0">
                                        <Button
                                            className="flex-1 bg-[#242D4B] hover:bg-[#1a2138] text-white py-6 rounded-xl font-odibee text-xl tracking-wide shadow-lg transition-transform hover:scale-[1.02]"
                                            onClick={() => {
                                                navigate('/contact', {
                                                    state: {
                                                        section: "join-us",
                                                        role: "onsite_volunteer",
                                                        eventName: selectedInitiative.title
                                                    }
                                                });
                                            }}
                                        >
                                            Join as Volunteer
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                navigate('/contact', {
                                                    state: {
                                                        section: "donate",
                                                        cause: selectedInitiative.title
                                                    }
                                                });
                                            }}
                                            className="flex-1 bg-[#852D1A] hover:bg-[#6b2416] text-white py-6 rounded-xl font-odibee text-xl tracking-wide shadow-lg transition-transform hover:scale-[1.02]"
                                        >
                                            Donate Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

            </div>
        </section>
    );
};

export default OngoingInitiatives;
