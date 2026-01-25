import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEvents } from "../../services/api";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import educationImg from "@/assets/women-learning-leading.jpg";
import communityImg from "@/assets/women-supporting-each-other.jpg";
import healthcareImg from "@/assets/hero-women-empowerment.jpg";
import StandardCard from "@/components/shared/StandardCard";
import StandardPopup from "@/components/shared/StandardPopup";

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
                        <StandardCard
                            key={item._id}
                            image={item.image ? `http://localhost:8000/${item.image}` : communityImg}
                            title={item.title}
                            description={item.description}
                            raised={item.collectedAmount}
                            goal={item.requiredAmount}
                            onReadMore={() => setSelectedInitiative(item)}
                            onAction={() => {
                                navigate('/contact', {
                                    state: {
                                        section: "join-us",
                                        role: "onsite_volunteer",
                                        eventName: item.title
                                    }
                                });
                            }}
                            actionLabel="Join Us"
                            showProgress={item.requiredAmount > 0}
                        />
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
                <StandardPopup
                    isOpen={!!selectedInitiative}
                    onClose={() => setSelectedInitiative(null)}
                    image={selectedInitiative ? `http://localhost:8000/${selectedInitiative.image}` : ''}
                    title={selectedInitiative?.title || ''}
                    description={selectedInitiative?.description || ''}
                    raised={selectedInitiative ? Number(selectedInitiative.amountCollected || selectedInitiative.raised || selectedInitiative.collectedAmount || 0) : 0}
                    goal={selectedInitiative ? Number(selectedInitiative.amountRequired || selectedInitiative.goal || selectedInitiative.requiredAmount || 0) : 0}
                    statsSlot={selectedInitiative && (
                        <>
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
                        </>
                    )}
                    actionsSlot={selectedInitiative && (
                        <>
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
                        </>
                    )}
                />

            </div>
        </section>
    );
};

export default OngoingInitiatives;
