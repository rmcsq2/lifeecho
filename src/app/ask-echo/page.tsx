'use client';

import React, { useState } from 'react';

export default function AskEcho() {
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const examplePrompts = [
    "What did I write about yesterday?",
    "Summarize my notes from this week",
    "What are my upcoming reminders?",
    "Show me my most recent voice recordings"
  ];

  const handleMicClick = () => {
    if (!isListening) {
      setIsListening(true);
      setResponse('');
      setTimeout(() => {
        setIsListening(false);
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setResponse("I found 3 notes from yesterday about your project ideas and weekend plans. Would you like me to read them to you or show you the details?");
        }, 2000);
      }, 3000);
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
    <div className="min-h-screen bg-white flex flex-col max-w-[864px] mx-auto">
      {/* Header */}
      <header className="pt-16 pb-8">
        <h1 className="font-league-spartan text-4xl font-bold text-center text-gray-900">
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
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 relative ${
              isListening 
                ? 'bg-blue-500 shadow-2xl scale-110' 
                : isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
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
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center relative z-10">
              <div className={`w-8 h-8 rounded-full ${
                isProcessing ? 'bg-gray-400' : 'bg-blue-500'
              }`}></div>
            </div>
          </button>
        </div>

        {/* Status Text */}
        <p className="font-canva-sans text-xl text-center text-gray-700 mb-8">
          {isListening 
            ? 'Listening... ask me anything!' 
            : isProcessing 
            ? 'Processing your question...'
            : 'Tap to ask Echo a question'
          }
        </p>

        {/* Response Window */}
        <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-lg p-6 mb-12 min-h-[120px]">
          {response ? (
            <p className="font-canva-sans text-base text-gray-700 leading-relaxed">
              {response}
            </p>
          ) : (
            <p className="font-canva-sans text-base text-gray-500 italic text-center">
              Echo's response will appear here...
            </p>
          )}
        </div>

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
    </div>
  );
}
