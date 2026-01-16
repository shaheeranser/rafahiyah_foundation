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
    <div className="min-h-screen bg-white font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-start overflow-hidden pt-20">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 z-0">
          <img
            src={eventImg1}
            alt="Events Hero"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full px-6 md:px-32 relative z-20">
          <div className="max-w-4xl text-left">
            <h1 className="text-5xl md:text-8xl font-odibee text-white mb-6 drop-shadow-lg leading-none">
              Explore Our Events
            </h1>
            <p className="text-xl md:text-3xl font-odibee text-rafahiyah-gold drop-shadow-md">
              Discover opportunities to engage and empower in your community.
            </p>
            <div className="max-w-md flex gap-2 mt-8">
              <Input
                type="text"
                placeholder="Search events by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xl bg-white/90 backdrop-blur-sm border-none h-12 rounded-xl text-black placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-odibee text-rafahiyah-dark-blue">
              Upcoming Events
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredEvents.map((event) => (
              <Card
                key={event._id}
                className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className="w-full h-56 rounded-2xl mb-6 overflow-hidden relative cursor-pointer group"
                  onClick={() => setSelectedEvent({ ...event, showOverlay: true })}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <h3 className="text-2xl font-bold text-black mb-2 font-odibee tracking-wide">{event.title}</h3>

                <div className="flex items-center text-xs font-bold text-rafahiyah-dark-blue uppercase tracking-wider mb-4 font-sans gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(event.date).toLocaleDateString()}
                </div>

                <CardDescription className="text-gray-600 mb-6 flex-grow leading-relaxed font-sans text-sm line-clamp-3">
                  {event.description}
                </CardDescription>

                <div className="flex gap-4 w-full mt-auto">
                  <Button
                    className="flex-1 bg-[#FFD700] text-black py-6 rounded-xl text-sm font-bold font-odibee hover:bg-[#FDB931] transition-colors uppercase tracking-wider shadow-sm"
                    onClick={() => setViewMoreEvent(event)}
                  >
                    View More
                  </Button>
                  <Button
                    className="flex-1 bg-rafahiyah-deep-red text-white py-6 rounded-xl text-sm font-bold font-odibee hover:bg-[#6b2416] transition-colors uppercase tracking-wider shadow-sm"
                    onClick={() => setSelectedEvent(event)}
                  >
                    Participate
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* View More Modal - UPDATED LAYOUT */}
      <Dialog open={!!viewMoreEvent} onOpenChange={(open) => !open && setViewMoreEvent(null)}>
        <DialogContent className="max-w-5xl bg-white rounded-[2rem] p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{viewMoreEvent?.title}</DialogTitle>
          </DialogHeader>

          {viewMoreEvent && (
            <div className="flex flex-col md:flex-row h-full max-h-[90vh] md:h-auto overflow-y-auto md:overflow-visible">
              {/* Left Side: Image */}
              <div className="w-full md:w-2/5 h-64 md:h-auto bg-gray-100 relative">
                <img
                  src={viewMoreEvent.image}
                  alt={viewMoreEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                <h3 className="absolute bottom-4 left-4 text-3xl font-odibee text-white md:hidden drop-shadow-md z-10">
                  {viewMoreEvent.title}
                </h3>
              </div>

              {/* Right Side: Content */}
              <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col gap-6">
                <h3 className="text-4xl md:text-5xl font-odibee text-rafahiyah-dark-blue hidden md:block leading-none">
                  {viewMoreEvent.title}
                </h3>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="p-2 bg-blue-100 rounded-lg text-rafahiyah-dark-blue">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Date</p>
                      <p className="font-semibold text-gray-800 text-sm md:text-base">{new Date(viewMoreEvent.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="p-2 bg-green-100 rounded-lg text-green-700">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Day</p>
                      <p className="font-semibold text-gray-800 text-sm md:text-base">{viewMoreEvent.day}</p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Time</p>
                      <p className="font-semibold text-gray-800 text-sm md:text-base">{viewMoreEvent.time}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="text-gray-600 font-sans leading-relaxed text-base max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {viewMoreEvent.description}
                </div>

                {/* Actions */}
                <div className="mt-auto pt-4 md:pt-0">
                  <Button
                    className="w-full bg-[#852D1A] hover:bg-[#6b2416] text-white py-6 rounded-xl font-odibee text-xl tracking-wide shadow-lg transition-transform hover:scale-[1.02]"
                    onClick={() => {
                      setViewMoreEvent(null);
                      setSelectedEvent(viewMoreEvent);
                    }}
                  >
                    Participate Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Register Modal - Kept Simple but updated styling */}
      <Dialog open={!!(selectedEvent && !selectedEvent.showOverlay)} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-lg bg-white rounded-3xl p-8">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-rafahiyah-dark-blue font-odibee mb-4">Register for {selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 font-sans">
            <Input placeholder="First Name" className="h-12 rounded-xl border-gray-200" />
            <Input placeholder="Last Name" className="h-12 rounded-xl border-gray-200" />
            <Input type="email" placeholder="Email" className="h-12 rounded-xl border-gray-200" />
            <Input placeholder="Phone Number" className="h-12 rounded-xl border-gray-200" />
            <Button className="w-full bg-rafahiyah-deep-red hover:bg-[#6b2416] h-12 rounded-xl text-lg font-odibee tracking-wide shadow-md" onClick={() => {
              toast.success("Application Submitted Successfully (Demo)");
              setSelectedEvent(null);
            }}>
              Confirm Participation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Overlay - Minimal Changes */}
      {selectedEvent?.showOverlay && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
          <div className="max-w-5xl w-full relative animate-fadeInSlide" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <Button
              variant="ghost"
              className="absolute -top-12 right-0 text-white hover:bg-white/20 rounded-full"
              onClick={() => setSelectedEvent(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Events;
