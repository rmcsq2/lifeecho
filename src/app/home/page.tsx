'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceActivation = () => {
    setIsListening(!isListening);
    console.log('Voice activation toggled:', !isListening);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-gray-100">
        <h1 className="font-league-spartan text-2xl font-bold text-gray-900">
          Life Echo
        </h1>
        <Link href="/profile" className="w-8 h-8 bg-gray-200 rounded-full"></Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        {/* Voice Activation Circle */}
        <div className="relative mb-12">
          <button
            onClick={handleVoiceActivation}
            className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'bg-blue-500 shadow-lg scale-105' 
                : 'bg-blue-400 hover:bg-blue-500'
            }`}
          >
            {/* Pulse Animation Ring */}
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping opacity-75"></div>
            )}
            
            {/* Microphone Icon */}
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            </div>
          </button>
        </div>

        {/* Status Text */}
        <p className="font-canva-sans text-xl text-gray-600 mb-8 text-center">
          {isListening ? 'Listening...' : 'Tap to activate or say "Echo"'}
        </p>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <Link 
            href="/drop-pin"
            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2"></div>
            <span className="font-canva-sans text-sm font-medium text-gray-700">Drop Pin</span>
          </Link>
          
          <Link 
            href="/voice-journal"
            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2"></div>
            <span className="font-canva-sans text-sm font-medium text-gray-700">Voice Journal</span>
          </Link>
          
          <Link 
            href="/photo-journal"
            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2"></div>
            <span className="font-canva-sans text-sm font-medium text-gray-700">Photo Journal</span>
          </Link>
          
          <Link 
            href="/reminders"
            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-2"></div>
            <span className="font-canva-sans text-sm font-medium text-gray-700">Reminders</span>
          </Link>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="flex items-center justify-around p-4 border-t border-gray-100 bg-white">
        <Link href="/home" className="flex flex-col items-center space-y-1">
          <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
          <span className="font-canva-sans text-xs text-blue-500">Home</span>
        </Link>
        
        <Link href="/notes" className="flex flex-col items-center space-y-1">
          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
          <span className="font-canva-sans text-xs text-gray-400">Notes</span>
        </Link>
        
        <Link href="/ask-echo" className="flex flex-col items-center space-y-1">
          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
          <span className="font-canva-sans text-xs text-gray-400">Ask Echo</span>
        </Link>
        
        <Link href="/settings" className="flex flex-col items-center space-y-1">
          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
          <span className="font-canva-sans text-xs text-gray-400">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
