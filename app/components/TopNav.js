"use client";

import React, { useState, useEffect } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';

const TopNav = ({ onToggleUserMenu }) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
             <div className="flex items-center space-x-4">
                <div className="bg-gray-200 dark:bg-gray-700 w-10 h-10 rounded animate-pulse"></div>
                <div className="bg-indigo-500 w-10 h-10 rounded animate-pulse"></div>
             </div>
        );
    }

    return (
        <div className="flex items-center space-x-4">
          {/* Light/Dark mode toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 p-2 rounded-full"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          </button>

          {/* User Menu toggle button */}
          <button
            onClick={onToggleUserMenu}
            className="bg-indigo-500 hover:bg-indigo-700 text-white p-2 rounded-full"
            aria-label="Toggle user menu"
          >
            <UserCircleIcon className="h-6 w-6" />
          </button>
        </div>
      );
    }

export default TopNav;