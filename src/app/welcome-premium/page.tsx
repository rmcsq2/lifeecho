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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 py-12">
      <div className="w-full text-center flex flex-col items-center">
        {/* Premium Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-full font-canva-sans text-sm font-medium">
            ✨ PREMIUM
          </div>
        </div>

        {/* Main Title */}
        <h1 className="font-league-spartan text-5xl font-bold mb-4 tracking-tight" style={{ color: 'var(--foreground)' }}>
          LIFE ECHOS
        </h1>

        {/* Subtitle */}
        <h2 className="font-canva-sans text-3xl mb-6 leading-tight" style={{ color: 'var(--foreground)' }}>
          RECORD LIFE AS IT HAPPENS
        </h2>

        {/* Logo - Blue Circle with Voice Wave and Gold Accent - Voice Activated */}
        <div className="mx-auto mb-4 relative" style={{ width: '572px', height: '572px' }}>
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
            {/* Voice activation glow */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75 blur-sm"></div>
                <div className="absolute inset-4 rounded-full bg-blue-300 animate-ping opacity-50 animation-delay-150 blur-sm"></div>
              </>
            )}
            
            <Image
              src="/life-echo-logo.png"
              alt="Life Echo Logo"
              width={572}
              height={572}
              className="w-full h-full object-contain z-10 relative"
              priority
            />
          </button>
        </div>

        {/* Instruction Text - Right below logo */}
        <div className="mb-4 text-center">
          <p className="font-canva-sans text-2xl mb-2 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            {isActivated 
              ? 'Premium voice activated! Ask Echo anything...' 
              : isListening 
              ? `Say "${localStorage.getItem('customTriggerWord') || 'echo'}" then ask Echo anything for a personal response` 
              : 'Tap logo or say "Echo" - Ask Echo anything and get a personal response'
            }
          </p>
        </div>

        {/* Voice Status */}
        <div className="mb-4 text-center">
          
          {/* Live Transcription */}
          {(currentTranscript || isActivated) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 max-w-md mx-auto">
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
        <div className="bg-blue-500 text-white p-4 rounded-lg mb-8 text-center">
          <p className="font-canva-sans text-lg font-medium">
            Explore Premium Features
          </p>
        </div>

        {/* Footer Tagline */}
        <p className="font-canva-sans text-3xl font-bold tracking-wide mb-6" style={{ color: 'var(--foreground)' }}>
          LIFE IS WHAT YOU MAKE IT
        </p>

        {/* Navigation Buttons */}
        <div className="space-y-4 flex flex-col items-center w-full max-w-xs">
          <Link 
            href="/home"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-canva-sans text-xl font-medium py-3 px-8 rounded-lg transition-all duration-200 shadow-md text-center"
          >
            Get Started
          </Link>
          <Link 
            href="/welcome"
            className="w-full font-canva-sans text-lg py-2 px-6 rounded-lg transition-colors duration-200 text-center"
            style={{ 
              backgroundColor: 'var(--secondary)', 
              color: 'var(--muted-foreground)' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
          >
            Standard Version
          </Link>
        </div>
      </div>
    </div>
  );
}
