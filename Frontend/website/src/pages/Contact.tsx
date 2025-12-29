import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneCall, MessageSquare, Users, Heart, Coins, Sparkles, Handshake, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Contact = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="min-h-screen font-sans bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-center justify-start overflow-hidden pt-20">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 z-0 bg-[#E5E5E5]" />

        <div className="absolute bottom-10 right-10 z-20 text-gray-500 font-medium italic">
          (a bg image from drive)
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl text-left">
            <h1 className="text-6xl md:text-8xl font-odibee text-white mb-6 drop-shadow-lg leading-none">
              Reach Out to Us
            </h1>
            <p className="text-2xl md:text-3xl font-odibee text-rafahiyah-gold drop-shadow-md">
              Let's Connect to make a prosperous <br /> difference in the society!
            </p>
          </div>
        </div>
      </section>

      {/* Drop a Message Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left side text/animation */}
            <div className="space-y-12">
              <h2 className="text-5xl md:text-6xl font-odibee text-rafahiyah-dark-blue">Drop a Message !!</h2>
              {/* Working Animation: Messaging (Mobile Phone Texting) */}
              <div className="w-full h-64 flex items-center justify-center relative overflow-hidden group">
                <style>{`
                  @keyframes slideUp {
                    0% { transform: translateY(20px); opacity: 0; }
                    20% { transform: translateY(0); opacity: 1; }
                    80% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(-20px); opacity: 0; }
                  }
                  .animate-text-bubble {
                    animation: slideUp 3s infinite;
                  }
                `}</style>

                {/* Mobile Phone Frame */}
                <div className="w-28 h-48 bg-rafahiyah-dark-blue rounded-[2rem] border-4 border-gray-800 relative shadow-xl flex flex-col p-2 overflow-hidden">
                  {/* Notch */}
                  <div className="w-12 h-4 bg-gray-800 mx-auto rounded-b-xl mb-2" />

                  {/* Screen Content */}
                  <div className="flex-grow bg-white rounded-xl p-2 flex flex-col gap-2 overflow-hidden shadow-inner relative">
                    {/* Message Bubbles */}
                    <div className="w-16 h-4 bg-blue-500/20 rounded-lg self-start animate-text-bubble" style={{ animationDelay: '0s' }} />
                    <div className="w-14 h-4 bg-gray-100 rounded-lg self-end animate-text-bubble" style={{ animationDelay: '1s' }} />
                    <div className="w-12 h-4 bg-blue-500/20 rounded-lg self-start animate-text-bubble" style={{ animationDelay: '2s' }} />

                    {/* Typing Indicator */}
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>

                {/* Floating message icons around the phone */}
                <MessageSquare className="absolute top-10 left-10 w-8 h-8 text-rafahiyah-dark-blue/20 animate-pulse" />
                <MessageSquare className="absolute bottom-10 right-10 w-10 h-10 text-rafahiyah-dark-blue/20 animate-bounce" />
              </div>
              <p className="text-2xl font-bold text-rafahiyah-dark-blue leading-tight max-w-md">
                Want to Know About Us Personally or got a Question? Drop a Message Here and We Will Reach Out to You
              </p>
            </div>

            {/* Right side form */}
            <div className="bg-gradient-to-b from-[#252E4C] via-[#384B8A] to-[#252E4C] p-10 rounded-[2.5rem] shadow-2xl min-h-[700px]">
              <form className="space-y-6">
                <Input placeholder="Full Name" className="h-14 rounded-xl border-none bg-white text-black placeholder:text-gray-400" />
                <Input placeholder="Email Address" type="email" className="h-14 rounded-xl border-none bg-white text-black placeholder:text-gray-400" />
                <Input placeholder="Contact Number" className="h-14 rounded-xl border-none bg-white text-black placeholder:text-gray-400" />
                <Input placeholder="Subject" className="h-14 rounded-xl border-none bg-white text-black placeholder:text-gray-400" />
                <div className="relative">
                  <Textarea
                    placeholder="Message"
                    className="min-h-[180px] rounded-xl border-none bg-white text-black placeholder:text-gray-400 resize-none pt-4"
                  />
                  <span className="absolute bottom-4 right-4 text-[10px] text-gray-400">0/150</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Join Hands Section */}
      <section id="join-us" className="py-24 bg-[#FAFAFA]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left side form */}
            <div className="bg-gradient-to-b from-[#85291A] via-[#45120A] to-[#85291A] p-10 rounded-[2.5rem] shadow-2xl min-h-[700px]">
              <form className="space-y-4">
                <Input placeholder="Full Name" className="h-12 rounded-xl border-none bg-white" />
                <Input placeholder="Contact Number" className="h-12 rounded-xl border-none bg-white" />
                <Input placeholder="Age" className="h-12 rounded-xl border-none bg-white" />
                <Input placeholder="City" className="h-12 rounded-xl border-none bg-white" />
                <Select>
                  <SelectTrigger className="h-12 rounded-xl border-none bg-white">
                    <SelectValue placeholder="Select Your Occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="h-12 rounded-xl border-none bg-white">
                    <SelectValue placeholder="Select The Team You Want To Join" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="ground">Ground Work</SelectItem>
                    <SelectItem value="it">IT Team</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-start gap-3 pt-2">
                  <Checkbox className="mt-1 border-white data-[state=checked]:bg-white data-[state=checked]:text-[#8B2D1B]" />
                  <p className="text-[9px] text-white/80 leading-snug">
                    By submitting this form, I acknowledge and agree to volunteer my time and services without any financial benefit. I understand that this is a voluntary role and does not constitute employment.
                  </p>
                </div>
              </form>
            </div>

            {/* Right side text */}
            <div className="space-y-12">
              <h2 className="text-5xl md:text-6xl font-odibee text-[#8B2D1B] text-right">Join Hands, Be the Change</h2>
              {/* Working Animation: Joining (Unity Connection) */}
              <div className="w-full h-64 flex items-center justify-center relative overflow-hidden group">
                <style>{`
                  @keyframes hand-left {
                    0% { transform: translateX(-50px); opacity: 0; }
                    40% { transform: translateX(0); opacity: 1; }
                    50% { transform: translateY(-3px); }
                    60% { transform: translateY(3px); }
                    70% { transform: translateY(-3px); }
                    80% { transform: translateY(3px); }
                    90% { transform: translateY(0); }
                    100% { transform: translateX(0); opacity: 1; }
                  }
                  @keyframes hand-right {
                    0% { transform: translateX(50px); opacity: 0; }
                    40% { transform: translateX(0); opacity: 1; }
                    50% { transform: translateY(-3px); }
                    60% { transform: translateY(3px); }
                    70% { transform: translateY(-3px); }
                    80% { transform: translateY(3px); }
                    90% { transform: translateY(0); }
                    100% { transform: translateX(0); opacity: 1; }
                  }
                  @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    50% { transform: scale(1.2); opacity: 0; }
                    100% { transform: scale(0.8); opacity: 0; }
                  }
                  .animate-hand-left {
                    animation: hand-left 3s infinite ease-in-out;
                  }
                  .animate-hand-right {
                    animation: hand-right 3s infinite ease-in-out;
                  }
                  .animate-pulse-ring {
                    animation: pulse-ring 3s infinite ease-out;
                  }
                `}</style>

                <div className="relative flex items-center justify-center w-full h-full">
                  {/* Background Glow */}
                  <div className="absolute w-48 h-48 bg-rafahiyah-gold/10 rounded-full animate-pulse-ring" />
                  <div className="absolute w-32 h-32 bg-rafahiyah-gold/20 rounded-full animate-pulse-ring" style={{ animationDelay: '1s' }} />

                  {/* Hands Container */}
                  <div className="relative flex items-center justify-center scale-125">
                    {/* Left Hand (Points Right) */}
                    <div className="animate-hand-left mr-[-35px] z-10">
                      <svg className="rotate-90" width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 11.5V6.5C7 5.67157 7.67157 5 8.5 5C9.32843 5 10 5.67157 10 6.5V11.5M7 11.5V8.5C7 7.67157 6.32843 7 5.5 7C4.67157 7 4 7.67157 4 8.5V14C4 17.866 7.13401 21 11 21H13C14.8565 21 16.6369 20.2625 17.9497 18.9497C18.6182 18.2812 19.1124 17.464 19.4124 16.582M7 11.5C7 12.3284 7.67157 13 8.5 13C9.32843 13 10 12.3284 10 11.5M10 11.5V7.5C10 6.67157 10.6716 6 11.5 6C12.3284 6 13 6.67157 13 7.5V11.5M13 11.5V9.5C13 8.67157 13.6716 8 14.5 8C15.3284 8 16 8.67157 16 9.5V13.5" stroke="#8B2D1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    {/* Right Hand (Points Left) */}
                    <div className="animate-hand-right ml-[-35px] z-10">
                      <svg className="-rotate-90 scale-x-[-1]" width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 11.5V6.5C7 5.67157 7.67157 5 8.5 5C9.32843 5 10 5.67157 10 6.5V11.5M7 11.5V8.5C7 7.67157 6.32843 7 5.5 7C4.67157 7 4 7.67157 4 8.5V14C4 17.866 7.13401 21 11 21H13C14.8565 21 16.6369 20.2625 17.9497 18.9497C18.6182 18.2812 19.1124 17.464 19.4124 16.582M7 11.5C7 12.3284 7.67157 13 8.5 13C9.32843 13 10 12.3284 10 11.5M10 11.5V7.5C10 6.67157 10.6716 6 11.5 6C12.3284 6 13 6.67157 13 7.5V11.5M13 11.5V9.5C13 8.67157 13.6716 8 14.5 8C15.3284 8 16 8.67157 16 9.5V13.5" stroke="#E6B10A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Sparkles */}
                  <Sparkles className="absolute top-0 right-0 w-12 h-12 text-rafahiyah-gold animate-bounce opacity-40" />
                  <Sparkles className="absolute bottom-0 left-0 w-10 h-10 text-rafahiyah-gold animate-pulse opacity-40" />
                  <Heart className="absolute w-40 h-40 text-rafahiyah-gold/5 fill-rafahiyah-gold/5 animate-pulse" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#8B2D1B] leading-tight text-right w-full">
                Your Small Amount of Kindness Can Light Up Someone's Day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Donate Now Section */}
      <section id="donate" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left side text */}
            <div className="space-y-12">
              <h2 className="text-5xl md:text-6xl font-odibee text-rafahiyah-gold">Donate Now, Support Someone</h2>
              {/* Working Animation: Donating (Plant Growth) */}
              <div className="w-full h-64 flex items-center justify-center relative overflow-hidden">
                <style>{`
                  @keyframes hand-enter-drop {
                    0% { transform: translate(-50px, -50px); opacity: 0; }
                    20% { transform: translate(0, 0); opacity: 1; }
                    40% { transform: translate(0, 0); opacity: 1; }
                    60% { transform: translate(-50px, -50px); opacity: 0; }
                    100% { transform: translate(-50px, -50px); opacity: 0; }
                  }
                  @keyframes coin-drop {
                    0% { transform: translateY(0); opacity: 0; }
                    20% { transform: translateY(0); opacity: 1; }
                    35% { transform: translateY(60px); opacity: 0; } /* Faster drop */
                    100% { transform: translateY(60px); opacity: 0; }
                  }
                  @keyframes tree-emerge {
                    0% { transform: translateY(100%) scale(0.5); opacity: 0; }
                    35% { transform: translateY(100%) scale(0.5); opacity: 0; } /* Wait for coin */
                    40% { transform: translateY(80%) scale(0.5); opacity: 1; } /* Start emerging */
                    70% { transform: translateY(0) scale(1); opacity: 1; } /* Fully out */
                    85% { transform: translateY(0) scale(1.1); opacity: 1; } /* Settle bloom */
                    95% { transform: translateY(0) scale(1.1); opacity: 1; }
                    100% { transform: translateY(100%) scale(0.5); opacity: 0; } /* Reset */
                  }
                  .animate-hand-drop {
                    animation: hand-enter-drop 5s infinite ease-in-out;
                  }
                  .animate-coin {
                    animation: coin-drop 5s infinite ease-in-out;
                  }
                  .animate-tree {
                    animation: tree-emerge 5s infinite ease-in-out;
                  }
                `}</style>

                <div className="relative flex flex-col items-center justify-end h-48 w-full">

                  {/* Hand with Coin */}
                  <div className="absolute top-0 right-1/3 animate-hand-drop z-30">
                    <div className="relative">
                      {/* Hand SVG */}
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-rafahiyah-gold -rotate-12">
                        <path d="M7 11.5V6.5C7 5.67157 7.67157 5 8.5 5C9.32843 5 10 5.67157 10 6.5V11.5M7 11.5V8.5C7 7.67157 6.32843 7 5.5 7C4.67157 7 4 7.67157 4 8.5V14C4 17.866 7.13401 21 11 21H13C14.8565 21 16.6369 20.2625 17.9497 18.9497C18.6182 18.2812 19.1124 17.464 19.4124 16.582M7 11.5C7 12.3284 7.67157 13 8.5 13C9.32843 13 10 12.3284 10 11.5M10 11.5V7.5C10 6.67157 10.6716 6 11.5 6C12.3284 6 13 6.67157 13 7.5V11.5M13 11.5V9.5C13 8.67157 13.6716 8 14.5 8C15.3284 8 16 8.67157 16 9.5V13.5" stroke="#E6B10A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {/* Coin */}
                      <div className="absolute top-8 left-2 animate-coin">
                        <Coins className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                  </div>

                  {/* Pot Assembly */}
                  <div className="relative flex flex-col items-center justify-end z-10 mb-4">

                    {/* 1. Masking Container (Inside the pot) */}
                    {/* Positioned slightly above the bottom so it looks like it comes from the rim */}
                    <div className="relative w-24 h-32 overflow-hidden flex items-end justify-center mb-[-5px]">
                      <div className="animate-tree origin-bottom">
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Trunk */}
                          <path d="M12 21V12" stroke="#4A3423" strokeWidth="3" strokeLinecap="round" />
                          {/* Cloud/Bushy Leaves */}
                          <path d="M12 12C9 12 7 10 7 7C7 4 9 2 12 2C15 2 17 4 17 7C17 10 15 12 12 12Z" fill="#10B981" stroke="#059669" strokeWidth="2" />
                          <path d="M7 7C5 7 4 8 4 10C4 12 6 13 8 13" fill="#10B981" stroke="#059669" strokeWidth="2" />
                          <path d="M17 7C19 7 20 8 20 10C20 12 18 13 16 13" fill="#10B981" stroke="#059669" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>

                    {/* 2. Pot (Foreground/Static) */}
                    <div className="z-20">
                      <svg width="60" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Pot Rim (Front) */}
                        <rect x="4" y="5" width="16" height="3" fill="#A53926" stroke="#5D1E11" strokeWidth="2" />
                        {/* Pot Body */}
                        <path d="M5 8L7 21H17L19 8H5Z" fill="#8B2D1B" stroke="#5D1E11" strokeWidth="2" strokeLinejoin="round" />
                      </svg>
                    </div>

                  </div>

                </div>
                <div className="absolute inset-0 bg-rafahiyah-gold/5 animate-pulse" />
              </div>
              <p className="text-2xl font-bold text-rafahiyah-gold leading-tight max-w-sm">
                No Matter How Small the Amount is, Every Contribution Counts
              </p>
            </div>

            {/* Right side form */}
            <div className="bg-gradient-to-b from-[#806306] via-[#E6B10A] to-[#806306] p-10 rounded-[2.5rem] shadow-2xl min-h-[700px]">
              <form className="space-y-6">
                <Input placeholder="Full Name" className="h-14 rounded-xl border-none bg-white" />
                <Input placeholder="Email Address" type="email" className="h-14 rounded-xl border-none bg-white" />
                <Input placeholder="Contact Number" className="h-14 rounded-xl border-none bg-white" />
                <Select>
                  <SelectTrigger className="h-14 rounded-xl border-none bg-white">
                    <SelectValue placeholder="Select A Cause To Donate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="food">Food Security</SelectItem>
                  </SelectContent>
                </Select>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;