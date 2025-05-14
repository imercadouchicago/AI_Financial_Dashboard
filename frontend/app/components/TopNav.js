"use client";

import React from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const TopNav = ({ onToggleUserMenu }) => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-full hover:bg-accent/10"
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
          className="p-2 rounded-full hover:bg-accent/10"
          aria-label="Toggle user menu"
        >
          <UserCircleIcon className="h-6 w-6" />
        </button>
      ) : (
        <Link href="/login" className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">
          Login / Sign Up
        </Link>
      )}
    </div>
  );
};

export default TopNav;