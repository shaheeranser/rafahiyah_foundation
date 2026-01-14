import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Hash, Layers, Banknote, Target } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
                    const activeCases = response.data
                        .filter((c: any) => c.status === 'active')
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
        <section className="py-20 bg-[#9ca3af]">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-odibee text-gray-900 mb-12">
                    Critical Cases
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cases.map((item) => (
                        <Card key={item._id} className="bg-white rounded-3xl overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                            <div className="h-64 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                                <img
                                    src={`http://localhost:8000/${item.image?.replace(/\\/g, '/')}`}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = communityImg;
                                    }}
                                />
                            </div>

                            <CardHeader className="text-left pb-2">
                                <h3 className="text-3xl font-odibee text-gray-800 capitalize">{item.title}</h3>
                            </CardHeader>

                            <CardContent className="text-left flex-grow">
                                <p className="text-gray-500 font-sans text-lg mb-4 capitalize line-clamp-3">{item.description}</p>

                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                    <div
                                        className="bg-rafahiyah-deep-red h-2.5 rounded-full"
                                        style={{ width: `${Math.min(((item.amountCollected || 0) / item.amountRequired) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 font-sans">
                                    <span>Raised: ${item.amountCollected?.toLocaleString() || 0} / ${item.amountRequired?.toLocaleString()}</span>
                                </div>
                            </CardContent>

                            <CardFooter className="flex justify-between items-center pt-4 pb-6 px-6 gap-4">
                                <Button
                                    onClick={() => setSelectedCase(item)}
                                    className="bg-rafahiyah-gold text-rafahiyah-dark-blue hover:bg-yellow-400 hover:text-black rounded-full px-6 font-odibee text-lg tracking-wide flex-1 shadow-sm"
                                >
                                    Read More
                                </Button>
                                <Button
                                    onClick={() => navigate('/contact', { state: { section: "donate", cause: item.title } })}
                                    className="bg-rafahiyah-deep-red text-white hover:bg-[#6b2416] transition-colors rounded-full px-6 font-odibee text-lg tracking-wide flex-1 shadow-sm"
                                >
                                    Donate Now
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-12">
                    <Button
                        onClick={() => navigate('/stories#cases')}
                        className="bg-[#1E2542] text-white hover:bg-[#2a3356] border-none rounded-full px-8 py-6 font-sans shadow-md transition-all"
                    >
                        View More
                    </Button>
                </div>

                {/* Critical Case Details Modal */}
                <Dialog open={!!selectedCase} onOpenChange={(open) => !open && setSelectedCase(null)}>
                    <DialogContent className="max-w-5xl bg-white rounded-[2rem] p-0 overflow-hidden shadow-2xl">
                        <DialogHeader className="sr-only">
                            <DialogTitle>{selectedCase?.title}</DialogTitle>
                        </DialogHeader>

                        {selectedCase && (
                            <div className="flex flex-col md:flex-row h-full max-h-[90vh] md:h-auto overflow-y-auto md:overflow-visible">
                                {/* Left Side: Image */}
                                <div className="w-full md:w-2/5 h-64 md:h-auto bg-gray-100 relative">
                                    <img
                                        src={`http://localhost:8000/${selectedCase.image?.replace(/\\/g, '/')}`}
                                        alt={selectedCase.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = communityImg;
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                                    <h3 className="absolute bottom-4 left-4 text-3xl font-odibee text-white md:hidden drop-shadow-md z-10">
                                        {selectedCase.title}
                                    </h3>
                                </div>

                                {/* Right Side: Content */}
                                <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col gap-6">
                                    <h3 className="text-4xl md:text-5xl font-odibee text-gray-900 hidden md:block leading-none">
                                        {selectedCase.title}
                                    </h3>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
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
                                    </div>

                                    {/* Funding Progress */}
                                    {selectedCase.amountRequired > 0 && (
                                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
                                            <div className="flex justify-between items-end mb-1">
                                                <div className="flex items-center gap-2 text-rafahiyah-dark-blue font-bold">
                                                    <Target className="w-5 h-5" />
                                                    <span>Fundraising Progress</span>
                                                </div>
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    {Math.round(Math.min((selectedCase.amountCollected / selectedCase.amountRequired) * 100, 100))}% Funded
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className="bg-rafahiyah-deep-red h-3 rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${Math.min((selectedCase.amountCollected / selectedCase.amountRequired) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-sm font-medium pt-1">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500 uppercase">Raised</span>
                                                    <span className="text-rafahiyah-deep-red font-bold text-lg">${selectedCase.amountCollected?.toLocaleString() || 0}</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs text-gray-500 uppercase">Goal</span>
                                                    <span className="text-gray-900 font-bold text-lg">${selectedCase.amountRequired?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Description */}
                                    <div className="text-gray-600 font-sans leading-relaxed text-base max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                                        {selectedCase.description}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-auto pt-4 md:pt-0">
                                        <Button
                                            onClick={() => navigate('/contact', { state: { section: "donate", cause: selectedCase.title } })}
                                            className="w-full bg-[#852D1A] hover:bg-[#6b2416] text-white py-6 rounded-xl font-odibee text-xl tracking-wide shadow-lg transition-transform hover:scale-[1.02]"
                                        >
                                            Donate Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog >

            </div >
        </section >
    );
};

export default CriticalCases;
