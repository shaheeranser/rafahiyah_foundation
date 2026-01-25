import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis
} from "@/components/ui/pagination";
import toast from "react-hot-toast";
import axios from "axios";

// Import Assets (Keep for fallbacks if needed, though mostly using DB images now)
import programImg1 from "@/assets/women-learning-leading.jpg";
import programImg2 from "@/assets/women-supporting-each-other.jpg";
import programImg3 from "@/assets/hero-women-empowerment.jpg";
import caseImg1 from "@/assets/success-story-woman.jpg";
import caseImg2 from "@/assets/hero-empowered-women.jpg";
import caseImg3 from "@/assets/women-learning-leading.jpg";
import StandardCard from "@/components/shared/StandardCard";
import StandardPopup from "@/components/shared/StandardPopup";
import { Hash, Layers, Calendar, MapPin, Target, Clock } from "lucide-react";

const ITEMS_PER_PAGE = 6;

const Cases = () => {
    const { hash } = useLocation();
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Dynamic Data States
    const [programsList, setProgramsList] = useState<any[]>([]);
    const [eventsList, setEventsList] = useState<any[]>([]);
    const [casesList, setCasesList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination States
    const [programsPage, setProgramsPage] = useState(1);
    const [eventsPage, setEventsPage] = useState(1);
    const [casesPage, setCasesPage] = useState(1);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

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

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [programsRes, eventsRes, casesRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/programs/getallprogram`),
                    axios.get(`${API_BASE_URL}/events/getallevent`),
                    axios.get(`${API_BASE_URL}/cases`)
                ]);

                if (programsRes.data.success) {
                    setProgramsList(programsRes.data.programs || []);
                }
                if (eventsRes.data.success) {
                    setEventsList(eventsRes.data.events || []);
                }

                // Cases API might return array directly or { success: true, cases: [...] }
                let fetchedCases = [];
                if (Array.isArray(casesRes.data)) {
                    fetchedCases = casesRes.data;
                } else if (casesRes.data.success && casesRes.data.cases) {
                    fetchedCases = casesRes.data.cases;
                } else if (casesRes.data.data) {
                    fetchedCases = casesRes.data.data;
                } else if (casesRes.data.success && Array.isArray(casesRes.data.data)) { // common standard
                    fetchedCases = casesRes.data.data;
                }
                // Filter for active and non-completed cases
                const activeCases = fetchedCases.filter((c: any) => {
                    const status = c.status ? c.status.toLowerCase() : 'active';
                    const required = Number(c.amountRequired || c.goal || 0);
                    const collected = Number(c.amountCollected || c.raised || 0);

                    // Show only if active AND not fully funded (incomplete)
                    return status === 'active' && collected < required;
                });

                setCasesList(activeCases);

            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load some content");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper to construct image URL
    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return programImg1; // Fallback
        if (imagePath.startsWith('http')) return imagePath;

        const baseUrl = API_BASE_URL.replace('/api', '');
        const normalizedPath = imagePath.replace(/\\/g, '/');

        if (normalizedPath.startsWith('uploads/')) {
            return `${baseUrl}/${normalizedPath}`;
        }
        return `${baseUrl}/uploads/images/${normalizedPath}`;
    };

    // Helper Render Pagination
    const renderPagination = (totalItems: number, currentPage: number, setPage: (page: number) => void) => {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        if (totalPages <= 1) return null;

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }

        return (
            <Pagination className="mt-8">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) setPage(currentPage - 1);
                            }}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>

                    {pages.map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                isActive={currentPage === page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(page);
                                }}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) setPage(currentPage + 1);
                            }}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        );
    };

    // Slice Data for Pagination
    const displayedPrograms = programsList.slice((programsPage - 1) * ITEMS_PER_PAGE, programsPage * ITEMS_PER_PAGE);
    const displayedEvents = eventsList.slice((eventsPage - 1) * ITEMS_PER_PAGE, eventsPage * ITEMS_PER_PAGE);
    const displayedCases = casesList.slice((casesPage - 1) * ITEMS_PER_PAGE, casesPage * ITEMS_PER_PAGE);


    return (
        <div className="min-h-screen font-sans bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-screen flex items-end md:items-center justify-start overflow-hidden pb-32 md:pb-0 bg-gray-900">
                {/* Background Overlay */}
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                    />
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
                        <h2 className="text-5xl md:text-6xl font-odibee text-rafahiyah-dark-blue">Programs</h2>
                    </div>

                    {/* Row 1: Programs */}
                    {loading ? (
                        <div className="text-center py-12">Loading Programs...</div>
                    ) : (
                        <>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                                {displayedPrograms.map((item, index) => (
                                    <StandardCard
                                        key={item._id || index}
                                        image={getImageUrl(item.image)}
                                        title={item.title}
                                        description={item.description}
                                        onReadMore={() => setSelectedItem(item)}
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
                                        showProgress={false}
                                    />
                                ))}
                            </div>
                            {renderPagination(programsList.length, programsPage, setProgramsPage)}

                            {/* Row 2: Events */}
                            <div className="text-center mb-16">
                                <br /> <br />
                                <h2 className="text-5xl md:text-6xl font-odibee text-rafahiyah-dark-blue">Events</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                                {displayedEvents.map((item, index) => (
                                    <StandardCard
                                        key={item._id || index}
                                        image={getImageUrl(item.image)}
                                        title={item.title}
                                        description={item.description}
                                        raised={item.collectedAmount}
                                        goal={item.requiredAmount}
                                        onReadMore={() => setSelectedItem(item)}
                                        onAction={() => {
                                            if (item.requiredAmount > 0) {
                                                navigate('/contact', {
                                                    state: {
                                                        section: "donate",
                                                        cause: item.title,
                                                        category: "event"
                                                    }
                                                });
                                            } else {
                                                navigate('/contact', {
                                                    state: {
                                                        section: "join-us",
                                                        role: "onsite_volunteer",
                                                        eventName: item.title
                                                    }
                                                });
                                            }
                                        }}
                                        actionLabel={item.requiredAmount > 0 ? "Donate" : "Join Us"}
                                        showProgress={item.requiredAmount > 0}
                                    />
                                ))}
                            </div>
                            {renderPagination(eventsList.length, eventsPage, setEventsPage)}
                        </>
                    )}
                </div>
            </section>

            {/* Current Cases Section */}
            <section id="cases" className="py-24 bg-[#FAFAFA]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-odibee text-[#8B2D1B]">Current Cases</h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">Loading Cases...</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                                {displayedCases.map((caseItem, index) => (
                                    <StandardCard
                                        key={caseItem._id || index}
                                        image={getImageUrl(caseItem.image)}
                                        title={caseItem.title}
                                        description={caseItem.description}
                                        raised={Number(caseItem.amountCollected || caseItem.raised || 0)}
                                        goal={Number(caseItem.amountRequired || caseItem.goal || 0)}
                                        category={caseItem.category || 'Urgent'}
                                        onReadMore={() => setSelectedItem(caseItem)}
                                        readMoreLabel="Details"
                                        onAction={() => {
                                            navigate('/contact', {
                                                state: {
                                                    section: "donate",
                                                    cause: caseItem.title
                                                }
                                            });
                                        }}
                                        actionLabel="Donate Now"
                                        showProgress={true}
                                    />
                                ))}
                            </div>
                            {renderPagination(casesList.length, casesPage, setCasesPage)}
                        </>
                    )}
                </div>
            </section>

            {/* Detail Modal */}
            <StandardPopup
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                image={selectedItem ? getImageUrl(selectedItem.image) : ''}
                title={selectedItem?.title || ''}
                description={selectedItem?.description || ''}
                raised={selectedItem ? Number(selectedItem.amountCollected || selectedItem.raised || selectedItem.collectedAmount || 0) : 0}
                goal={selectedItem ? Number(selectedItem.amountRequired || selectedItem.goal || selectedItem.requiredAmount || 0) : 0}
                statsSlot={selectedItem && (
                    <>
                        {selectedItem.caseNo && (
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="p-2 bg-blue-100 rounded-lg text-rafahiyah-dark-blue">
                                    <Hash className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Case No</p>
                                    <p className="font-semibold text-gray-800 text-sm md:text-base">{selectedItem.caseNo}</p>
                                </div>
                            </div>
                        )}
                        {selectedItem.category && (
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Category</p>
                                    <p className="font-semibold text-gray-800 text-sm md:text-base">{selectedItem.category}</p>
                                </div>
                            </div>
                        )}
                        {selectedItem.time && (
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="p-2 bg-blue-100 rounded-lg text-rafahiyah-dark-blue">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Time</p>
                                    <p className="font-semibold text-gray-800 text-sm md:text-base">{selectedItem.time}</p>
                                </div>
                            </div>
                        )}
                        {(selectedItem.date || selectedItem.startingDate) && (
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="p-2 bg-green-100 rounded-lg text-green-700">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Date</p>
                                    <p className="font-semibold text-gray-800 text-sm md:text-base">
                                        {selectedItem.date ? new Date(selectedItem.date).toLocaleDateString() : (selectedItem.startingDate ? `${new Date(selectedItem.startingDate).toLocaleDateString()} - ${new Date(selectedItem.endingDate).toLocaleDateString()}` : "")}
                                    </p>
                                </div>
                            </div>
                        )}
                        {(selectedItem.venue || selectedItem.location) && (
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="p-2 bg-red-100 rounded-lg text-rafahiyah-deep-red">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Location</p>
                                    <p className="font-semibold text-gray-800 text-sm md:text-base">{selectedItem.venue || selectedItem.location}</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
                actionsSlot={
                    selectedItem?.caseNo ? (
                        <Button
                            className="w-full bg-[#852D1A] hover:bg-[#6b2416] text-white py-6 rounded-xl font-odibee text-xl tracking-wide shadow-lg transition-transform hover:scale-[1.02]"
                            onClick={() => {
                                navigate('/contact', {
                                    state: {
                                        section: "donate",
                                        cause: selectedItem.title,
                                        category: "case"
                                    }
                                });
                                setSelectedItem(null);
                            }}
                        >
                            Donate Now
                        </Button>
                    ) : (
                        <>
                            <Button
                                className="flex-1 bg-[#242D4B] hover:bg-[#1a2138] text-white py-6 rounded-xl font-odibee text-xl tracking-wide shadow-lg transition-transform hover:scale-[1.02]"
                                onClick={() => {
                                    navigate('/contact', {
                                        state: {
                                            section: "join-us",
                                            role: "onsite_volunteer",
                                            eventName: selectedItem.title
                                        }
                                    });
                                    setSelectedItem(null);
                                }}
                            >
                                Join Us
                            </Button>
                            {selectedItem?.requiredAmount > 0 && (
                                <Button
                                    className="flex-1 bg-[#852D1A] hover:bg-[#6b2416] text-white py-6 rounded-xl font-odibee text-xl tracking-wide shadow-lg transition-transform hover:scale-[1.02]"
                                    onClick={() => {
                                        navigate('/contact', {
                                            state: {
                                                section: "donate",
                                                cause: selectedItem.title,
                                                category: "event"
                                            }
                                        });
                                        setSelectedItem(null);
                                    }}
                                >
                                    Donate Now
                                </Button>
                            )}
                        </>
                    )
                }
            />

            <Footer />
        </div>
    );
};

export default Cases;
