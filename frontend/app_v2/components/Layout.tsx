"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import UserMenu from './UserMenu';
import { useAuth } from '../context/AuthContext';

// Custom hook for sidebar state
const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return { isOpen, toggle };
};

// Custom hook for user menu state
const useUserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  return { isOpen, toggle, close };
};

// Loading component
const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"></div>
  </div>
);

// Menu button component
const MenuButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="focus:outline-none">
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = "Dashboard", 
  requireAuth = true 
}) => {
  const sidebar = useSidebar();
  const userMenu = useUserMenu();
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (requireAuth && !loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router, requireAuth]);

  if (requireAuth && loading) return <LoadingSpinner />;
  if (requireAuth && !user) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebar.isOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <MenuButton onClick={sidebar.toggle} />
            
            <div className="relative">
              <TopNav onToggleUserMenu={userMenu.toggle} />
              <UserMenu isOpen={userMenu.isOpen} onClose={userMenu.close} />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">{title}</h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;