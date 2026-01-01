import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCalendarAlt,
  faFileAlt,
  faUsers,
  faProjectDiagram,
  faEnvelope,
  faSignOutAlt,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

function SideBar({ isOpen, onClose }) {
  const location = useLocation();

  const links = [
    { to: "/Admin/Dashboard", label: "Dashboard" },
    { to: "/Admin/Program", label: "Programs" },
    { to: "/Admin/Events", label: "Events" },
    { to: "/Admin/Posts", label: "Cases" },
    { to: "/Admin/Team", label: "Volunteers" },
    { to: "/Admin/contact", label: "Contact Us" }
  ];

  return (
    <aside
      className={`
        fixed lg:static lg:translate-x-0 z-50
        w-64 h-full
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:block
        border-none
      `}
      style={{
        background: 'linear-gradient(180deg, #6B2414 0%, #852D1A 35%, #6D2617 100%)'
      }}
    >
      {/* Logo Area */}
      <div className="flex justify-center pt-8 pb-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-1 shadow-lg">
          <img
            src="/rafahiyah logo.png"
            alt="Rafahiyah Logo"
            className="w-full h-full object-contain rounded-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/150?text=Logo"
            }}
          />
        </div>
      </div>

      {/* Mobile Close Button */}
      <div className="lg:hidden absolute top-4 right-4">
        <button
          onClick={onClose}
          className="p-1 rounded-md text-white/70 hover:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
      </div>

      <nav className="px-6 py-6 flex flex-col items-center">
        {links.map((link) => {
          // Normalize paths
          const isDashboard = link.to === "/Admin/Dashboard" && (location.pathname === "/" || location.pathname === "/Admin" || location.pathname === "/Admin/Dashboard");
          const isActive = isDashboard || location.pathname.startsWith(link.to) && link.to !== "/Admin/Dashboard";

          return (
            <Link
              key={link.to}
              to={link.to === "/Admin/Dashboard" ? "/" : link.to}
              aria-label={link.label}
              onClick={onClose}
              className="w-full text-center mb-5"
            >
              <div
                className={`
                    text-xl font-bold tracking-wide transition-all duration-200
                    ${isActive ? "text-white scale-105" : "text-gray-200 hover:text-white hover:scale-105"}
                `}
                style={{
                  fontFamily: '"Odibee Sans", cursive',
                  fontSize: '1.5rem',
                  letterSpacing: '1px',
                  textShadow: isActive ? '0px 2px 4px rgba(0,0,0,0.3)' : 'none'
                }}
              >
                {link.label}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default SideBar;
