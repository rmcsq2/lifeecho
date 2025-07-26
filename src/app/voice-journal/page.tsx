'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { voiceNoteStorage } from '../../utils/voiceNoteStorage';
import { translationService } from '../../utils/translationService';
import { VoiceSearchResults } from '../../components/VoiceSearchResults';
import { VoiceNote } from '../../types/VoiceNote';

export default function VoiceJournal() {
  const [triggerWord, setTriggerWord] = useState('echo');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [translatedContent, setTranslatedContent] = useState<{text: string, language: string, languageCode: string} | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSettings, setSpeechSettings] = useState({ enabled: true, defaultLanguage: 'es', rate: 1 });
  const [searchResults, setSearchResults] = useState<VoiceNote[]>([]);
  const [searchTerm, setSearchTerm] = useState('Sure Site');
  const [searchType, setSearchType] = useState<'last' | 'all'>('all');
  const [showSearchResults, setShowSearchResults] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTriggerWord(localStorage.getItem('customTriggerWord') || 'echo');
      setSpeechSettings(translationService.getSpeechSettings());
      
      const results = voiceNoteStorage.searchVoiceNotes('Sure Site', 'all');
      setSearchResults(results);
    }
  }, []);

  const handleSubmit = async () => {
    if (currentTranscript.trim()) {
      await voiceNoteStorage.saveVoiceNote(currentTranscript);
      setCurrentTranscript('');
      setTranslatedContent(null);
    }
  };

  const handleTranslation = async (text: string, targetLanguage: string) => {
    setIsTranslating(true);
    try {
      const languageCode = translationService.getLanguageCode(targetLanguage) || targetLanguage;
      const result = await translationService.translateWithSpeech(text, languageCode);
      
      setTranslatedContent({
        text: result.translatedText,
        language: translationService.getSupportedLanguages()[languageCode] || targetLanguage,
        languageCode: languageCode
      });

      if (speechSettings.enabled && translationService.isSpeechSynthesisSupported()) {
        setIsSpeaking(true);
        try {
          await result.speak({ rate: speechSettings.rate });
        } catch (speechError) {
          console.error('Speech synthesis failed:', speechError);
        } finally {
          setIsSpeaking(false);
        }
      }
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleManualTranslation = async (targetLanguage: string) => {
    if (currentTranscript.trim()) {
      await handleTranslation(currentTranscript, targetLanguage);
    }
  };

  const handleSpeechRate = async (rate: 'slower' | 'faster' | 'normal') => {
    if (translatedContent && translationService.isSpeechSynthesisSupported()) {
      setIsSpeaking(true);
      try {
        const speechRate = rate === 'slower' ? 0.5 : rate === 'faster' ? 1.5 : 1;
        await translationService.speakText(translatedContent.text, translatedContent.languageCode, { rate: speechRate });
      } catch (error) {
        console.error('Speech rate control failed:', error);
      } finally {
        setIsSpeaking(false);
      }
    }
  };

  const handleWordByWord = async () => {
    if (translatedContent && translationService.isSpeechSynthesisSupported()) {
      setIsSpeaking(true);
      try {
        await translationService.speakWordByWord(translatedContent.text, translatedContent.languageCode);
      } catch (error) {
        console.error('Word-by-word speech failed:', error);
      } finally {
        setIsSpeaking(false);
      }
    }
  };

  const handleManualSpeak = async () => {
    if (translatedContent && translationService.isSpeechSynthesisSupported()) {
      setIsSpeaking(true);
      try {
        await translationService.speakText(translatedContent.text, translatedContent.languageCode, { rate: speechSettings.rate });
      } catch (error) {
        console.error('Manual speech failed:', error);
      } finally {
        setIsSpeaking(false);
      }
    }
  };

  const toggleSpeechSettings = () => {
    const newSettings = { ...speechSettings, enabled: !speechSettings.enabled };
    setSpeechSettings(newSettings);
    translationService.setSpeechSettings(newSettings);
  };

  const handleSearchDetected = (term: string, type: 'last' | 'all') => {
    console.log('=== VOICE SEARCH DETECTED ===');
    console.log('Search term:', term);
    console.log('Search type:', type);
    
    const results = voiceNoteStorage.searchVoiceNotes(term, type);
    setSearchResults(results);
    setSearchTerm(term);
    setSearchType(type);
    setShowSearchResults(true);
    
    console.log('Search results:', results);
  };

  const handlePlayback = (note: VoiceNote) => {
    if (translationService.isSpeechSynthesisSupported()) {
      translationService.speakText(note.text, 'en-US');
    }
  };

  const handleDeleteNote = (noteId: string) => {
    console.log('Deleting note:', noteId);
    voiceNoteStorage.deleteVoiceNote(noteId);
    const updatedResults = searchResults.filter(note => note.id !== noteId);
    setSearchResults(updatedResults);
  };

  const handleArchiveNote = (noteId: string) => {
    console.log('Archiving note:', noteId);
    voiceNoteStorage.archiveVoiceNote(noteId);
    const updatedResults = searchResults.filter(note => note.id !== noteId);
    setSearchResults(updatedResults);
  };

  const closeSearchResults = () => {
    setShowSearchResults(false);
    setSearchResults([]);
    setSearchTerm('');
  };

  const { 
    isListening, 
    transcript, 
    isSupported, 
    error, 
    startListening
  } = useVoiceRecognition({
    triggerWord: triggerWord,
    onTriggerDetected: () => {
      setCurrentTranscript('');
      setTranslatedContent(null);
    },
    onTranscript: (text) => {
      setCurrentTranscript(text);
    },
    onAutoSave: async (text) => {
      console.log('Auto-saving voice journal after 5 seconds of silence:', text);
      await voiceNoteStorage.saveVoiceNote(text);
      setCurrentTranscript('');
      setTranslatedContent(null);
    },
    onSubmitDetected: async (finalText) => {
      if (finalText.trim()) {
        await voiceNoteStorage.saveVoiceNote(finalText);
        setCurrentTranscript('');
        setTranslatedContent(null);
      }
    },
    onStopDetected: () => {
      setCurrentTranscript('');
      setTranslatedContent(null);
    },
    onTranslationDetected: handleTranslation,
    onSpeechRateDetected: handleSpeechRate,
    onWordByWordDetected: handleWordByWord,
    onSearchDetected: handleSearchDetected
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
      </header>

      {/* Life Echo Logo - Middle between "FULL NOTES" and "Say Echo to Dictate" */}
      <div className="flex justify-center my-6 px-8">
        <div className={`relative transition-all duration-300 ${
          isListening ? 'animate-pulse' : ''
        }`} style={{ width: '572px', height: '572px' }}>
          <Image
            src="/life-echo-logo.png"
            alt="Life Echo Logo"
            width={572}
            height={572}
            className="object-contain"
            priority
          />
        </div>
      </div>
      
      {/* Voice Activation Text */}
      <div className="text-center px-8 mb-6">
        <p className="font-canva-sans text-lg font-medium" style={{ color: '#4E4B4B' }}>
          Say &apos;Echo&apos; to Dictate Notes
        </p>
      </div>

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
        
        {/* Translation Section */}
        {(translatedContent || isTranslating) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="text-blue-600 mr-2">🌐</span>
                <h3 className="font-canva-sans text-sm font-medium text-blue-800">
                  Translation ({translatedContent?.language || 'processing...'})
                </h3>
              </div>
              {translatedContent && translationService.isSpeechSynthesisSupported() && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleManualSpeak}
                    disabled={isSpeaking}
                    className="p-1 rounded text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                    title="Speak translation"
                  >
                    {isSpeaking ? '🔊' : '🔈'}
                  </button>
                  <button
                    onClick={toggleSpeechSettings}
                    className={`p-1 rounded transition-colors duration-200 ${
                      speechSettings.enabled ? 'text-blue-600 bg-blue-100' : 'text-gray-400'
                    }`}
                    title="Toggle auto-speech"
                  >
                    🎵
                  </button>
                </div>
              )}
            </div>
            {isTranslating ? (
              <p className="font-canva-sans text-sm text-blue-600">Translating...</p>
            ) : (
              <>
                <p className="font-canva-sans text-base text-blue-900 mb-3">
                  {translatedContent?.text}
                </p>
                {translatedContent && translationService.isSpeechSynthesisSupported() && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSpeechRate('slower')}
                      disabled={isSpeaking}
                      className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
                    >
                      🐌 Slower
                    </button>
                    <button
                      onClick={() => handleSpeechRate('normal')}
                      disabled={isSpeaking}
                      className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
                    >
                      ▶️ Normal
                    </button>
                    <button
                      onClick={handleWordByWord}
                      disabled={isSpeaking}
                      className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
                    >
                      📝 Word by Word
                    </button>
                  </div>
                )}
              </>
            )}
            {isSpeaking && (
              <p className="font-canva-sans text-xs text-blue-600 mt-2">🔊 Speaking...</p>
            )}
          </div>
        )}

        {/* Manual Translation Triggers */}
        {currentTranscript && !isTranslating && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-canva-sans text-sm font-medium text-gray-700">Quick Translate:</h4>
              <div className="flex items-center space-x-2">
                <span className="font-canva-sans text-xs text-gray-500">Auto-speak:</span>
                <button
                  onClick={toggleSpeechSettings}
                  className={`w-8 h-4 rounded-full transition-colors duration-200 ${
                    speechSettings.enabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${
                    speechSettings.enabled ? 'translate-x-4' : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleManualTranslation('spanish')}
                className="px-3 py-1 rounded-lg font-canva-sans text-sm font-medium transition-colors duration-200 text-blue-600 border border-blue-300 hover:bg-blue-50"
              >
                🌐 Spanish
              </button>
              <button
                onClick={() => handleManualTranslation('french')}
                className="px-3 py-1 rounded-lg font-canva-sans text-sm font-medium transition-colors duration-200 text-blue-600 border border-blue-300 hover:bg-blue-50"
              >
                🌐 French
              </button>
              <button
                onClick={() => handleManualTranslation('german')}
                className="px-3 py-1 rounded-lg font-canva-sans text-sm font-medium transition-colors duration-200 text-blue-600 border border-blue-300 hover:bg-blue-50"
              >
                🌐 German
              </button>
              <button
                onClick={() => handleManualTranslation('japanese')}
                className="px-3 py-1 rounded-lg font-canva-sans text-sm font-medium transition-colors duration-200 text-blue-600 border border-blue-300 hover:bg-blue-50"
              >
                🌐 Japanese
              </button>
            </div>
          </div>
        )}
        
        {/* Auto-Save Note */}
        <p className="font-canva-sans text-sm text-gray-400 mb-8">
          Notes will save automatically if submit button is not pressed after 5 sec pause.
        </p>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="font-canva-sans text-sm text-red-600 text-center mb-3">
              {error}
            </p>
            {(error.includes('Microphone') || error.includes('microphone')) && (
              <button
                onClick={startListening}
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="font-canva-sans text-sm text-yellow-700">
              Voice recognition not supported. Try Chrome or Edge. Mobile browsers have limited voice recognition support.
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <footer className="flex items-center justify-center space-x-6 p-6 bg-white border-t border-gray-200">
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
          <div className="w-8 h-8 rounded-sm" style={{ backgroundColor: '#6b7280' }}></div>
          <span className="font-canva-sans text-sm" style={{ color: '#4E4B4B' }}>More</span>
        </Link>
      </footer>

      {showSearchResults && (
        <VoiceSearchResults
          searchResults={searchResults}
          searchTerm={searchTerm}
          searchType={searchType}
          onClose={closeSearchResults}
          onPlayback={handlePlayback}
          onDelete={handleDeleteNote}
          onArchive={handleArchiveNote}
        />
      )}
    </div>
  );
}
