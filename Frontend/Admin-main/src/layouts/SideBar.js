import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Phone,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  LogOut,
  Settings,
  Coins
} from "lucide-react";

function SideBar({ isOpen, onClose, isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.clear();

    // Redirect to login
    navigate('/Login');
  };

  const links = [
    { to: "/Admin/Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/Admin/Program", label: "Programs", icon: FileText },
    { to: "/Admin/Events", label: "Events", icon: Calendar },
    { to: "/Admin/Posts", label: "Cases", icon: HeartHandshake },
    { to: "/Admin/Team", label: "Volunteers", icon: Users },
    { to: "/Admin/contact", label: "Contact Us", icon: Phone },
    { to: "/Admin/Donations", label: "Donations", icon: Coins },
    { to: "/Admin/Settings", label: "Settings", icon: Settings }
  ];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        bg-[#8B2D1B] text-white
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
        ${isCollapsed ? 'w-20' : 'w-64'}
        flex flex-col border-r border-[#6B2414] shadow-xl
      `}
    >
      {/* Header / Logo */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-6'} h-20 border-b border-[#6B2414]/30`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <img src="/rafahiyah logo.png" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-bold text-2xl tracking-wide font-odibee pt-1">RAFAHIYAH</span>
          </div>
        )}
        {isCollapsed && (
          <img src="/rafahiyah logo.png" alt="Logo" className="w-8 h-8 object-contain" />
        )}

        {/* Collapse Toggle (Desktop) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`hidden lg:flex items-center justify-center w-6 h-6 rounded-md bg-[#5D1910] text-white hover:bg-[#4a140c] transition-colors ${isCollapsed ? 'absolute -right-3 top-7 shadow-md' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {links.map((link) => {
          // Normalize paths
          const isDashboard = link.to === "/Admin/Dashboard" && (location.pathname === "/" || location.pathname === "/Admin" || location.pathname === "/Admin/Dashboard");
          const isActive = isDashboard || location.pathname.startsWith(link.to) && link.to !== "/Admin/Dashboard";
          const Icon = link.icon;

          return (
            <Link
              key={link.to}
              to={link.to === "/Admin/Dashboard" ? "/" : link.to}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={`
                flex items-center
                ${isCollapsed ? 'justify-center px-0' : 'px-4'}
                py-3 rounded-lg
                transition-all duration-200 group relative
                ${isActive
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                }
              `}
              title={isCollapsed ? link.label : ""}
            >
              <Icon
                size={22}
                className={`
                    transition-transform duration-200 
                    ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}
                `}
              />

              {!isCollapsed && (
                <span className={`ml-3 font-medium text-lg tracking-wide font-odibee pt-0.5`}>
                  {link.label}
                </span>
              )}

              {/* Active Indicator Strip */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FFD700] rounded-r-md" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout Only */}
      <div className={`p-4 border-t border-[#6B2414]/30`}>
        <button
          onClick={handleLogout}
          className={`
            flex items-center
            ${isCollapsed ? 'justify-center' : 'justify-center w-full'}
            py-2 rounded-lg
            bg-[#5D1910]/50 text-white/80 hover:bg-[#5D1910] hover:text-white
            transition-colors duration-200
          `}
          title="Logout"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="ml-2 font-medium text-lg font-odibee pt-0.5">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default SideBar;
