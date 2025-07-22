'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

export default function VoiceJournal() {
  const [isActivated, setIsActivated] = useState(false);
  const [savedTranscripts, setSavedTranscripts] = useState<string[]>([]);

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
      console.log('Voice Journal activated!');
    },
    onTranscript: (text, isFinal) => {
      if (isFinal && text.trim()) {
        setSavedTranscripts(prev => [...prev, text]);
        setTimeout(() => {
          setIsActivated(false);
          resetTrigger();
        }, 2000);
      }
    }
  });

  useEffect(() => {
    if (isSupported) {
      startListening();
    }
  }, [isSupported, startListening]);

  const handleMicClick = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[864px] mx-auto">
      {/* Header */}
      <header className="pt-16 pb-8">
        <h1 className="font-league-spartan text-4xl font-bold text-center text-gray-900">
          Voice Journal
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Main Mic Button */}
        <div className="mb-12">
          <button
            onClick={handleMicClick}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 relative ${
              isActivated 
                ? 'bg-red-500 shadow-2xl scale-110' 
                : isListening
                ? 'bg-blue-500 shadow-lg scale-105 animate-pulse'
                : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
            }`}
          >
            {/* Glow Animation */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></div>
                <div className="absolute inset-2 rounded-full bg-blue-300 animate-ping opacity-50 animation-delay-150"></div>
              </>
            )}
            
            {/* Mic Icon */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center relative z-10 ${
              isActivated ? 'bg-white' : 'bg-white'
            }`}>
              <div className={`w-8 h-8 rounded-full ${
                isActivated ? 'bg-red-500' : 'bg-blue-500'
              }`}></div>
            </div>
          </button>
        </div>

        {/* Instruction Text */}
        <p className="font-canva-sans text-xl text-center text-gray-700 mb-12 max-w-md">
          {isActivated 
            ? 'Recording... speak your thoughts' 
            : isListening 
            ? `Say "${localStorage.getItem('customTriggerWord') || 'echo'}" to start recording` 
            : 'Tap mic or say "Echo" to begin'
          }
        </p>

        {/* Live Transcription Box */}
        <div className="w-[300px] h-[120px] bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
          <p className="font-canva-sans text-base text-gray-600 leading-relaxed">
            {transcript || (isActivated ? 'Listening...' : 'Your transcription will appear here...')}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-sm mx-auto">
            <p className="font-canva-sans text-sm text-red-600">
              Voice Error: {error}
            </p>
          </div>
        )}

        {/* Browser Support Warning */}
        {!isSupported && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 max-w-sm mx-auto">
            <p className="font-canva-sans text-sm text-yellow-700">
              Voice recognition not supported. Try Chrome or Edge.
            </p>
          </div>
        )}

        {/* Saved Transcripts */}
        {savedTranscripts.length > 0 && (
          <div className="w-full max-w-sm mb-8">
            <h3 className="font-canva-sans text-lg font-medium text-gray-800 mb-4">Recent Recordings:</h3>
            <div className="space-y-2">
              {savedTranscripts.slice(-3).map((text, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="font-canva-sans text-sm text-blue-800">{text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer - Quick Icons */}
      <footer className="flex items-center justify-center space-x-12 p-8 bg-gray-50 border-t border-gray-100">
        <Link 
          href="/notes"
          className="flex flex-col items-center space-y-2 p-3 hover:bg-white rounded-lg transition-colors duration-200"
        >
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>
          <span className="font-canva-sans text-sm text-gray-700">Notes</span>
        </Link>
        
        <Link 
          href="/note-history"
          className="flex flex-col items-center space-y-2 p-3 hover:bg-white rounded-lg transition-colors duration-200"
        >
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>
          <span className="font-canva-sans text-sm text-gray-700">History</span>
        </Link>
      </footer>
    </div>
  );
}
