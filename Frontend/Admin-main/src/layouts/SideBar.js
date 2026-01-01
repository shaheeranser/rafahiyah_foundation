import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCalendarAlt, faFileAlt, faDonate, faBriefcase, faUserCircle, faUserGraduate, faProjectDiagram, faStar, faUsers, faSignOutAlt, faUser, faEnvelope, faImages, faPodcast, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

function SideBar() {
  const location = useLocation();

  const links = [
    { to: "/", icon: faHome, label: "Dashboard" },
    { to: "/Admin/Posts", icon: faFileAlt, label: "Cases" },
    { to: "/Admin/Events", icon: faCalendarAlt, label: "Events" },
    { to: "/Admin/Team", icon: faUsers, label: "Volunteers" },
    { to: "/Admin/Program", icon: faProjectDiagram, label: "Programs" },
    { to: "/Admin/contact", icon: faEnvelope, label: "Contact Us" },
    { to: "/Logout", icon: faSignOutAlt, label: "Logout" }
  ];

  return (
    <nav className="border-r bg-[#1F2937] h-screen p-4 w-64 pt-10 border-none">
      {links.map((link) => {
        const isActive = location.pathname === link.to || (location.pathname === "/Admin" && link.to === "/Admin/Dashboard");
        return (
          <Link key={link.to} to={link.to} aria-label={link.label}>
            <div
              className={`group flex items-center cursor-pointer rounded-md p-3 mb-3 transition-colors ${isActive
                ? "bg-[#FFD700] text-black font-semibold"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
            >
              <FontAwesomeIcon
                icon={link.icon}
                className={`mr-3 w-5 ${isActive ? "text-black" : "text-gray-400 group-hover:text-white"}`}
              />
              <span>{link.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

export default SideBar;
