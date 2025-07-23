'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { voiceNoteStorage } from '../../utils/voiceNoteStorage';

export default function Home() {
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
      setCurrentTranscript('');
      console.log('Echo trigger detected!');
    },
    onTranscript: (text, isFinal) => {
      setCurrentTranscript(text);
    },
    onAutoSave: (text) => {
      console.log('Auto-saving home notes after 5 seconds of silence:', text);
      if (text.trim()) {
        const savedNote = voiceNoteStorage.saveVoiceNote(text);
        console.log('Home note saved:', savedNote);
      }
      setCurrentTranscript('');
      setIsActivated(false);
    },
    onSubmitDetected: (finalText) => {
      if (finalText.trim()) {
        const savedNote = voiceNoteStorage.saveVoiceNote(finalText);
        console.log('Home transcript submitted:', savedNote);
        setTimeout(() => {
          setCurrentTranscript('');
          setIsActivated(false);
          resetTrigger();
        }, 1000);
      }
    },
    onStopDetected: () => {
      setIsActivated(false);
      setCurrentTranscript('');
      console.log('Home voice stopped by voice command');
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
    <div className="min-h-screen flex flex-col max-w-[864px] mx-auto" 
         style={{ 
           background: 'linear-gradient(to bottom, var(--secondary), var(--background))'
         }}>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-16">
        {/* Logo - 40% screen width */}
        <div className="relative mb-16 w-[40%] aspect-square max-w-[300px] min-w-[200px]">
          <button
            onClick={handleVoiceActivation}
            className={`w-full h-full flex items-center justify-center transition-all duration-300 relative ${
              isActivated 
                ? 'scale-110' 
                : isListening 
                ? 'scale-105 animate-pulse' 
                : 'hover:scale-102'
            }`}
          >
            {/* Logo Image */}
            <div className="w-full h-full relative">
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
          <p className="font-canva-sans text-xl mb-4" style={{ color: 'var(--muted-foreground)' }}>
            {isActivated 
              ? `Voice activated! Say "${triggerWord} submit" to save` 
              : isListening 
              ? `Say "${triggerWord}" to activate` 
              : 'Tap logo or say "Echo"'
            }
          </p>
          
          {/* Live Transcription */}
          {(currentTranscript || isActivated) && (
            <div className="rounded-lg p-4 mt-4 max-w-md mx-auto" style={{ backgroundColor: 'var(--accent)', border: '1px solid var(--border)' }}>
              <p className="font-canva-sans text-base" style={{ color: 'var(--primary-blue)' }}>
                {currentTranscript || 'Ready to record...'}
              </p>
            </div>
          )}
          
          {/* Error Display */}
          {error && (
            <div className="rounded-lg p-4 mt-4 max-w-md mx-auto" style={{ backgroundColor: 'var(--destructive)', border: '1px solid var(--border)' }}>
              <p className="font-canva-sans text-sm" style={{ color: 'var(--destructive-foreground)' }}>
                Voice Error: {error}
              </p>
            </div>
          )}
          
          {/* Browser Support Warning */}
          {!isSupported && (
            <div className="rounded-lg p-4 mt-4 max-w-md mx-auto" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
              <p className="font-canva-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Voice recognition not supported. Try Chrome or Edge for full functionality.
              </p>
            </div>
          )}
        </div>

        {/* 5 Icon Row */}
        <div className="flex items-center justify-between w-full max-w-md mb-16">
          <Link 
            href="/notes"
            className="flex flex-col items-center space-y-2 p-3 rounded-lg transition-colors duration-200 hover:bg-accent"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-blue)' }}>
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <span className="font-canva-sans text-base text-muted-foreground">Notes</span>
          </Link>
          
          <Link 
            href="/reminders"
            className="flex flex-col items-center space-y-2 p-3 rounded-lg transition-colors duration-200 hover:bg-accent"
          >
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <span className="font-canva-sans text-base text-muted-foreground">Remind</span>
          </Link>
          
          <Link 
            href="/drop-pin"
            className="flex flex-col items-center space-y-2 p-3 rounded-lg transition-colors duration-200 hover:bg-accent"
          >
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <span className="font-canva-sans text-base text-muted-foreground">Drop-a-Pin</span>
          </Link>
          
          <Link 
            href="/photo-journal"
            className="flex flex-col items-center space-y-2 p-3 rounded-lg transition-colors duration-200 hover:bg-accent"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <span className="font-canva-sans text-base text-muted-foreground">Photo</span>
          </Link>
          
          <Link 
            href="/more"
            className="flex flex-col items-center space-y-2 p-3 rounded-lg transition-colors duration-200 hover:bg-accent"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <span className="font-canva-sans text-base text-muted-foreground">More</span>
          </Link>
        </div>
      </main>

      {/* Bottom Navigation - Minimal */}
      <nav className="flex items-center justify-center p-6 border-t" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
        <div className="flex items-center space-x-8">
          <Link href="/home" className="flex flex-col items-center space-y-1">
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: 'var(--primary-blue)' }}></div>
            <span className="font-canva-sans text-base font-medium" style={{ color: 'var(--primary-blue)' }}>Home</span>
          </Link>
          
          <button 
            onClick={handleVoiceActivation}
            className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200"
            style={{ 
              backgroundColor: isListening ? 'var(--accent)' : 'transparent'
            }}
            onMouseEnter={(e) => !isListening && (e.currentTarget.style.backgroundColor = 'var(--accent)')}
            onMouseLeave={(e) => !isListening && (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isListening ? 'animate-pulse' : ''}`}
                 style={{ 
                   backgroundColor: isListening ? 'var(--primary-blue)' : 'var(--muted)' 
                 }}>
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="font-canva-sans text-base"
                  style={{ 
                    color: isListening ? 'var(--primary-blue)' : 'var(--muted-foreground)' 
                  }}>Voice</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
