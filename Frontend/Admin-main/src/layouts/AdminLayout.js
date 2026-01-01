// AdminLayout.jsx
import React, { useState } from "react";
import SideBar from "./SideBar";
import Nav from "./Nav";

function AdminLayout({ Content, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Nav onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1 relative overflow-hidden">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Reusable Sidebar Component */}
        <SideBar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* Content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {Content || children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;