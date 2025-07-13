"use client";

import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {message}
    </div>
  );
}