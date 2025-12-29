import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import medicalCaseImg from "@/assets/success-story-woman.jpg";
import emergencyCaseImg from "@/assets/hero-empowered-women.jpg";
import educationCaseImg from "@/assets/women-learning-leading.jpg";

const CriticalCases = () => {
    // Mock data based on design
    const cases = [
        {
            id: 1,
            title: "Urgent Medical Aid",
            description: "Providing life-saving surgery for children with congenital heart defects.",
            image: medicalCaseImg,
            amountNeeded: 120000,
            raised: 60000,
            category: "Medical",
            caseNumber: "CASE-001"
        },
        {
            id: 2,
            title: "Flood Relief Support",
            description: "Emergency shelter and food supplies for families displaced by recent floods.",
            image: emergencyCaseImg,
            amountNeeded: 50000,
            raised: 12000,
            category: "Emergency",
            caseNumber: "CASE-002"
        },
        {
            id: 3,
            title: "School Reconstruction",
            description: "Rebuilding a girls' school destroyed by earthquake to restore education.",
            image: educationCaseImg,
            amountNeeded: 85000,
            raised: 80000,
            category: "Education",
            caseNumber: "CASE-003"
        }
    ];

    const [selectedCase, setSelectedCase] = useState<typeof cases[0] | null>(null);

    return (
        <section className="py-20 bg-[#9ca3af]"> {/* Gray background from design */}
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-odibee text-gray-900 mb-12">
                    Critical Cases
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cases.map((item) => (
                        <Card key={item.id} className="bg-white rounded-3xl overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                            <div className="h-64 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>

                            <CardHeader className="text-left pb-2">
                                <h3 className="text-3xl font-odibee text-gray-800 capitalize">{item.title}</h3>
                            </CardHeader>

                            <CardContent className="text-left flex-grow">
                                <p className="text-gray-500 font-sans text-lg mb-4 capitalize">{item.description}</p>

                                {/* Donation Progress (Optional/Implied) - Adding simplified progress bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                    <div
                                        className="bg-rafahiyah-deep-red h-2.5 rounded-full"
                                        style={{ width: `${(item.raised / item.amountNeeded) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 font-sans">
                                    <span>Raised: ${item.raised.toLocaleString()} / ${item.amountNeeded.toLocaleString()}</span>
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
                    <Button className="bg-[#1E2542] text-white hover:bg-[#2a3356] border-none rounded-full px-8 py-6 font-sans shadow-md transition-all">
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
                                        <img src={selectedCase.image} alt={selectedCase.title} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Right: Case Info */}
                                    <div className="flex flex-col justify-center space-y-3 text-left">
                                        <h3 className="text-4xl font-odibee text-gray-900 mb-2">{selectedCase.title}</h3>
                                        <div className="space-y-1 font-sans text-gray-700 text-lg">
                                            <p><span className="font-semibold text-gray-900">CASE NUMBER:</span> {selectedCase.caseNumber}</p>
                                            <p><span className="font-semibold text-gray-900">CATEGORY:</span> {selectedCase.category}</p>
                                            <p><span className="font-semibold text-gray-900">TOTAL AMOUNT:</span> ${selectedCase.amountNeeded.toLocaleString()}</p>
                                            <p><span className="font-semibold text-gray-900">COLLECTED AMOUNT:</span> ${selectedCase.raised.toLocaleString()}</p>
                                            <p><span className="font-semibold text-gray-900">REMAINING AMOUNT:</span> ${(selectedCase.amountNeeded - selectedCase.raised).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Grid: Description and Action */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* Description (Span 2 cols) */}
                                    <div className="md:col-span-2 bg-gray-200 rounded-2xl p-6 min-h-[150px] flex items-center text-gray-700 font-sans text-lg text-left">
                                        <p>
                                            {selectedCase.description} This critical case requires immediate attention. Your contribution can help save lives or restore dignity to those affected. We ensure 100% transparency in funds utilization.
                                        </p>
                                    </div>

                                    {/* Donate Action (Span 1 col) */}
                                    <div className="flex flex-col justify-end gap-2">
                                        <div className="bg-gray-200 text-gray-600 text-center py-2 px-4 rounded-md text-sm font-semibold">
                                            Urgent Need
                                        </div>
                                        <Button className="w-full bg-[#852D1A] hover:bg-[#6b2416] text-white py-6 rounded-xl font-sans text-lg shadow-md transition-all">
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

export default CriticalCases;
