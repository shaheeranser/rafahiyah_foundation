import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { getAllTeams } from "../services/api";
import { ArrowLeft, ArrowRight } from "lucide-react";

const About = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth + 48; // Scroll one full view including one gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const dummyCrew = [
    { name: "Team Member 1", role: "Design Lead", image: null, description: "Passionate about creating visually stunning experiences." },
    { name: "Team Member 2", role: "Dev Wizard", image: null, description: "Turning complex problems into elegant solutions." },
    { name: "Team Member 3", role: "Humanitarian", image: null, description: "Dedicated to serving humanity with kindness." },
    { name: "Team Member 4", role: "Strategist", image: null, description: "Planning for a brighter and more prosperous future." },
    { name: "Team Member 5", role: "Volunteer", image: null, description: "Always ready to lend a helping hand to those in need." },
    { name: "Team Member 6", role: "Coordinator", image: null, description: "Ensuring every effort reaches its full potential." },
  ];

  const founders = [
    {
      name: "Zawar Ahmed",
      role: "Co-Founder",
      image: "/founder-zawar.png", // Replace with real paths if available
      quote: "Rafahiyah has always been and will Always be something pure, meant to spread out the kindness and empathy, motivating others on this humble venture and helping the needy with kindness and Love.",
      reverse: false
    },
    {
      name: "Nuzhat Hamid",
      role: "Founder",
      image: "/founder-nuzhat.png",
      quote: "A humanitarian who has always believed that even the smallest acts of kindness can have a profound impact. One ordinary day, while chatting with two close friends in a group chat, the conversation sparked and we came up with the idea of Rafahiyah. Today, I'm humbled and honoured to lead an NGO dedicated to helping people and creating awareness among the youth to help spread prosperity. We're passionate individuals united by a shared mission: Towards prosperity and a Smiling Future.",
      reverse: true
    },
    {
      name: "Mubashir Awan",
      role: "Co-Founder",
      image: "/founder-mubashir.png",
      quote: "", // Empty as per mock or placeholder
      reverse: false
    }
  ];

  return (
    <div className="min-h-screen font-sans bg-white">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <Header />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-start overflow-hidden pt-20">
        {/* Background Overlay (Simulating Video Background) */}
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 z-0">
          {/* Placeholder for video clips from Rafahiyah Documentary */}
          <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-gray-500 text-sm italic">
            [clips from Rafahiyah Documentary in Background (From Drive)]
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-odibee text-white mb-4 tracking-wider">
              Get to Know Us
            </h1>
            <p className="text-2xl md:text-3xl font-odibee text-rafahiyah-gold leading-tight max-w-2xl">
              Three Friends, One Vision, United Passion, and a Group Chat, That's Where It All Started!
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-odibee text-rafahiyah-dark-blue mb-4">ONE VISION</h2>
          </div>

          <div className="space-y-16">
            {/* One Vision */}
            <div className="text-center">
              <div className="bg-[#E5E5E5] p-10 rounded-2xl shadow-sm">
                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                  "We came together to create a prosperous and caring society in which everyone has access to opportunities, healthcare, education, and fundamental human dignity as a right rather than a privilege. We see thriving communities where every one of us can reach their full potential and make a significant contribution to a better tomorrow. These communities are bolstered by unity, equity, and self-reliance."
                </p>
              </div>
            </div>

            {/* Our Mission */}
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-odibee text-rafahiyah-dark-blue mb-4">OUR MISSION</h2>
              <div className="bg-[#E5E5E5] p-10 rounded-2xl shadow-sm">
                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                  "We strive to uplift the underprivileged and transform communities, fostering a world where everyone has the opportunity to thrive."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-odibee text-rafahiyah-dark-blue">Meet Our Founders</h2>
          </div>

          <div className="space-y-12">
            {founders.map((founder, index) => (
              <div key={index} className={`flex flex-col ${founder.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
                <div className="flex-shrink-0 text-center">
                  <div className="w-64 h-64 rounded-full border-[12px] border-rafahiyah-deep-red overflow-hidden shadow-xl mb-4 bg-white flex items-center justify-center p-2">
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center italic text-gray-400">
                      {/* Image would go here */}
                      pic: {founder.name.split(' ')[0]}
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-rafahiyah-dark-blue">{founder.name}</h4>
                  <p className="text-gray-500 font-medium">{founder.role}</p>
                </div>
                {founder.quote && (
                  <div className="flex-grow">
                    <div className="bg-[#E5E5E5] p-8 md:p-12 rounded-[2rem] shadow-sm relative">
                      <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                        "{founder.quote}"
                      </p>
                    </div>
                  </div>
                )}
                {!founder.quote && (
                  <div className="flex-grow bg-[#E5E5E5] h-64 rounded-[2rem] shadow-sm flex items-center justify-center italic text-gray-400">
                    [Placeholder for quote/info]
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OG Crew Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-odibee text-rafahiyah-dark-blue mb-4">Meet Our OG Crew</h2>
          </div>

          <div className="relative px-12">
            {/* Carousel Navigation */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors z-50 bg-[#D9D9D9] shadow-sm"
              aria-label="Scroll Left"
            >
              <ArrowLeft className="w-5 h-5 text-black" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors z-50 bg-[#D9D9D9] shadow-sm"
              aria-label="Scroll Right"
            >
              <ArrowRight className="w-5 h-5 text-black" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-12 overflow-x-auto py-10 no-scrollbar scroll-smooth snap-x snap-mandatory"
            >
              {dummyCrew.map((member, idx) => (
                <div key={idx} className="w-[calc((100%-96px)/3)] flex-shrink-0 flex flex-col items-center bg-[#D9D9D9] p-10 rounded-[2.5rem] shadow-md border border-gray-200/50 snap-start">
                  {/* Pic area */}
                  <div className="w-40 h-40 rounded-full bg-white mb-8 flex items-center justify-center italic text-gray-400 border-4 border-white shadow-lg overflow-hidden relative">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "pic"
                    )}
                  </div>

                  {/* Name area */}
                  <h4 className="text-2xl font-bold text-black mb-6 tracking-tight">{member.name}</h4>

                  {/* About text box */}
                  <div className="w-full bg-[#9B9B9B] h-[120px] rounded-[1.5rem] flex items-center justify-center p-6 shadow-inner">
                    <p className="text-white text-sm font-medium text-center leading-snug line-clamp-3">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
