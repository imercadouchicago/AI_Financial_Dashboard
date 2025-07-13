"use client";

import React from 'react';

interface AuthButtonProps {
  type?: 'submit' | 'button';
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export function AuthButton({ type = 'submit', children, disabled = false, onClick }: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      disabled={disabled}
    >
      {children}
    </button>
  );
}