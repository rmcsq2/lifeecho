'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

export default function AskEcho() {
  const [isActivated, setIsActivated] = useState(false);
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [triggerWord, setTriggerWord] = useState('echo');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTriggerWord(localStorage.getItem('customTriggerWord') || 'echo');
    }
  }, []);

  const examplePrompts = [
    "What did I write about yesterday?",
    "Summarize my notes from this week",
    "What are my upcoming reminders?",
    "Show me my most recent voice recordings"
  ];

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
      setResponse('');
      console.log('Ask Echo activated!');
    },
    onTranscript: (text, isFinal) => {
    },
    onSubmitDetected: (finalText) => {
      if (finalText.trim()) {
        setIsActivated(false);
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setResponse(`Here's what I found about "${finalText}": You have several entries that might interest you. Let me gather that information for you.`);
          resetTrigger();
        }, 2000);
      }
    },
    onStopDetected: () => {
      setIsActivated(false);
      setResponse('');
      console.log('Ask Echo stopped by voice command');
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

  const handlePromptClick = (prompt: string) => {
    setResponse('');
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setResponse(`Here's what I found about "${prompt.toLowerCase()}": You have several entries that might interest you. Let me gather that information for you.`);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-[864px] mx-auto" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="pt-16 pb-8">
        <h1 className="font-league-spartan text-4xl font-bold text-center" style={{ color: 'var(--foreground)' }}>
          Ask Echo
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-8">
        {/* Voice Activation Area */}
        <div className="mb-12">
          <button
            onClick={handleMicClick}
            disabled={isProcessing}
            className={`w-32 h-32 flex items-center justify-center transition-all duration-300 relative ${
              isActivated 
                ? 'scale-110' 
                : isListening 
                ? 'scale-105 animate-pulse' 
                : isProcessing
                ? 'cursor-not-allowed'
                : 'hover:scale-105'
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

        {/* Status Text */}
        <p className="font-canva-sans text-xl text-center mb-8" style={{ color: 'var(--muted-foreground)' }}>
          {isActivated 
            ? `Listening... say "${triggerWord} submit" to ask` 
            : isListening 
            ? `Say "${triggerWord}" then ask your question` 
            : isProcessing 
            ? 'Processing your question...'
            : 'Tap mic or say "Echo" to ask a question'
          }
        </p>

        {/* Live Transcript Display */}
        {(transcript || isActivated) && (
          <div className="w-full max-w-md bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="font-canva-sans text-base text-blue-800">
              {transcript || 'Listening for your question...'}
            </p>
          </div>
        )}

        {/* Response Window */}
        <div className="w-full max-w-md rounded-lg p-6 mb-12 min-h-[120px]" style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)' }}>
          {response ? (
            <p className="font-canva-sans text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              {response}
            </p>
          ) : (
            <p className="font-canva-sans text-base text-gray-500 italic text-center">
              Echo's response will appear here...
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-md">
            <p className="font-canva-sans text-sm text-red-600">
              Voice Error: {error}
            </p>
          </div>
        )}

        {/* Browser Support Warning */}
        {!isSupported && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 max-w-md">
            <p className="font-canva-sans text-sm text-yellow-700">
              Voice recognition not supported. Try Chrome or Edge.
            </p>
          </div>
        )}

        {/* Example Prompts */}
        <div className="w-full max-w-md">
          <h3 className="font-canva-sans text-lg font-medium text-gray-800 mb-4 text-center">
            Try asking:
          </h3>
          <div className="space-y-3">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                disabled={isListening || isProcessing}
                className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p className="font-canva-sans text-base text-gray-600">
                  "{prompt}"
                </p>
              </button>
            ))}
          </div>
        </div>
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
