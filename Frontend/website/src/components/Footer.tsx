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
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[linear-gradient(180deg,#242D4B_0%,#35426D_50%,#242D4B_100%)] text-white pt-10 pb-6 border-t border-white/10 relative">
      {/* The image shows a gradient/dark blue background. #1E2542 is a close estimation or use custom dark-blue */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* Column 1: Logo & Name */}
          <div className="flex flex-col items-center lg:items-center text-center">
            <div className="bg-white rounded-full p-0.5 w-24 h-24 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(255,255,255,0.4)] overflow-hidden border-4 border-white/10">
              <img
                src={rafahiyahLogo}
                alt="Rafahiyah Foundation"
                className="w-full h-full object-contain drop-shadow-md p-1"
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
                <span>+92 335 9424716</span>
              </div>
            </div>

            {/* Social Icons */}
            {/* Social Icons */}
            <div className="flex space-x-3">
              {/* Icons style: white specific icons */}
              <a href="https://www.facebook.com/share/1D7jNnETiG/" target="_blank" rel="noopener noreferrer" className="bg-white text-[#1E2542] hover:bg-white/80 p-2 rounded-full transition-transform hover:scale-110 shadow-md">
                <Facebook className="w-5 h-5 fill-current" />
              </a>

              {/* Custom TikTok Icon */}
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
              <a href="https://www.pinterest.com/rafahiyahfoundation/?invite_code=7c100c6a23f14f55b0c8644294ef2552&sender=1111826364165849703" target="_blank" rel="noopener noreferrer" className="bg-white text-[#1E2542] hover:bg-white/80 p-2 rounded-full transition-transform hover:scale-110 shadow-md">
                {/* Lucide doesn't have Pinterest, using Globe as marker or custom SVG if preferred, but existing code had Globe comment. I'll use a P icon or Globe. Let's use a generic share or just Globe for now as initially planned or better, a P SVG */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.487-.695-2.419-2.87-2.419-4.617 0-3.76 2.735-7.219 7.893-7.219 4.144 0 7.365 2.953 7.365 6.904 0 4.121-2.597 7.444-6.196 7.444-1.209 0-2.345-.63-2.735-1.372l-.744 2.822c-.272 1.047-1.009 2.356-1.503 3.161 1.127.334 2.316.516 3.543.516 6.619 0 11.986-5.368 11.986-11.987C24.004 5.367 18.636 0 12.017 0Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 4: Quick Links */}
          <div>
            <h3 className="text-2xl font-odibee mb-4 tracking-wide text-white">Quick Links</h3>
            <ul className="space-y-1.5 text-sm font-sans text-gray-300">
              <li><a href="/" className="hover:text-[#FCD34D] transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-[#FCD34D] transition-colors">About Us</a></li>
              <li><a href="/stories" className="hover:text-[#FCD34D] transition-colors">Stories</a></li>
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
            © Copyright 2023-2025 Rafahiyah Foundation Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;