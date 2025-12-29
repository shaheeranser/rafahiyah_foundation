import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { isAuthenticated } from "@/utils/auth";
import NavbarProfileAvatar from "@/components/NavbarProfileAvatar";
import rafahiyahLogo from "@/assets/rafahiyah logo.png";


type NavItem = {
  name: string;
  href?: string;
  dropdown?: boolean;
  items?: { name: string; href: string }[];
};
type HeaderProps = {
  showNavItems?: boolean; // Make it optional
};

const Header = ({ showNavItems = true }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        window.innerWidth >= 1024 &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDesktopDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    {
      name: "Opportunities",
      dropdown: true,
      items: [

        { name: "Programs", href: "/programs" },
        { name: "Events", href: "/events" },
        { name: "Jobs", href: "/Jobs" },
      ],
    },
    { name: "Gallery", href: "/gallery" },
    { name: "Blog", href: "/blog" },
    { name: "Podcasts", href: "/podcasts" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-b from-[#8B2D1B] to-[#4A1811] border-b border-[#F6AD55]/30 shadow-2xl`}
    >
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">

        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex-shrink-0 group">
            <div className="bg-white rounded-full p-1 shadow-lg transition-transform transform group-hover:scale-105 duration-300">
              <img
                src={rafahiyahLogo}
                alt="Rafahiyah Foundation Logo"
                className="h-14 w-14 object-contain"
              />
            </div>
          </Link>
          <span className="hidden xl:block text-2xl font-odibee uppercase tracking-[0.15em] text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
            RAFAHIYAH FOUNDATION
          </span>
        </div>

        {/* Desktop Navigation */}
        {showNavItems && (
          <nav className="hidden lg:flex items-center gap-24">
            <Link to="/about" className="text-xl font-odibee tracking-wider text-white hover:text-[#FCD34D] transition-colors drop-shadow-md">
              About Us
            </Link>
            <Link to="/stories" className="text-xl font-odibee tracking-wider text-white hover:text-[#FCD34D] transition-colors drop-shadow-md">
              Initiatives
            </Link>
            <Link to="/stories#cases" className="text-xl font-odibee tracking-wider text-white hover:text-[#FCD34D] transition-colors drop-shadow-md">
              Cases
            </Link>
            <Link to="/contact" className="text-xl font-odibee tracking-wider text-white hover:text-[#FCD34D] transition-colors drop-shadow-md">
              Contact Us
            </Link>
          </nav>
        )}

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          {!isAuthenticated() ? (
            <>
              <Link to="/contact#join-us">
                <Button className="bg-[radial-gradient(circle_at_center,_#EBDE3F_0%,_#D89637_100%)] text-[#4A1811] hover:brightness-110 font-odibee tracking-wider text-xl rounded-full px-8 py-2 transition-all">
                  Join Us Now
                </Button>
              </Link>
              <Link to="/contact#donate">
                <Button className="bg-[radial-gradient(circle_at_center,_#852D1A_0%,_#242D4B_100%)] text-white hover:brightness-110 font-odibee tracking-wider text-xl rounded-full px-8 py-2 transition-all">
                  Donate Now
                </Button>
              </Link>
            </>
          ) : (
            <NavbarProfileAvatar />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#F6AD55]/30 bg-[#5e1b10] shadow-inner">
          <nav className="py-6 space-y-4 px-4 flex flex-col items-center">
            <Link to="/" className="block text-2xl font-odibee text-white hover:text-[#FCD34D]" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" className="block text-2xl font-odibee text-white hover:text-[#FCD34D]" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link to="/stories" className="block text-2xl font-odibee text-white hover:text-[#FCD34D]" onClick={() => setIsMobileMenuOpen(false)}>Initiatives</Link>
            <Link to="/stories#cases" className="block text-2xl font-odibee text-white hover:text-[#FCD34D]" onClick={() => setIsMobileMenuOpen(false)}>Cases</Link>
            <Link to="/contact" className="block text-2xl font-odibee text-white hover:text-[#FCD34D]" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>

            {!isAuthenticated() ?
              <div className="pt-6 space-y-4 w-full max-w-xs">
                <Link to="/contact#join-us" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-[radial-gradient(circle_at_center,_#EBDE3F_0%,_#D89637_100%)] text-[#4A1811] hover:brightness-110 font-odibee tracking-wider text-xl rounded-full py-3 transition-all">
                    Join Us Now
                  </Button>
                </Link>
                <Link to="/contact#donate" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-[radial-gradient(circle_at_center,_#852D1A_0%,_#242D4B_100%)] text-white hover:brightness-110 font-odibee tracking-wider text-xl rounded-full py-3 transition-all">
                    Donate Now
                  </Button>
                </Link>
              </div> : <div className="pt-4"><NavbarProfileAvatar /></div>
            }
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
