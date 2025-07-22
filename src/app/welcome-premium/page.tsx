'use client';

import React from 'react';
import Link from 'next/link';

export default function WelcomePremium() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex flex-col items-center justify-center px-8 py-12">
      <div className="w-full max-w-sm text-center">
        {/* Premium Badge */}
        <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-yellow-500 text-white px-4 py-2 rounded-full font-canva-sans text-sm font-medium mb-6">
          ✨ PREMIUM
        </div>

        {/* Main Title */}
        <h1 className="font-league-spartan text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          LIFE ECHOS
        </h1>

        {/* Subtitle */}
        <h2 className="font-canva-sans text-3xl text-gray-900 mb-12 leading-tight">
          RECORD LIFE AS IT HAPPENS
        </h2>

        {/* Logo - Blue Circle with Voice Wave and Gold Accent */}
        <div className="w-80 h-80 mx-auto mb-12 relative">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center relative overflow-hidden shadow-lg">
            {/* Gold Ring */}
            <div className="absolute inset-2 border-4 border-yellow-400 rounded-full opacity-60"></div>
            
            {/* Voice Wave Pattern */}
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-8 bg-white rounded-full opacity-90"></div>
              <div className="w-2 h-12 bg-yellow-200 rounded-full opacity-95"></div>
              <div className="w-2 h-6 bg-white rounded-full opacity-80"></div>
              <div className="w-2 h-16 bg-yellow-300 rounded-full opacity-100"></div>
              <div className="w-2 h-10 bg-white rounded-full opacity-90"></div>
              <div className="w-2 h-14 bg-yellow-200 rounded-full opacity-95"></div>
              <div className="w-2 h-8 bg-white rounded-full opacity-90"></div>
              <div className="w-2 h-12 bg-yellow-200 rounded-full opacity-95"></div>
              <div className="w-2 h-6 bg-white rounded-full opacity-80"></div>
            </div>
          </div>
        </div>

        {/* Instruction Text */}
        <p className="font-canva-sans text-2xl text-gray-700 mb-8 leading-relaxed">
          Ask Echo anything and get a personal response
        </p>

        {/* Premium Features CTA */}
        <div className="bg-gradient-to-r from-blue-500 to-yellow-500 text-white p-4 rounded-lg mb-8">
          <p className="font-canva-sans text-lg font-medium">
            Explore Premium Features
          </p>
        </div>

        {/* Footer Tagline */}
        <p className="font-canva-sans text-3xl font-bold text-gray-900 tracking-wide mb-12">
          LIFE IS WHAT YOU MAKE IT
        </p>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <Link 
            href="/home"
            className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-canva-sans text-xl font-medium py-3 px-8 rounded-lg transition-all duration-200 shadow-md"
          >
            Get Started
          </Link>
          <Link 
            href="/welcome"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-canva-sans text-lg py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Standard Version
          </Link>
        </div>
      </div>
    </div>
  );
}
