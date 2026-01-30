import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import rafahiyahLogo from "@/assets/rafahiyah logo.png";
import { Link } from "react-router-dom";
import { getSettings } from "../services/api";

const Footer = () => {
  const [settings, setSettings] = useState({
    phoneNumber: "+92 335 9424716", // Default fallback
    email: "rafahiyahfoundation@gmail.com",
    address: "Pakistan",
    copyrightText: ""
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSettings();
        if (response && response.success && response.data) {
          setSettings(prev => ({
            ...prev,
            ...response.data
          }));
        }
      } catch (error) {
        console.error("Failed to load footer settings", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="bg-[linear-gradient(180deg,#242D4B_0%,#35426D_50%,#242D4B_100%)] text-white pt-10 pb-6 border-t border-white/10 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* Column 1: Logo & Name */}
          <div className="flex flex-col items-center lg:items-center text-center">
            {/* Full circle logo container */}
            <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden border-4 border-white/10">
              <img
                src={rafahiyahLogo}
                alt="Rafahiyah Foundation"
                className="w-full h-full object-cover drop-shadow-md rounded-full"
              />
            </div>
            <h2 className="text-xl font-odibee leading-tight uppercase tracking-widest text-center">
              RAFAHIYAH<br />FOUNDATION
            </h2>
          </div>

          {/* Column 2: Join Us */}
          <div className="flex flex-col items-start lg:pl-10">
            <h3 className="text-2xl font-odibee mb-4 tracking-wide text-white">Want To Become<br />Part Of Us?</h3>
            <Button className="bg-[radial-gradient(circle_at_center,_#EBDE3F_0%,_#D89637_100%)] text-[#4A1811] hover:brightness-110 shadow-lg shadow-black/30 border-none font-odibee tracking-wider rounded-full px-8 py-2 text-lg transition-all">
              <Link to="/contact#join-us">Join Us Now</Link>
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
                <span>{settings.phoneNumber}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-3">
              <a href="https://www.facebook.com/share/1D7jNnETiG/" target="_blank" rel="noopener noreferrer" className="bg-white text-[#1E2542] hover:bg-white/80 p-2 rounded-full transition-transform hover:scale-110 shadow-md">
                <Facebook className="w-5 h-5 fill-current" />
              </a>

              {/* TikTok Icon */}
              <a href="https://www.tiktok.com/@rafahiyahfoundation" target="_blank" rel="noopener noreferrer" className="bg-white text-[#1E2542] hover:bg-white/80 p-2 rounded-full transition-transform hover:scale-110 shadow-md">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>

              <a href="https://www.instagram.com/rafahiyah_foundation?igsh=MTJwNm11OW1xM3VtYg==" target="_blank" rel="noopener noreferrer" className="bg-white text-[#1E2542] hover:bg-white/80 p-2 rounded-full transition-transform hover:scale-110 shadow-md">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/rafahiyah-foundation/" target="_blank" rel="noopener noreferrer" className="bg-white text-[#1E2542] hover:bg-white/80 p-2 rounded-full transition-transform hover:scale-110 shadow-md">
                <Linkedin className="w-5 h-5 fill-current" />
              </a>
              {/* Removed Pinterest/Globe/Twitter as requested, keeping relevant ones */}
            </div>
          </div>

          {/* Column 4: Quick Links */}
          <div>
            <h3 className="text-2xl font-odibee mb-4 tracking-wide text-white">Quick Links</h3>
            <ul className="space-y-1.5 text-sm font-sans text-gray-300">
              <li><a href="/" className="hover:text-[#FCD34D] transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-[#FCD34D] transition-colors">About Us</a></li>
              {/* Changed Stories to Cases and Initiatives */}
              <li><a href="/stories" className="hover:text-[#FCD34D] transition-colors">Initiatives</a></li>
              <li><a href="/stories#cases" className="hover:text-[#FCD34D] transition-colors">Cases</a></li>
              <li><a href="/contact#join-us" className="hover:text-[#FCD34D] transition-colors">Join Us</a></li>
              <li><a href="/contact#donate" className="hover:text-[#FCD34D] transition-colors">Donate Now</a></li>
            </ul>
          </div>

        </div>

        {/* Separator Line */}
        <div className="w-full h-px bg-red-900/50 my-6 shadow-[0_1px_0_rgba(255,255,255,0.1)]"></div>

        {/* Bottom Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-400 font-sans">
            © {settings.copyrightText || "Rafahiyah Foundation Pakistan"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;