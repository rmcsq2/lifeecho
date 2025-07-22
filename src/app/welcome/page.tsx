'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

export default function WelcomeGeneral() {
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
      console.log('Welcome screen activated!');
    },
    onTranscript: (text, isFinal) => {
      setCurrentTranscript(text);
      if (isFinal) {
        console.log('Welcome transcript:', text);
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

        {/* Logo - Blue Circle with Voice Wave - Voice Activated */}
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
            {/* Glow effect when listening */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75 blur-sm"></div>
                <div className="absolute inset-4 rounded-full bg-blue-300 animate-ping opacity-50 animation-delay-150 blur-sm"></div>
              </>
            )}
            
            <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center relative overflow-hidden z-10">
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
          </button>
        </div>

        {/* Instruction Text & Voice Status */}
        <div className="mb-16 text-center">
          <p className="font-canva-sans text-2xl text-gray-700 mb-4 leading-relaxed">
            {isActivated 
              ? 'Voice activated! Speak freely...' 
              : isListening 
              ? `Say "${localStorage.getItem('customTriggerWord') || 'echo'}" or your custom trigger word for hands free use` 
              : 'Tap logo or say "Echo" for hands free use'
            }
          </p>
          
          {/* Live Transcription */}
          {(currentTranscript || isActivated) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 max-w-md mx-auto">
              <p className="font-canva-sans text-base text-blue-800">
                {currentTranscript || 'Ready to listen...'}
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
                Voice recognition not supported. Try Chrome or Edge for full functionality.
              </p>
            </div>
          )}
        </div>

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
