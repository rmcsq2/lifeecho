'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function WelcomeGeneral() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 py-12">
      <div className="w-full max-w-sm text-center">
        {/* Main Title */}
        <h1 className="font-league-spartan text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          LIFE ECHOS
        </h1>

        {/* Subtitle */}
        <h2 className="font-canva-sans text-3xl text-gray-900 mb-12 leading-tight">
          RECORD LIFE AS IT HAPPENS
        </h2>

        {/* Logo - Blue Circle with Voice Wave */}
        <div className="w-80 h-80 mx-auto mb-12 relative">
          <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center relative overflow-hidden">
            {/* Voice Wave Pattern */}
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-8 bg-white rounded-full opacity-80"></div>
              <div className="w-2 h-12 bg-white rounded-full opacity-90"></div>
              <div className="w-2 h-6 bg-white rounded-full opacity-70"></div>
              <div className="w-2 h-16 bg-white rounded-full opacity-95"></div>
              <div className="w-2 h-10 bg-white rounded-full opacity-85"></div>
              <div className="w-2 h-14 bg-white rounded-full opacity-90"></div>
              <div className="w-2 h-8 bg-white rounded-full opacity-80"></div>
              <div className="w-2 h-12 bg-white rounded-full opacity-90"></div>
              <div className="w-2 h-6 bg-white rounded-full opacity-70"></div>
            </div>
          </div>
        </div>

        {/* Instruction Text */}
        <p className="font-canva-sans text-2xl text-gray-700 mb-16 leading-relaxed">
          Say "Echo" or your custom "Trigger Word" for hands free use
        </p>

        {/* Footer Tagline */}
        <p className="font-canva-sans text-3xl font-bold text-gray-900 tracking-wide">
          LIFE IS WHAT YOU MAKE IT
        </p>

        {/* Navigation Button */}
        <div className="mt-12">
          <Link 
            href="/home"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-canva-sans text-xl font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
