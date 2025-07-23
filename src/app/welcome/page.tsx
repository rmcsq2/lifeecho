'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

export default function WelcomeGeneral() {
  const [isActivated, setIsActivated] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [triggerWord, setTriggerWord] = useState('echo');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTriggerWord(localStorage.getItem('customTriggerWord') || 'echo');
    }
  }, []);

  const { 
    isListening, 
    transcript, 
    isSupported, 
    error, 
    startListening, 
    stopListening,
    resetTrigger 
  } = useVoiceRecognition({
    triggerWord: triggerWord,
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
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-12" style={{ backgroundColor: 'var(--background)' }}>
      <div className="w-full text-center flex flex-col items-center">
        {/* Main Title */}
        <h1 className="font-league-spartan text-5xl font-bold mb-4 tracking-tight" style={{ color: 'var(--foreground)' }}>
          LIFE ECHOS
        </h1>

        {/* Subtitle */}
        <h2 className="font-canva-sans text-3xl mb-6 leading-tight" style={{ color: 'var(--foreground)' }}>
          RECORD LIFE AS IT HAPPENS
        </h2>

        {/* Logo - Blue Circle with Voice Wave - Voice Activated */}
        <div className="mx-auto mb-4 relative" style={{ width: '5720px', height: '5720px' }}>
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
            
            <Image
              src="/life-echo-logo.png"
              alt="Life Echo Logo"
              width={5720}
              height={5720}
              className="w-full h-full object-contain z-10 relative"
              priority
            />
          </button>
        </div>

        {/* Instruction Text - Right below logo */}
        <div className="mb-4 text-center">
          <p className="font-canva-sans text-2xl mb-2 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            {isActivated 
              ? 'Voice activated! Speak freely...' 
              : isListening 
              ? `Say "${triggerWord}" or your custom trigger word for hands free use` 
              : 'Tap logo or say "Echo" for hands free use'
            }
          </p>
        </div>

        {/* Voice Status */}
        <div className="mb-8 text-center">
          
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
        <p className="font-canva-sans text-3xl font-bold tracking-wide" style={{ color: 'var(--foreground)' }}>
          LIFE IS WHAT YOU MAKE IT
        </p>

        {/* Navigation Button */}
        <div className="mt-6 flex justify-center">
          <Link 
            href="/home"
            className="text-white font-canva-sans text-xl font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            style={{ backgroundColor: 'var(--primary-blue)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-blue-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-blue)'}
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
