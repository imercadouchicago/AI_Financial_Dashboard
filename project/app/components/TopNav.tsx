"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

interface TopNavProps {
  onToggleUserMenu: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ onToggleUserMenu }) => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full" aria-label="Toggle dark mode">
          <div className="h-6 w-6"></div>
        </button>
        {user ? (
          <button className="p-2 rounded-full" aria-label="Toggle user menu">
            <UserCircleIcon className="h-6 w-6" />
          </button>
        ) : (
          <Link href="/login" className="flex items-center px-4 py-2 rounded-full">
            Login / Sign Up
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-full"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? 
          <SunIcon className="h-6 w-6" /> : 
          <MoonIcon className="h-6 w-6" />
        }
      </button>
      
      {user ? (
        <button
          onClick={onToggleUserMenu}
          className="p-2 rounded-full"
          aria-label="Toggle user menu"
        >
          <UserCircleIcon className="h-6 w-6" />
        </button>
      ) : (
        <Link href="/login" className="flex items-center px-4 py-2 rounded-full">
          Login / Sign Up
        </Link>
      )}
    </div>
  );
};

export default TopNav;