import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import educationImg from "@/assets/women-learning-leading.jpg";
import communityImg from "@/assets/women-supporting-each-other.jpg";
import healthcareImg from "@/assets/hero-women-empowerment.jpg";

const OngoingInitiatives = () => {
    // Mock data based on design
    const initiatives = [
        {
            id: 1,
            title: "Clean Water Project",
            description: "Providing safe and clean drinking water to remote villages.",
            image: communityImg,
        },
        {
            id: 2,
            title: "Education for All",
            description: "Building schools and providing scholarships for underprivileged children.",
            image: educationImg,
        },
        {
            id: 3,
            title: "Healthcare Outreach",
            description: "Mobile clinics delivering essential healthcare services to rural areas.",
            image: healthcareImg,
        }
    ];

    const [selectedInitiative, setSelectedInitiative] = useState<typeof initiatives[0] | null>(null);

    return (
        <section className="py-20 bg-gray-100">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-odibee text-gray-800 mb-12">
                    Explore Our Ongoing Initiatives
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {initiatives.map((item) => (
                        <Card key={item.id} className="bg-white rounded-3xl overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                            <div className="h-64 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>

                            <CardHeader className="text-left pb-2">
                                <h3 className="text-3xl font-odibee text-gray-800 capitalize">{item.title}</h3>
                            </CardHeader>

                            <CardContent className="text-left flex-grow">
                                <p className="text-gray-500 font-sans text-lg capitalize">{item.description}</p>
                            </CardContent>

                            <CardFooter className="flex justify-between items-center pt-4 pb-6 px-6 gap-4">
                                <Button
                                    onClick={() => setSelectedInitiative(item)}
                                    className="bg-rafahiyah-gold text-rafahiyah-dark-blue hover:bg-yellow-400 hover:text-black rounded-full px-6 font-odibee text-lg tracking-wide flex-1 shadow-sm"
                                >
                                    Read More
                                </Button>
                                <Button className="bg-rafahiyah-deep-red text-white hover:bg-[#6b2416] transition-colors rounded-full px-6 font-odibee text-lg tracking-wide flex-1 shadow-sm">
                                    Join Now
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-12">
                    <Button className="bg-[#1E2542] text-white hover:bg-[#2a3356] border-none rounded-full px-8 py-6 font-sans shadow-md transition-all">
                        Discover More
                    </Button>
                </div>

                {/* Detailed Modal */}
                <Dialog open={!!selectedInitiative} onOpenChange={(open) => !open && setSelectedInitiative(null)}>
                    <DialogContent className="max-w-4xl bg-white rounded-3xl p-6 md:p-8 overflow-hidden">
                        <DialogHeader className="sr-only">
                            <DialogTitle>Initiative Details</DialogTitle>
                        </DialogHeader>

                        {selectedInitiative && (
                            <div className="flex flex-col gap-6">
                                {/* Top Section: Image and Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left: Relevant Picture Placeholder */}
                                    <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center overflow-hidden">
                                        <img src={selectedInitiative.image} alt={selectedInitiative.title} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Right: Stats and Title */}
                                    <div className="flex flex-col justify-center space-y-3 text-left">
                                        <h3 className="text-4xl font-odibee text-gray-900 mb-2">{selectedInitiative.title}</h3>
                                        <div className="space-y-1 font-sans text-gray-700 text-lg">
                                            <p><span className="font-semibold uppercase text-gray-900">DATE:</span> Oct 2023 - Present</p>
                                            <p><span className="font-semibold uppercase text-gray-900">total amount:</span> $50,000</p>
                                            <p><span className="font-semibold uppercase text-gray-900">collected amount:</span> $12,500</p>
                                            <p><span className="font-semibold uppercase text-gray-900">remaining amount:</span> $37,500</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Middle Section: Description */}
                                <div className="bg-gray-100 rounded-2xl p-6 min-h-[150px] flex items-center text-gray-700 font-sans text-lg text-left">
                                    <p>
                                        {selectedInitiative.description} This initiative aims to address critical needs in the community by focusing on sustainable solutions and long-term impact. We are working closely with local partners to ensure effective implementation and monitoring.
                                    </p>
                                </div>

                                {/* Bottom Section: Buttons */}
                                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-2">
                                    <Button className="bg-[#242D4B] hover:bg-[#1a2138] text-white px-8 py-6 rounded-xl font-sans text-lg shadow-md transition-all">
                                        Join Now
                                    </Button>
                                    <Button className="bg-[#852D1A] hover:bg-[#6b2416] text-white px-8 py-6 rounded-xl font-sans text-lg shadow-md transition-all">
                                        Donate Now
                                    </Button>
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
