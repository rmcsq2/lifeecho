'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function VoiceJournal() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTranscription('Listening... speak your thoughts');
    } else {
      setTranscription('Recording stopped. Your thoughts have been saved.');
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
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500 shadow-2xl scale-110' 
                : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
            }`}
          >
            {/* Pulse Animation Ring */}
            {isRecording && (
              <div className="absolute w-32 h-32 rounded-full border-4 border-red-300 animate-ping opacity-75"></div>
            )}
            
            {/* Mic Icon */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isRecording ? 'bg-white' : 'bg-white'
            }`}>
              <div className={`w-8 h-8 rounded-full ${
                isRecording ? 'bg-red-500' : 'bg-blue-500'
              }`}></div>
            </div>
          </button>
        </div>

        {/* Instruction Text */}
        <p className="font-canva-sans text-xl text-center text-gray-700 mb-12 max-w-md">
          Speak your thoughts, and I'll save them.
        </p>

        {/* Live Transcription Box */}
        <div className="w-[300px] h-[120px] bg-gray-50 border border-gray-200 rounded-lg p-4 mb-16">
          <p className="font-canva-sans text-base text-gray-600 leading-relaxed">
            {transcription || 'Your transcription will appear here...'}
          </p>
        </div>
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
