"use client";

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import UserMenu from './components/UserMenu';

export default function HomePage() {
  // State to manage the open/close state of the sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // State to manage the open/close state of the user menu
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to toggle user menu
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Function to close user menu
  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar component */}
      <Sidebar isOpen={isSidebarOpen} />
      
      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header with toggle buttons */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between relative">
          {/* Left side: Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>

          {/* Right side: TopNav component containing UserMenu Toggle */}
          <div className="relative">
            <TopNav onToggleUserMenu={toggleUserMenu} />
            {/* User Menu rendered inside header for proper positioning */}
            <UserMenu isOpen={isUserMenuOpen} onClose={closeUserMenu} />
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-6">
          <h1 className="text-4xl font-bold mb-6 dark:text-white">Welcome to the Homepage</h1>
          <p className="text-lg dark:text-gray-300">
            This is the main content. The sidebar is {isSidebarOpen ? 'open' : 'closed'}.
            The user menu is {isUserMenuOpen ? 'open' : 'closed'}.
          </p>
        </main>
      </div>
    </div>
  );
}