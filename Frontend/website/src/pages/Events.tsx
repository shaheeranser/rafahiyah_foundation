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
import eventImg1 from "@/assets/hero-empowered-women.jpg";
import eventImg2 from "@/assets/success-story-woman.jpg";
import eventImg3 from "@/assets/women-learning-leading.jpg";
import eventImg4 from "@/assets/women-supporting-each-other.jpg";

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [viewMoreEvent, setViewMoreEvent] = useState<any>(null);
  const [search, setSearch] = useState("");

  // Mock Data for Demo
  const events = [
    {
      _id: "1",
      title: "Annual Charity Gala",
      description: "Join us for an evening of inspiration and giving. Our annual gala brings together donors, volunteers, and community leaders to celebrate our achievements and raise funds for future initiatives.",
      image: eventImg1,
      date: "2023-12-15",
      day: "Friday",
      time: "6:00 PM - 10:00 PM"
    },
    {
      _id: "2",
      title: "Health & Wellness Fair",
      description: "A community event promoting health and wellness. Free screenings, fitness activities, and nutritional workshops for families.",
      image: eventImg2,
      date: "2024-01-20",
      day: "Saturday",
      time: "9:00 AM - 3:00 PM"
    },
    {
      _id: "3",
      title: "Youth Tech Symposium",
      description: "Empowering the next generation with technology skills. Interactive workshops on coding, robotics, and digital literacy for youth.",
      image: eventImg3,
      date: "2024-02-10",
      day: "Saturday",
      time: "10:00 AM - 4:00 PM"
    },
    {
      _id: "4",
      title: "Women's Day Celebration",
      description: "Celebrating the achievements of women in our community. Inspirational talks, cultural performances, and networking opportunities.",
      image: eventImg4,
      date: "2024-03-08",
      day: "Friday",
      time: "2:00 PM - 6:00 PM"
    }
  ];

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  const handleRegister = (event) => {
    toast.success("Registration demo: You have clicked Participate!");
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 lg:pt-24 pb-16 bg-gradient-to-br from-section-soft to-gentle-rose mt-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold font-odibee text-primary mb-6">
            Explore Our Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-sans">
            Discover opportunities to engage and empower in your community.
          </p>
          <div className="max-w-md mx-auto flex gap-2 mt-8">
            <Input
              type="text"
              placeholder="Search events by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xl mx-auto bg-white"
            />
            <Button onClick={() => { }}>Search</Button>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center font-odibee text-primary mb-12">
            Upcoming Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Card
                key={event._id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 border-none shadow-md"
              >
                <div
                  className="relative group cursor-pointer aspect-video overflow-hidden"
                  onClick={() => setSelectedEvent({ ...event, showOverlay: true })}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-primary font-odibee text-2xl">{event.title}</CardTitle>
                  <div className="text-sm text-muted-foreground mb-2 flex items-center">
                    <Calendar className="inline-block h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-3 text-gray-600 font-sans">
                    {event.description}
                  </CardDescription>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="w-1/2 text-primary border-primary hover:bg-primary/10 transition font-odibee tracking-wide text-lg"
                      onClick={() => setViewMoreEvent(event)}
                    >
                      View More
                    </Button>
                    <Button
                      className="w-1/2 bg-rafahiyah-deep-red hover:bg-[#6b2416] text-white font-odibee tracking-wide text-lg"
                      onClick={() => setSelectedEvent(event)}
                    >
                      Participate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Image Overlay */}
      {selectedEvent?.showOverlay && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
          <div className="max-w-4xl w-full relative animate-fadeInSlide" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/40 rounded-full"
              onClick={() => setSelectedEvent(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* View More Modal */}
      <Dialog open={!!viewMoreEvent} onOpenChange={(open) => !open && setViewMoreEvent(null)}>
        <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 overflow-hidden">
          <div className="relative h-64">
            {viewMoreEvent && (
              <img
                src={viewMoreEvent.image}
                alt={viewMoreEvent.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-primary font-odibee mb-2">{viewMoreEvent?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 font-sans">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  {viewMoreEvent && new Date(viewMoreEvent.date).toLocaleDateString()}
                </span>
                <span className="mx-2">|</span>
                <span>{viewMoreEvent?.day} {viewMoreEvent?.time}</span>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {viewMoreEvent?.description}
              </p>
              <Button
                className="w-full bg-primary text-white hover:bg-primary/90 mt-4"
                onClick={() => setViewMoreEvent(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <Dialog open={!!(selectedEvent && !selectedEvent.showOverlay)} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-lg bg-white rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary font-odibee">Register for {selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 font-sans">
            <Input placeholder="First Name" />
            <Input placeholder="Last Name" />
            <Input type="email" placeholder="Email" />
            <Input placeholder="Phone Number" />
            <Button className="w-full bg-rafahiyah-deep-red hover:bg-[#6b2416]" onClick={() => {
              toast.success("Application Submitted Successfully (Demo)");
              setSelectedEvent(null);
            }}>
              Confirm Participation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Events;
