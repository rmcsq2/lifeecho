'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

  const handleSubmit = () => {
    if (currentTranscript.trim()) {
      const savedNote = voiceNoteStorage.saveVoiceNote(currentTranscript);
      setSavedTranscripts(prev => [...prev, currentTranscript]);
      setCurrentTranscript('');
      setIsActivated(false);
      console.log('Voice Journal submitted:', savedNote);
    }
  };

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
    onAutoSave: (text) => {
      console.log('Auto-saving voice journal after 5 seconds of silence:', text);
      const savedNote = voiceNoteStorage.saveVoiceNote(text);
      setSavedTranscripts(prev => [...prev, text]);
      setCurrentTranscript('');
      setIsActivated(false);
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


  return (
    <div className="min-h-screen flex flex-col max-w-[864px] mx-auto" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Header Area */}
      <header className="pt-8 pb-6 px-8">
        <div className="flex items-start justify-between mb-4">
          {/* Home Icon */}
          <div className="w-8 h-8 bg-black rounded-sm"></div>
          
          {/* Title Section */}
          <div className="flex-1 text-center">
            <h1 className="font-league-spartan text-4xl font-bold text-black mb-2">
              LIFE ECHOS
            </h1>
            <h2 className="font-league-spartan text-xl font-medium" style={{ color: '#4E4B4B' }}>
              FULL NOTES
            </h2>
          </div>
          
          {/* Spacer for alignment */}
          <div className="w-8"></div>
        </div>
        
        {/* Voice Activation Section */}
        <div className="flex items-center justify-between mt-8">
          <p className="font-canva-sans text-lg font-medium" style={{ color: '#4E4B4B' }}>
            Say 'Echo' to Dictate Notes
          </p>
          
          {/* Voice Wave Logo */}
          <div className="w-16 h-16 relative">
            <Image
              src="/logo.png"
              alt="Voice Wave Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8">
        {/* Notes Area */}
        <div className="bg-white rounded-lg p-6 mb-6" style={{ minHeight: '300px' }}>
          {/* Live Transcription */}
          <div className="mb-4">
            <p className="font-canva-sans text-lg leading-relaxed text-black">
              {currentTranscript || transcript || 'Scroll thru date and time stamped notes.'}
            </p>
            {!currentTranscript && !transcript && (
              <p className="font-canva-sans text-lg leading-relaxed text-gray-500 mt-2">
                Revise and resubmit information.
              </p>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!currentTranscript.trim()}
              className="px-6 py-2 rounded-lg font-canva-sans text-white font-medium transition-opacity duration-200"
              style={{ 
                backgroundColor: '#3B6EFF',
                opacity: currentTranscript.trim() ? 1 : 0.5
              }}
            >
              Submit
            </button>
          </div>
        </div>
        
        {/* Auto-Save Note */}
        <p className="font-canva-sans text-sm text-gray-400 mb-8">
          Notes will save automatically if submit button is not pressed after 5 sec pause.
        </p>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="font-canva-sans text-sm text-red-600">
              Voice Error: {error}
            </p>
          </div>
        )}

        {/* Browser Support Warning */}
        {!isSupported && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="font-canva-sans text-sm text-yellow-700">
              Voice recognition not supported. Try Chrome or Edge.
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <footer className="flex items-center justify-center space-x-12 p-6 bg-white border-t border-gray-200">
        <Link 
          href="/drop-pin"
          className="flex flex-col items-center space-y-1"
        >
          <div className="w-8 h-8 bg-black rounded-sm"></div>
          <span className="font-canva-sans text-sm" style={{ color: '#4E4B4B' }}>Pin</span>
        </Link>
        
        <Link 
          href="/reminders"
          className="flex flex-col items-center space-y-1"
        >
          <div className="w-8 h-8 bg-black rounded-sm"></div>
          <span className="font-canva-sans text-sm" style={{ color: '#4E4B4B' }}>Remind</span>
        </Link>
        
        <Link 
          href="/notes"
          className="flex flex-col items-center space-y-1"
        >
          <div className="w-8 h-8 bg-black rounded-sm"></div>
          <span className="font-canva-sans text-sm" style={{ color: '#4E4B4B' }}>Notes</span>
        </Link>
        
        <Link 
          href="/photo-journal"
          className="flex flex-col items-center space-y-1"
        >
          <div className="w-8 h-8 bg-black rounded-sm"></div>
          <span className="font-canva-sans text-sm" style={{ color: '#4E4B4B' }}>Camera</span>
        </Link>
        
        <Link 
          href="/settings"
          className="flex flex-col items-center space-y-1"
        >
          <div className="w-8 h-8 bg-black rounded-sm"></div>
          <span className="font-canva-sans text-sm" style={{ color: '#4E4B4B' }}>More</span>
        </Link>
      </footer>
    </div>
  );
}
