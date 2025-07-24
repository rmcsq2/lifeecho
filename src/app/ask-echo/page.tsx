'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { voiceNoteStorage } from '../../utils/voiceNoteStorage';
import { translationService } from '../../utils/translationService';

export default function AskEcho() {
  const [isActivated, setIsActivated] = useState(false);
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [triggerWord, setTriggerWord] = useState('echo');
  const [translatedContent, setTranslatedContent] = useState<{text: string, language: string} | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

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

  const handleTranslation = async (text: string, targetLanguage: string) => {
    setIsTranslating(true);
    try {
      const languageCode = translationService.getLanguageCode(targetLanguage) || targetLanguage;
      const result = await translationService.translateText(text, languageCode);
      setTranslatedContent({
        text: result.translatedText,
        language: translationService.getSupportedLanguages()[languageCode] || targetLanguage
      });
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleManualTranslation = async (targetLanguage: string) => {
    const textToTranslate = response;
    if (textToTranslate.trim()) {
      await handleTranslation(textToTranslate, targetLanguage);
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
      setResponse('');
      setTranslatedContent(null);
      console.log('Ask Echo activated!');
    },
    onTranscript: () => {
    },
    onAutoSave: async (text) => {
      console.log('Auto-saving ask echo notes after 5 seconds of silence:', text);
      if (text.trim()) {
        const savedNote = await voiceNoteStorage.saveVoiceNote(text);
        console.log('Ask Echo note saved:', savedNote);
      }
    },
    onSubmitDetected: async (finalText) => {
      if (finalText.trim()) {
        const savedNote = await voiceNoteStorage.saveVoiceNote(finalText);
        console.log('Ask Echo note submitted:', savedNote);
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
      setTranslatedContent(null);
      console.log('Ask Echo stopped by voice command');
    },
    onTranslationDetected: handleTranslation
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
        <h1 className="font-league-spartan text-4xl font-bold text-left" style={{ color: 'var(--foreground)' }}>
          LIFE ECHOS
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
        <div className="w-full max-w-md rounded-lg p-6 mb-6 min-h-[120px]" style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)' }}>
          {response ? (
            <p className="font-canva-sans text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              {response}
            </p>
          ) : (
            <p className="font-canva-sans text-base text-gray-500 italic text-center">
              Echo&apos;s response will appear here...
            </p>
          )}
        </div>

        {/* Translation Section */}
        {(translatedContent || isTranslating) && (
          <div className="w-full max-w-md bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <span className="text-blue-600 mr-2">🌐</span>
              <h3 className="font-canva-sans text-sm font-medium text-blue-800">
                Translation ({translatedContent?.language || 'processing...'})
              </h3>
            </div>
            {isTranslating ? (
              <p className="font-canva-sans text-sm text-blue-600">Translating...</p>
            ) : (
              <p className="font-canva-sans text-base text-blue-900">
                {translatedContent?.text}
              </p>
            )}
          </div>
        )}

        {/* Manual Translation Triggers */}
        {response && !isTranslating && (
          <div className="w-full max-w-md mb-12 flex flex-wrap gap-2">
            <button
              onClick={() => handleManualTranslation('spanish')}
              className="px-3 py-1 rounded-lg font-canva-sans text-sm font-medium transition-colors duration-200 text-blue-600 border border-blue-300 hover:bg-blue-50"
            >
              🌐 Translate this
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-md">
            <p className="font-canva-sans text-sm text-red-600 text-center mb-3">
              {error}
            </p>
            {(error.includes('Microphone') || error.includes('microphone')) && (
              <button
                onClick={handleMicClick}
                className="w-full py-2 px-4 rounded-lg font-canva-sans text-sm font-medium transition-colors duration-200 text-white"
                style={{ backgroundColor: 'var(--primary-blue)' }}
              >
                Try Again
              </button>
            )}
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
                  &quot;{prompt}&quot;
                </p>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer - Quick Icons */}
      <footer className="flex items-center justify-center space-x-4 p-8 border-t" style={{ backgroundColor: 'var(--secondary)', borderColor: 'var(--border)' }}>
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
          href="/map"
          className="flex flex-col items-center space-y-2 p-3 hover:bg-accent rounded-lg transition-colors duration-200"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ef4444' }}>
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>
          <span className="font-canva-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>Map</span>
        </Link>
      </footer>
    </div>
  );
}
