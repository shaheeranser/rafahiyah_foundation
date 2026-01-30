import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Hash, Layers } from "lucide-react";
import StandardCard from "@/components/shared/StandardCard";
import StandardPopup from "@/components/shared/StandardPopup";
import { getAllCases } from "../../services/api";
import communityImg from "@/assets/women-supporting-each-other.jpg"; // Fallback
import { useNavigate } from "react-router-dom";

const CriticalCases = () => {
    const [cases, setCases] = useState<any[]>([]);
    const [selectedCase, setSelectedCase] = useState<any | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const response = await getAllCases();
                if (response.success) {
                    let fetchedCases = [];
                    // Robust data extraction
                    if (Array.isArray(response.data)) {
                        fetchedCases = response.data;
                    } else if (response.data?.cases) {
                        fetchedCases = response.data.cases;
                    } else if (response.data?.data) {
                        fetchedCases = response.data.data;
                    }

                    // Filter active and ensure amountRequired > amountCollected (Critical)
                    const activeCases = fetchedCases
                        .filter((c: any) => {
                            const status = c.status ? c.status.toLowerCase() : 'active'; // Default to active if missing
                            const required = Number(c.amountRequired || c.goal || 0);
                            const collected = Number(c.amountCollected || c.raised || 0);

                            // Check status and if funds are needed
                            return status === 'active' && collected < required;
                        })
                        .slice(0, 3);
                    setCases(activeCases);
                }
            } catch (error) {
                console.error("Error fetching cases:", error);
            }
        };

        fetchCases();
    }, []);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-odibee text-gray-900 mb-12">
                    Critical Cases
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cases.map((item) => (
                        <StandardCard
                            key={item._id}
                            image={item.image ? `http://localhost:8000/${item.image.replace(/\\/g, '/')}` : communityImg}
                            title={item.title}
                            description={item.description}
                            raised={Number(item.amountCollected || item.raised || 0)}
                            goal={Number(item.amountRequired || item.goal || 0)}
                            category={item.category || 'Urgent'}
                            onReadMore={() => setSelectedCase(item)}
                            onAction={() => navigate('/contact', { state: { section: "donate", cause: item.title } })}
                            actionLabel="Donate Now"
                            showProgress={true}
                        />
                    ))}
                </div>

                <div className="mt-12">
                    <Button
                        onClick={() => navigate('/stories#cases')}
                        className="bg-[#1E2542] text-white hover:bg-[#2a3356] border-none rounded-full px-8 py-6 font-odibee text-xl tracking-wider shadow-md transition-all"
                    >
                        View More
                    </Button>
                </div>

                {/* Critical Case Details Modal */}
                <StandardPopup
                    isOpen={!!selectedCase}
                    onClose={() => setSelectedCase(null)}
                    image={selectedCase?.image ? `http://localhost:8000/${selectedCase.image.replace(/\\/g, '/')}` : communityImg}
                    title={selectedCase?.title || ''}
                    description={selectedCase?.description || ''}
                    raised={Number(selectedCase?.amountCollected || selectedCase?.raised || selectedCase?.collectedAmount || 0)}
                    goal={Number(selectedCase?.amountRequired || selectedCase?.goal || selectedCase?.requiredAmount || 0)}
                    statsSlot={selectedCase && (
                        <>
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="p-2 bg-blue-100 rounded-lg text-rafahiyah-dark-blue">
                                    <Hash className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Case No.</p>
                                    <p className="font-semibold text-gray-800 text-sm md:text-base">{selectedCase.caseNo}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Category</p>
                                    <p className="font-semibold text-gray-800 text-sm md:text-base">{selectedCase.category}</p>
                                </div>
                            </div>
                        </>
                    )}
                    actionsSlot={
                        <Button
                            onClick={() => navigate('/contact', { state: { section: "donate", cause: selectedCase?.title } })}
                            className="w-full bg-[#852D1A] hover:bg-[#6b2416] text-white py-6 rounded-xl font-odibee text-xl tracking-wide shadow-lg transition-transform hover:scale-[1.02]"
                        >
                            Donate Now
                        </Button>
                    }
                />

            </div >
        </section >
    );
};

export default CriticalCases;
