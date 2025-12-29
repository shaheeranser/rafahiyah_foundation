import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Import Assets
import educationImg from "@/assets/women-learning-leading.jpg";
import healthImg from "@/assets/hero-empowered-women.jpg";
import communityImg from "@/assets/women-supporting-each-other.jpg";
import workshopImg from "@/assets/success-story-woman.jpg";

const Programs = () => {
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [viewMoreProgram, setViewMoreProgram] = useState<any>(null);
  const [search, setSearch] = useState("");

  // Mock Data for Demo
  const programs = [
    {
      _id: "1",
      title: "Women Leadership Workshop",
      description: "A comprehensive workshop designed to empower women with leadership skills, public speaking confidence, and strategic thinking capabilities to excel in their careers and communities.",
      image: educationImg,
      startingDate: "2023-11-15",
      endingDate: "2023-11-17",
      day: "Friday - Sunday",
      time: "10:00 AM - 4:00 PM"
    },
    {
      _id: "2",
      title: "Community Health Camp",
      description: "Free medical checkups and health awareness sessions for women and children. Includes basic screenings, nutritional advice, and distribution of essential vitamins.",
      image: healthImg,
      startingDate: "2023-12-05",
      endingDate: "2023-12-05",
      day: "Tuesday",
      time: "9:00 AM - 5:00 PM"
    },
    {
      _id: "3",
      title: "Clean Water Initiative",
      description: "Installation of water filtration plants in remote areas. Join us for the inauguration and awareness session on safe drinking water practices.",
      image: communityImg,
      startingDate: "2024-01-10",
      endingDate: "2024-01-10",
      day: "Wednesday",
      time: "11:00 AM - 2:00 PM"
    },
    {
      _id: "4",
      title: "Vocational Skills Training",
      description: "Hands-on training program teaching sewing, embroidery, and handicrafts to help women achieve financial independence and support their families.",
      image: workshopImg,
      startingDate: "2024-02-01",
      endingDate: "2024-03-01",
      day: "Mon - Thu",
      time: "2:00 PM - 5:00 PM"
    }
  ];

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  const handleparticipate = (programId: string) => {
    toast.success("Registration demo: You have clicked Enroll!");
    // In a real app, check auth and send API request
  };

  const filteredPrograms = programs.filter((program) =>
    program.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      <section className="pt-20 lg:pt-24 pb-16 bg-gradient-to-br from-section-soft to-lilac mt-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold font-odibee text-primary mb-6">
            Explore Our Core Programs
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-sans">
            Engage in transformative opportunities designed for empowerment.
          </p>
        </div>

        <div className="max-w-md mx-auto flex gap-2 mt-8">
          <div className="container mx-auto px-4 mb-2">
            <Input
              type="text"
              placeholder="Search programs by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xl mx-auto bg-white"
            />
          </div>
          <Button onClick={() => { }}>Search</Button>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center font-odibee text-primary mb-12">
            Core Programs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <Card
                key={program._id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 border-none shadow-md"
              >
                <div className="relative group aspect-video overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-primary font-odibee text-2xl">{program.title}</CardTitle>
                  <div className="text-sm text-muted-foreground mb-2 flex items-center">
                    <Calendar className="inline-block h-4 w-4 mr-2" />
                    {new Date(program.startingDate).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-3 text-gray-600 font-sans">
                    {program.description}
                  </CardDescription>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="w-1/2 text-primary border-primary hover:bg-primary/10 transition font-odibee tracking-wide text-lg"
                      onClick={() => setViewMoreProgram(program)}
                    >
                      View More
                    </Button>
                    <Button
                      className="w-1/2 bg-rafahiyah-deep-red hover:bg-[#6b2416] text-white font-odibee tracking-wide text-lg"
                      onClick={() => setSelectedProgram(program)}
                    >
                      Enroll
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Register Modal */}
      <Dialog open={!!selectedProgram} onOpenChange={(open) => !open && setSelectedProgram(null)}>
        <DialogContent className="max-w-lg bg-white rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary font-odibee">Register for {selectedProgram?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 font-sans">
            <Input placeholder="First Name" />
            <Input placeholder="Last Name" />
            <Input type="email" placeholder="Email" />
            <Input placeholder="Phone Number" />
            <Button className="w-full bg-rafahiyah-deep-red hover:bg-[#6b2416]" onClick={() => {
              toast.success("Application Submitted Successfully (Demo)");
              setSelectedProgram(null);
            }}>
              Submit Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View More Modal */}
      <Dialog open={!!viewMoreProgram} onOpenChange={(open) => !open && setViewMoreProgram(null)}>
        <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 overflow-hidden">
          <div className="relative h-64">
            {viewMoreProgram && (
              <img
                src={viewMoreProgram.image}
                alt={viewMoreProgram.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-primary font-odibee mb-2">{viewMoreProgram?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 font-sans">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  {viewMoreProgram && new Date(viewMoreProgram.startingDate).toLocaleDateString()} - {viewMoreProgram && new Date(viewMoreProgram.endingDate).toLocaleDateString()}
                </span>
                <span className="mx-2">|</span>
                <span>{viewMoreProgram?.day} {viewMoreProgram?.time}</span>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {viewMoreProgram?.description}
              </p>
              <Button
                className="w-full bg-primary text-white hover:bg-primary/90 mt-4"
                onClick={() => setViewMoreProgram(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Programs;
