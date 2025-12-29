import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const OngoingInitiatives = () => {
    // Mock data based on design
    const initiatives = [
        {
            id: 1,
            title: "Title",
            description: "Description",
            image: "pic 1 relevant to square",
        },
        {
            id: 2,
            title: "Title",
            description: "Description",
            image: "pic relevant relevant to square",
        },
        {
            id: 3,
            title: "Title",
            description: "Description",
            image: "picture relevant to square",
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
                            <div className="h-64 bg-gray-200 flex items-center justify-center relative">
                                {/* Placeholder Image */}
                                <span className="text-gray-400 font-medium px-4 text-center">{item.image}</span>
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
                                    <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center text-gray-500 font-medium text-lg">
                                        relevant picture
                                    </div>

                                    {/* Right: Stats and Title */}
                                    <div className="flex flex-col justify-center space-y-3 text-left">
                                        <h3 className="text-4xl font-odibee text-gray-900 mb-2">Title:</h3>
                                        <div className="space-y-1 font-sans text-gray-700 text-lg">
                                            <p><span className="font-semibold uppercase text-gray-900">DATE:</span></p>
                                            <p><span className="font-semibold uppercase text-gray-900">total amount:</span></p>
                                            <p><span className="font-semibold uppercase text-gray-900">collected amount:</span></p>
                                            <p><span className="font-semibold uppercase text-gray-900">remaining amount:</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Middle Section: Description */}
                                <div className="bg-gray-200 rounded-2xl p-6 min-h-[150px] flex items-center justify-center text-gray-500 font-medium text-lg text-center md:text-left">
                                    description text
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
