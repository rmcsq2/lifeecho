'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

export default function WelcomePremium() {
  const [isActivated, setIsActivated] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');

  const { 
    isListening, 
    transcript, 
    isSupported, 
    error, 
    startListening, 
    stopListening,
    resetTrigger 
  } = useVoiceRecognition({
    triggerWord: localStorage.getItem('customTriggerWord') || 'echo',
    onTriggerDetected: () => {
      setIsActivated(true);
      console.log('Premium welcome activated!');
    },
    onTranscript: (text, isFinal) => {
      setCurrentTranscript(text);
      if (isFinal) {
        console.log('Premium transcript:', text);
        setTimeout(() => {
          setCurrentTranscript('');
          setIsActivated(false);
          resetTrigger();
        }, 3000);
      }
    }
  });

  useEffect(() => {
    if (isSupported) {
      startListening();
    }
  }, [isSupported, startListening]);

  const handleLogoClick = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

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

        {/* Logo - Blue Circle with Voice Wave and Gold Accent - Voice Activated */}
        <div className="w-80 h-80 mx-auto mb-12 relative">
          <button
            onClick={handleLogoClick}
            className={`w-full h-full transition-all duration-300 relative ${
              isActivated 
                ? 'scale-110 drop-shadow-2xl' 
                : isListening 
                ? 'scale-105 drop-shadow-lg animate-pulse' 
                : 'hover:scale-105'
            }`}
          >
            {/* Premium glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            
            {/* Voice activation glow */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-yellow-400 animate-ping opacity-75 blur-sm"></div>
                <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-300 to-yellow-300 animate-ping opacity-50 animation-delay-150 blur-sm"></div>
              </>
            )}
            
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center relative overflow-hidden shadow-lg z-10">
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
          </button>
        </div>

        {/* Instruction Text & Voice Status */}
        <div className="mb-8 text-center">
          <p className="font-canva-sans text-2xl text-gray-700 mb-4 leading-relaxed">
            {isActivated 
              ? 'Premium voice activated! Ask Echo anything...' 
              : isListening 
              ? `Say "${localStorage.getItem('customTriggerWord') || 'echo'}" then ask Echo anything for a personal response` 
              : 'Tap logo or say "Echo" - Ask Echo anything and get a personal response'
            }
          </p>
          
          {/* Live Transcription */}
          {(currentTranscript || isActivated) && (
            <div className="bg-gradient-to-r from-blue-50 to-yellow-50 border border-blue-200 rounded-lg p-4 mt-4 max-w-md mx-auto">
              <p className="font-canva-sans text-base text-blue-800">
                {currentTranscript || 'Premium listening mode active...'}
              </p>
            </div>
          )}
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 max-w-md mx-auto">
              <p className="font-canva-sans text-sm text-red-600">
                Voice Error: {error}
              </p>
            </div>
          )}
          
          {/* Browser Support Warning */}
          {!isSupported && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 max-w-md mx-auto">
              <p className="font-canva-sans text-sm text-yellow-700">
                Voice recognition not supported. Try Chrome or Edge for premium voice features.
              </p>
            </div>
          )}
        </div>

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
