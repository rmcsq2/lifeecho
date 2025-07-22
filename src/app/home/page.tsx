'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

export default function Home() {
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
      console.log('Echo trigger detected!');
    },
    onTranscript: (text, isFinal) => {
      setCurrentTranscript(text);
      if (isFinal) {
        console.log('Final transcript:', text);
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

  const handleVoiceActivation = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col max-w-[864px] mx-auto">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-16">
        {/* Blue Circle with Logo - 40% screen width */}
        <div className="relative mb-16 w-[40%] aspect-square max-w-[300px] min-w-[200px]">
          <button
            onClick={handleVoiceActivation}
            className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
              isActivated 
                ? 'shadow-2xl scale-110' 
                : isListening 
                ? 'shadow-lg scale-105 animate-pulse' 
                : 'hover:scale-102'
            }`}
          >
            {/* Glow Animation Rings */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></div>
                <div className="absolute inset-2 rounded-full bg-blue-300 animate-ping opacity-50 animation-delay-150"></div>
              </>
            )}
            
            {/* Logo Image */}
            <div className="w-full h-full relative z-10">
              <Image
                src="/logo.png"
                alt="Life Echo Logo - Voice Activated"
                fill
                className="object-contain"
                priority
              />
            </div>
          </button>
        </div>

        {/* Status Text & Voice Feedback */}
        <div className="mb-16 text-center">
          <p className="font-canva-sans text-xl text-gray-600 mb-4">
            {isActivated 
              ? 'Listening... speak your thoughts' 
              : isListening 
              ? `Say "${localStorage.getItem('customTriggerWord') || 'echo'}" to activate` 
              : 'Tap logo or say "Echo"'
            }
          </p>
          
          {/* Live Transcription */}
          {(currentTranscript || isActivated) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 max-w-md mx-auto">
              <p className="font-canva-sans text-base text-blue-800">
                {currentTranscript || 'Ready to record...'}
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

        {/* 5 Icon Row */}
        <div className="flex items-center justify-between w-full max-w-md mb-16">
          <Link 
            href="/notes"
            className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <span className="font-canva-sans text-base text-gray-700">Notes</span>
          </Link>
          
          <Link 
            href="/transcripts"
            className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <span className="font-canva-sans text-base text-gray-700">Transcripts</span>
          </Link>
          
          <Link 
            href="/drop-pin"
            className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <span className="font-canva-sans text-base text-gray-700">Drop-a-Pin</span>
          </Link>
          
          <Link 
            href="/photo-journal"
            className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <span className="font-canva-sans text-base text-gray-700">Photo</span>
          </Link>
          
          <Link 
            href="/more"
            className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <span className="font-canva-sans text-base text-gray-700">More</span>
          </Link>
        </div>
      </main>

      {/* Bottom Navigation - Minimal */}
      <nav className="flex items-center justify-center p-6 bg-white border-t border-gray-100">
        <div className="flex items-center space-x-8">
          <Link href="/home" className="flex flex-col items-center space-y-1">
            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            <span className="font-canva-sans text-base text-blue-500 font-medium">Home</span>
          </Link>
          
          <button 
            onClick={handleVoiceActivation}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
              isListening ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isListening ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
            }`}>
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className={`font-canva-sans text-base ${
              isListening ? 'text-blue-500' : 'text-gray-400'
            }`}>Voice</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
