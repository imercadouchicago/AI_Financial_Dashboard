"use client";

import React from 'react';

export function FormDivider() {
  return (
    <div className="flex items-center my-6">
      <div className="flex-1 border-t border-gray-300"></div>
      <div className="px-4 text-sm text-gray-500">Or</div>
      <div className="flex-1 border-t border-gray-300"></div>
    </div>
  );
}