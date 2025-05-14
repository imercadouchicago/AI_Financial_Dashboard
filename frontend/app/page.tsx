"use client";

import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

export default function LandingPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header with theme toggle and login button */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="relative h-10 w-10 mr-3">
              <div className="absolute bg-indigo-600 w-5 h-7 rounded-l-full left-0"></div>
              <div className="absolute bg-indigo-400 w-5 h-7 rounded-r-full right-0"></div>
              <div className="absolute h-3 w-3 bg-white rounded-full top-2 left-3.5"></div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Your App Name</h1>
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? 
                <SunIcon className="h-6 w-6 text-gray-400" /> : 
                <MoonIcon className="h-6 w-6 text-gray-500" />
              }
            </button>
            
            <Link href="/login" className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">
              Login / Sign Up
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content - Hero section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Welcome to</span>
            <span className="block text-indigo-600">Your Amazing App</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A brief description of what your application does and the value it provides to users.
          </p>
          <div className="mt-10 sm:flex sm:justify-center">
            <div className="rounded-md shadow">
              <Link href="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                Get Started
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Link href="#features" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}