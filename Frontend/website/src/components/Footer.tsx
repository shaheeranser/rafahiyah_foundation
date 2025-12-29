import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter, // Used for X icon
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Globe, // Placeholder for Pinterest if needed, or I'll try to find a Pinterest icon from lucide
} from "lucide-react";
// Pinterest is not in lucide-react standard export? Let's check imports. 
// Standard lucide might not have Pinterest. I will use a custom SVG or just standard icons for now.
// Actually, Lucide has 'Pin' but not Pinterest brand icon usually. I'll use Twitter for X. 
// Checking the reference: FB, X, Insta, Linkedin, Pinterest.
import rafahiyahLogo from "@/assets/rafahiyah logo.png";

const Footer = () => {
  return (
    <footer className="bg-[linear-gradient(180deg,#242D4B_0%,#35426D_50%,#242D4B_100%)] text-white pt-10 pb-6 border-t border-white/10 relative">
      {/* The image shows a gradient/dark blue background. #1E2542 is a close estimation or use custom dark-blue */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* Column 1: Logo & Name */}
          <div className="flex flex-col items-center lg:items-center text-center">
            <div className="bg-white rounded-full p-2 w-24 h-24 flex items-center justify-center mb-3 shadow-lg">
              <img
                src={rafahiyahLogo}
                alt="Rafahiyah Foundation"
                className="h-16 w-auto object-contain"
              />
            </div>
            <h2 className="text-xl font-odibee leading-tight uppercase tracking-widest text-center">
              RAFAHIYAH<br />FOUNDATION
            </h2>
          </div>

          {/* Column 2: Join Us */}
          <div className="flex flex-col items-start lg:pl-10">
            <h3 className="text-2xl font-odibee mb-4 tracking-wide text-white">Want To Become<br />Part Of Us?</h3>
            <Button className="bg-[#5e1b10] hover:bg-[#7a2315] text-white border-2 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.3)] font-odibee tracking-wider rounded-full px-8 py-2 text-lg transition-all">
              <a href="/join-us">Join Us Now</a>
            </Button>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-2xl font-odibee mb-4 tracking-wide text-white">Contact Info</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-300 text-sm font-sans">
                <Mail className="w-5 h-5 text-[#FCD34D]" />
                <span>rafahiyahfoundation@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm font-sans">
                <Phone className="w-5 h-5 text-[#FCD34D]" />
                <span>+92 335 9424716</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-3">
              {/* Icons style: white specific icons */}
              <a href="#" className="bg-white text-[#1E2542] hover:bg-white/80 p-1 rounded-full"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="bg-white text-[#1E2542] hover:bg-white/80 p-1 rounded-full"><Twitter className="w-5 h-5" /></a> {/* using Twitter for X */}
              <a href="#" className="bg-white text-[#1E2542] hover:bg-white/80 p-1 rounded-full"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="bg-white text-[#1E2542] hover:bg-white/80 p-1 rounded-full"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Column 4: Quick Links */}
          <div>
            <h3 className="text-2xl font-odibee mb-4 tracking-wide text-white">Quick Links</h3>
            <ul className="space-y-1.5 text-sm font-sans text-gray-300">
              <li><a href="/" className="hover:text-[#FCD34D] transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-[#FCD34D] transition-colors">About Us</a></li>
              <li><a href="/programs" className="hover:text-[#FCD34D] transition-colors">Projects</a></li>
              <li><a href="/programs" className="hover:text-[#FCD34D] transition-colors">Programs</a></li>
              <li><a href="/events" className="hover:text-[#FCD34D] transition-colors">Events</a></li>
              <li><a href="/join-us" className="hover:text-[#FCD34D] transition-colors">Join Us</a></li>
              <li><a href="/donate" className="hover:text-[#FCD34D] transition-colors">Donate Now</a></li>
            </ul>
          </div>

        </div>

        {/* Separator Line */}
        <div className="w-full h-px bg-red-900/50 my-6 shadow-[0_1px_0_rgba(255,255,255,0.1)]"></div>

        {/* Bottom Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-400 font-sans">
            © Copyright 2023-2025 Rafahiyah Foundation Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;