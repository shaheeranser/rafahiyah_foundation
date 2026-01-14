import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { getAllTeams } from "../services/api";
import { ArrowLeft, ArrowRight } from "lucide-react";

import bassamImg from "@/assets/Bassam.jpeg";
import adeenahImg from "@/assets/adeenah.jpeg";
import ruqayaImg from "@/assets/Ruqaya.jpeg";
import fazalImg from "@/assets/fazal.jpeg";
import laibaImg from "@/assets/laiba waseem.jpeg";
import aboutImg from "@/assets/aboutus.jpg";

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

  const ogCrew = [
    {
      name: "Bassam",
      role: "Social Media Head",
      image: bassamImg,
      description: "Social Media Head",
      years: "2023 - 2024"
    },
    {
      name: "Adeenah Mahmood",
      role: "Account Manager",
      image: adeenahImg,
      description: "Account Manager",
      years: "2023 - 2026"
    },
    {
      name: "Ruqaya Atiq",
      role: "Volunteer Team Member Rawalpindi",
      image: ruqayaImg,
      description: "Volunteer Team Member Rawalpindi",
      years: "2023 - 2026"
    },
    {
      name: "Fazal ul Rehman",
      role: "Volunteer Team Lead Lahore",
      image: fazalImg,
      description: "Volunteer Team Lead Lahore",
      years: "2024 - 2026"
    },
    {
      name: "Laiba Waseem",
      role: "Volunteer Team Member Islamabad",
      image: laibaImg,
      description: "Volunteer Team Member Islamabad",
      years: "2024 - 2025"
    },
  ];

  const founders = [
    {
      name: "Zawar Ahmed",
      role: "Co-Founder",
      image: "/zawar-ahmed.png",
      quote: "Rafahiyah has always been and will Always be something pure, meant to spread out the kindness and empathy, motivating others on this humble venture and helping the needy with kindness and Love.",
      reverse: false
    },
    {
      name: "Nuzhat Hamid",
      role: "Founder",
      image: "/nuzhat-hamid.png",
      quote: "A humanitarian who has always believed that even the smallest acts of kindness can have a profound impact. One ordinary day, while chatting with two close friends in a group chat, the conversation sparked and we came up with the idea of Rafahiyah. Today, I'm humbled and honoured to lead an NGO dedicated to helping people and creating awareness among the youth to help spread prosperity. We're passionate individuals united by a shared mission: Towards prosperity and a Smiling Future.",
      reverse: true
    },
    {
      name: "Mubashir Awan",
      role: "Co-Founder",
      image: "/mubashir-awan.png",
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
      <section className="relative h-[80vh] flex items-center justify-start overflow-hidden pt-20 bg-gray-900">
        {/* Background Wrapper */}
        <div className="absolute inset-0 z-0">
          <img
            src={aboutImg}
            alt="About Us Hero"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Dark Overlay for Text Readability - adjusted to match image area or full cover */}
        <div className="absolute inset-0 bg-black/60 z-10" />

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
              <div className="bg-gradient-to-b from-[#fccf4d] to-white p-10 rounded-2xl shadow-md border border-yellow-100">
                <p className="text-xl text-rafahiyah-dark-blue leading-relaxed font-medium">
                  "We came together to create a prosperous and caring society in which everyone has access to opportunities, healthcare, education, and fundamental human dignity as a right rather than a privilege. We see thriving communities where every one of us can reach their full potential and make a significant contribution to a better tomorrow. These communities are bolstered by unity, equity, and self-reliance."
                </p>
              </div>
            </div>

            {/* Our Mission */}
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-odibee text-rafahiyah-dark-blue mb-4">OUR MISSION</h2>
              <div className="bg-gradient-to-b from-[#fccf4d] to-white p-10 rounded-2xl shadow-md border border-yellow-100">
                <p className="text-xl text-rafahiyah-dark-blue leading-relaxed font-medium">
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
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center italic text-gray-400 overflow-hidden relative">
                      {founder.image ? (
                        <img
                          src={founder.image}
                          alt={founder.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        `pic: ${founder.name.split(' ')[0]}`
                      )}
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-rafahiyah-dark-blue">{founder.name}</h4>
                  <p className="text-gray-500 font-medium">{founder.role}</p>
                </div>
                {founder.quote && (
                  <div className="flex-grow">
                    <div className="bg-rafahiyah-deep-red p-8 md:p-12 rounded-[2rem] shadow-sm relative">
                      <p className="text-lg md:text-xl text-white leading-relaxed">
                        "{founder.quote}"
                      </p>
                    </div>
                  </div>
                )}
                {!founder.quote && (
                  <div className="flex-grow bg-rafahiyah-deep-red h-64 rounded-[2rem] shadow-sm flex items-center justify-center italic text-white/70">
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
              {ogCrew.map((member, idx) => (
                <div key={idx} className="w-[calc((100%-96px)/3)] flex-shrink-0 flex flex-col items-center bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 snap-start">
                  {/* Pic area */}
                  <div className="w-48 h-64 rounded-2xl bg-gray-100 mb-6 flex items-center justify-center italic text-gray-400 border-[6px] border-rafahiyah-gold shadow-md overflow-hidden relative">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      "pic"
                    )}
                  </div>

                  {/* Name area */}
                  <h4 className="text-3xl font-odibee text-rafahiyah-dark-blue mb-4 tracking-wide">{member.name}</h4>

                  {/* About text box */}
                  <div className="w-full bg-rafahiyah-dark-blue h-[120px] rounded-[1.5rem] flex flex-col items-center justify-center p-4 shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-rafahiyah-deep-red opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <p className="text-white text-2xl font-medium text-center leading-relaxed font-odibee tracking-wider line-clamp-2">
                      {member.description}
                    </p>
                    <p className="text-rafahiyah-gold/90 text-lg font-medium text-center mt-1 font-odibee tracking-widest">
                      {member.years}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div >
  );
};

export default About;
