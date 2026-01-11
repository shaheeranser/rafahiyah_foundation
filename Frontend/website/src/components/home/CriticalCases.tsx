import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
                                <Button className="bg-rafahiyah-deep-red text-white hover:bg-[#6b2416] transition-colors rounded-full px-6 font-odibee text-lg tracking-wide flex-1 shadow-sm">
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
                    <DialogContent className="max-w-4xl bg-white rounded-3xl p-6 md:p-8 overflow-hidden">
                        <DialogHeader className="sr-only">
                            <DialogTitle>Case Details</DialogTitle>
                        </DialogHeader>

                        {selectedCase && (
                            <div className="flex flex-col gap-6">
                                {/* Top Section: Image and Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left: Relevant Picture Placeholder */}
                                    <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={`http://localhost:8000/${selectedCase.image?.replace(/\\/g, '/')}`}
                                            alt={selectedCase.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = communityImg;
                                            }}
                                        />
                                    </div>

                                    {/* Right: Case Info */}
                                    <div className="flex flex-col justify-center space-y-3 text-left">
                                        <h3 className="text-4xl font-odibee text-gray-900 mb-2">{selectedCase.title}</h3>
                                        <div className="space-y-1 font-sans text-gray-700 text-lg">
                                            <p><span className="font-semibold text-gray-900">CASE NUMBER:</span> {selectedCase.caseNo}</p>
                                            <p><span className="font-semibold text-gray-900">CATEGORY:</span> {selectedCase.category}</p>
                                            <p><span className="font-semibold text-gray-900">TOTAL AMOUNT:</span> ${selectedCase.amountRequired?.toLocaleString()}</p>
                                            <p><span className="font-semibold text-gray-900">COLLECTED AMOUNT:</span> ${selectedCase.amountCollected?.toLocaleString() || 0}</p>
                                            <p><span className="font-semibold text-gray-900">REMAINING AMOUNT:</span> ${((selectedCase.amountRequired || 0) - (selectedCase.amountCollected || 0)).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Grid: Description and Action */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* Description (Span 2 cols) */}
                                    <div className="md:col-span-2 bg-gray-200 rounded-2xl p-6 min-h-[150px] flex items-center text-gray-700 font-sans text-lg text-left">
                                        <p>
                                            {selectedCase.description}
                                        </p>
                                    </div>

                                    {/* Donate Action (Span 1 col) */}
                                    <div className="flex flex-col justify-end gap-2">
                                        <Button className="w-full bg-[#852D1A] hover:bg-[#6b2416] text-white py-6 rounded-xl font-sans text-lg shadow-md transition-all">
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
