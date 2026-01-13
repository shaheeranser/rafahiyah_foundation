import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
                setCasesList(fetchedCases);

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
            <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-start overflow-hidden pt-20">
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
                        <h2 className="text-5xl md:text-6xl font-odibee text-rafahiyah-dark-blue">Programs</h2>
                    </div>

                    {/* Row 1: Programs */}
                    {loading ? (
                        <div className="text-center py-12">Loading Programs...</div>
                    ) : (
                        <>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-8">
                                {displayedPrograms.map((item, index) => (
                                    <div key={item._id || index} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-start h-full hover:shadow-xl transition-shadow duration-300">
                                        <div className="w-full h-56 rounded-2xl mb-6 overflow-hidden cursor-pointer" onClick={() => setSelectedItem(item)}>
                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={item.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                onError={(e) => { e.currentTarget.src = programImg1; }}
                                            />
                                        </div>
                                        <h3 className="text-2xl font-bold text-black mb-4 font-odibee tracking-wide">{item.title}</h3>
                                        <p className="text-gray-600 mb-8 flex-grow leading-relaxed font-sans text-sm line-clamp-3">
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
                            {renderPagination(programsList.length, programsPage, setProgramsPage)}

                            {/* Row 2: Events */}
                            <div className="text-center mb-16">
                                <br /> <br />
                                <h2 className="text-5xl md:text-6xl font-odibee text-rafahiyah-dark-blue">Events</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-8">
                                {displayedEvents.map((item, index) => (
                                    <div key={item._id || index} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-start h-full hover:shadow-xl transition-shadow duration-300">
                                        <div className="w-full h-56 rounded-2xl mb-6 overflow-hidden cursor-pointer" onClick={() => setSelectedItem(item)}>
                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={item.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                onError={(e) => { e.currentTarget.src = programImg2; }}
                                            />
                                        </div>
                                        <h3 className="text-2xl font-bold text-black mb-4 font-odibee tracking-wide">{item.title}</h3>
                                        <p className="text-gray-600 mb-2 font-bold text-xs uppercase tracking-wider">{new Date(item.date).toLocaleDateString()}</p>
                                        <p className="text-gray-600 mb-6 flex-grow leading-relaxed font-sans text-sm line-clamp-3">
                                            {item.description}
                                        </p>

                                        {/* Progress Bar for Events (if funded) */}
                                        {item.requiredAmount > 0 && (
                                            <div className="w-full mb-6">
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
                                                onClick={() => setSelectedItem(item)}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-8">
                                {displayedCases.map((caseItem, index) => (
                                    <div key={caseItem._id || index} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
                                        <div className="w-full h-56 rounded-2xl mb-6 overflow-hidden relative cursor-pointer" onClick={() => setSelectedItem(caseItem)}>
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-rafahiyah-deep-red uppercase tracking-wider z-10 shadow-sm">
                                                {caseItem.category || 'Urgent'}
                                            </div>
                                            <img
                                                src={getImageUrl(caseItem.image)}
                                                alt={caseItem.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                onError={(e) => { e.currentTarget.src = caseImg1; }}
                                            />
                                        </div>

                                        <h3 className="text-2xl font-bold text-black mb-4 font-odibee tracking-wide">{caseItem.title}</h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed font-sans text-sm min-h-[80px] line-clamp-3">
                                            {caseItem.description}
                                        </p>

                                        {/* Progress Bar Container */}
                                        <div className="w-full mb-8">
                                            <div className="flex justify-between items-center mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest font-sans">
                                                <span className="text-rafahiyah-deep-red">Raised: ${Number(caseItem.amountCollected || caseItem.raised || 0).toLocaleString()}</span>
                                                <span>Goal: ${Number(caseItem.amountRequired || caseItem.goal || 0).toLocaleString()}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-[#8B2D1B] h-full transition-all duration-1000 ease-out rounded-full"
                                                    style={{ width: `${Math.min(((caseItem.amountCollected || caseItem.raised || 0) / (caseItem.amountRequired || caseItem.goal || 1)) * 100, 100)}%` }}
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
                            {renderPagination(casesList.length, casesPage, setCasesPage)}
                        </>
                    )}
                </div>
            </section>

            {/* Detail Modal */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-4xl bg-white rounded-3xl p-6 md:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="sr-only">
                        <DialogTitle>{selectedItem?.title}</DialogTitle>
                    </DialogHeader>

                    {selectedItem && (
                        <div className="flex flex-col gap-6">
                            {/* Top Section: Image and Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left: Image */}
                                <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={getImageUrl(selectedItem.image)}
                                        alt={selectedItem.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.currentTarget.src = programImg1; }}
                                    />
                                </div>

                                {/* Right: Stats and Title */}
                                <div className="flex flex-col justify-center space-y-3 text-left">
                                    <h3 className="text-4xl font-odibee text-gray-900 mb-2">{selectedItem.title}</h3>
                                    <div className="space-y-1 font-sans text-gray-700 text-lg">
                                        {/* Display logic depending on if it's a Case or Program/Event */}
                                        {selectedItem.caseNo ? (
                                            // Case Specific
                                            <>
                                                <p>
                                                    <span className="font-semibold uppercase text-gray-900">CASE NUMBER:</span>{" "}
                                                    {selectedItem.caseNo}
                                                </p>
                                                <p>
                                                    <span className="font-semibold uppercase text-gray-900">CATEGORY:</span>{" "}
                                                    {selectedItem.category}
                                                </p>
                                                <p>
                                                    <span className="font-semibold uppercase text-gray-900">GOAL:</span>{" "}
                                                    ${(selectedItem.amountRequired || 0).toLocaleString()}
                                                </p>
                                                <p>
                                                    <span className="font-semibold uppercase text-gray-900">COLLECTED:</span>{" "}
                                                    ${(selectedItem.amountCollected || 0).toLocaleString()}
                                                </p>
                                            </>
                                        ) : (
                                            // Program/Event Specific
                                            <>
                                                <p>
                                                    <span className="font-semibold uppercase text-gray-900">DATE:</span>{" "}
                                                    {selectedItem.date ? new Date(selectedItem.date).toLocaleDateString() : (selectedItem.startingDate ? `${new Date(selectedItem.startingDate).toLocaleDateString()} - ${new Date(selectedItem.endingDate).toLocaleDateString()}` : "N/A")}
                                                </p>
                                                {selectedItem.venue && (
                                                    <p>
                                                        <span className="font-semibold uppercase text-gray-900">VENUE:</span>{" "}
                                                        {selectedItem.venue}
                                                    </p>
                                                )}
                                                {selectedItem.location && (
                                                    <p>
                                                        <span className="font-semibold uppercase text-gray-900">LOCATION:</span>{" "}
                                                        {selectedItem.location}
                                                    </p>
                                                )}

                                                {/* Financial Details for Events (if strictly an event with amount) */}
                                                {(selectedItem.requiredAmount > 0) && (
                                                    <>
                                                        <p>
                                                            <span className="font-semibold uppercase text-gray-900">TOTAL AMOUNT:</span>{" "}
                                                            ${(selectedItem.requiredAmount || 0).toLocaleString()}
                                                        </p>
                                                        <p>
                                                            <span className="font-semibold uppercase text-gray-900">COLLECTED AMOUNT:</span>{" "}
                                                            ${(selectedItem.collectedAmount || 0).toLocaleString()}
                                                        </p>
                                                        <p>
                                                            <span className="font-semibold uppercase text-gray-900">REMAINING AMOUNT:</span>{" "}
                                                            <span className="text-rafahiyah-deep-red font-bold">
                                                                ${((selectedItem.requiredAmount || 0) - (selectedItem.collectedAmount || 0)).toLocaleString()}
                                                            </span>
                                                        </p>
                                                    </>
                                                )}

                                                {/* Linked Events (For Programs) */}
                                                {selectedItem.linkedEvents && selectedItem.linkedEvents.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <p className="font-semibold uppercase text-gray-900 mb-2">Linked Events:</p>
                                                        <div className="flex flex-col gap-2">
                                                            {selectedItem.linkedEvents.map((evt: any) => (
                                                                <div key={evt._id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                                                                    <div className="font-bold text-gray-800">{evt.title}</div>
                                                                    <div className="text-gray-600 text-xs">
                                                                        {new Date(evt.date).toLocaleDateString()} | {evt.status || 'Scheduled'}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Linked Cases (For Programs) */}
                                                {selectedItem.linkedCases && selectedItem.linkedCases.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <p className="font-semibold uppercase text-gray-900 mb-2">Linked Cases:</p>
                                                        <div className="flex flex-col gap-2">
                                                            {selectedItem.linkedCases.map((cse: any) => (
                                                                <div key={cse._id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                                                                    <div className="font-bold text-gray-800">{cse.title}</div>
                                                                    <div className="text-gray-600 text-xs">
                                                                        Goal: ${cse.amountRequired?.toLocaleString()} | Collected: ${cse.amountCollected?.toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Middle Section: Description */}
                            <div className="bg-gray-100 rounded-2xl p-6 min-h-[150px] flex items-center text-gray-700 font-sans text-lg text-left">
                                <div>
                                    <p>{selectedItem.description}</p>
                                    <p className="mt-4 text-base opacity-80">
                                        This initiative requires immediate attention. Your contribution can help save lives or restore dignity to those affected. We ensure 100% transparency in funds utilization.
                                    </p>
                                </div>
                            </div>

                            {/* Bottom Section: Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-2">
                                <Button
                                    className="bg-[#242D4B] hover:bg-[#1a2138] text-white px-8 py-6 rounded-xl font-sans text-lg shadow-md transition-all"
                                    onClick={() => setSelectedItem(null)}
                                >
                                    Close
                                </Button>
                                <Button
                                    className="bg-[#852D1A] hover:bg-[#6b2416] text-white px-8 py-6 rounded-xl font-sans text-lg shadow-md transition-all"
                                    onClick={() => {
                                        if (selectedItem.caseNo) {
                                            toast.success("Proceeding to Donation...");
                                            // Handle donation logic here if needed
                                        } else {
                                            navigate('/contact', {
                                                state: {
                                                    section: "join-us",
                                                    role: "onsite_volunteer",
                                                    eventName: selectedItem.title
                                                }
                                            });
                                            setSelectedItem(null);
                                        }
                                    }}
                                >
                                    {selectedItem.caseNo ? "Donate Now" : "Join/Volounteer"}
                                </Button>
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
