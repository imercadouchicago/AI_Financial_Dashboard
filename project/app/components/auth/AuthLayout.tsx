"use client";

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AuthLayout({ children, title = "FinancialOrganizer" }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Dark brand section */}
      <div className="hidden md:flex md:w-1/2 bg-[#0a0a20] items-center justify-center">
        <div className="p-12 max-w-md">
          <div className="flex items-center">
            <div className="relative h-12 w-12 mr-3">
              <div className="absolute bg-indigo-600 w-6 h-8 rounded-l-full left-0"></div>
              <div className="absolute bg-indigo-400 w-6 h-8 rounded-r-full right-0"></div>
              <div className="absolute h-4 w-4 bg-white rounded-full top-2 left-4"></div>
            </div>
            <h1 className="text-white text-3xl font-bold">{title}</h1>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md p-8 rounded-lg border border-gray-100 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}