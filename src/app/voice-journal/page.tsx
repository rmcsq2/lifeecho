'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { voiceNoteStorage } from '../../utils/voiceNoteStorage';

export default function VoiceJournal() {
  const [isActivated, setIsActivated] = useState(false);
  const [savedTranscripts, setSavedTranscripts] = useState<string[]>([]);
  const [triggerWord, setTriggerWord] = useState('echo');
  const [currentTranscript, setCurrentTranscript] = useState('');

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
      setCurrentTranscript('');
      console.log('Voice Journal activated!');
    },
    onTranscript: (text, isFinal) => {
      setCurrentTranscript(text);
    },
    onSubmitDetected: (finalText) => {
      if (finalText.trim()) {
        const savedNote = voiceNoteStorage.saveVoiceNote(finalText);
        setSavedTranscripts(prev => [...prev, finalText]);
        setCurrentTranscript('');
        setIsActivated(false);
        console.log('Voice Journal submitted:', savedNote);
      }
    },
    onStopDetected: () => {
      setIsActivated(false);
      setCurrentTranscript('');
      console.log('Voice Journal stopped by voice command');
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
    <div className="min-h-screen flex flex-col max-w-[864px] mx-auto" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="pt-16 pb-8">
        <h1 className="font-league-spartan text-4xl font-bold text-center" style={{ color: 'var(--foreground)' }}>
          Voice Journal
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Main Mic Button */}
        <div className="mb-12">
          <button
            onClick={handleMicClick}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 relative shadow-lg ${isListening ? 'animate-pulse' : ''}`}
            style={{
              backgroundColor: isActivated 
                ? '#ef4444' 
                : 'var(--primary-blue)',
              transform: isActivated 
                ? 'scale(1.1)' 
                : isListening 
                ? 'scale(1.05)' 
                : 'scale(1)',
              boxShadow: isActivated 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
                : isListening 
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Glow Animation */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></div>
                <div className="absolute inset-2 rounded-full bg-blue-300 animate-ping opacity-50 animation-delay-150"></div>
              </>
            )}
            
            {/* Mic Icon */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center relative z-10" style={{ backgroundColor: 'var(--card)' }}>
              <div className="w-8 h-8 rounded-full"
                   style={{
                     backgroundColor: isActivated ? '#ef4444' : 'var(--primary-blue)'
                   }}></div>
            </div>
          </button>
        </div>

        {/* Instruction Text */}
        <p className="font-canva-sans text-xl text-center mb-12 max-w-md" style={{ color: 'var(--muted-foreground)' }}>
          {isActivated 
            ? `Recording... say "${triggerWord} submit" to save` 
            : isListening 
            ? `Say "${triggerWord}" to start recording` 
            : 'Tap mic or say "Echo" to begin'
          }
        </p>

        {/* Live Transcription Box */}
        <div className="w-[300px] h-[120px] rounded-lg p-4 mb-8" style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)' }}>
          <p className="font-canva-sans text-base text-gray-600 leading-relaxed">
            {currentTranscript || transcript || (isActivated ? 'Listening...' : 'Your transcription will appear here...')}
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
      <footer className="flex items-center justify-center space-x-8 p-8 border-t" style={{ backgroundColor: 'var(--secondary)', borderColor: 'var(--border)' }}>
        <Link 
          href="/drop-pin"
          className="flex flex-col items-center space-y-2 p-3 hover:bg-accent rounded-lg transition-colors duration-200"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ef4444' }}>
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>
          <span className="font-canva-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>Pin</span>
        </Link>
        
        <Link 
          href="/reminders"
          className="flex flex-col items-center space-y-2 p-3 hover:bg-accent rounded-lg transition-colors duration-200"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f59e0b' }}>
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>
          <span className="font-canva-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>Remind</span>
        </Link>
        
        <Link 
          href="/notes"
          className="flex flex-col items-center space-y-2 p-3 hover:bg-accent rounded-lg transition-colors duration-200"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-blue)' }}>
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>
          <span className="font-canva-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>Notes</span>
        </Link>
        
        <Link 
          href="/photo-journal"
          className="flex flex-col items-center space-y-2 p-3 hover:bg-accent rounded-lg transition-colors duration-200"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#10b981' }}>
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>
          <span className="font-canva-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>Camera</span>
        </Link>
        
        <Link 
          href="/settings"
          className="flex flex-col items-center space-y-2 p-3 hover:bg-accent rounded-lg transition-colors duration-200"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6b7280' }}>
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>
          <span className="font-canva-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>More</span>
        </Link>
      </footer>
    </div>
  );
}
