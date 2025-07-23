'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { VoiceNote } from '../../types/VoiceNote';
import { voiceNoteStorage, formatNoteTimestamp } from '../../utils/voiceNoteStorage';

export default function Notes() {
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const notes = voiceNoteStorage.getVoiceNotes();
      setVoiceNotes(notes);
    }
  }, []);

  const groupedNotes = voiceNotes.reduce((groups: { [key: string]: VoiceNote[] }, note) => {
    const date = new Date(note.timestamp).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(note);
    return groups;
  }, {});

  const handlePlayAudio = (noteId: string) => {
    console.log('Playing audio for note:', noteId);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-[864px] mx-auto" style={{ backgroundColor: 'var(--secondary)' }}>
      {/* Header */}
      <header className="pt-16 pb-8 px-8">
        <h1 className="font-league-spartan text-4xl font-bold text-left" style={{ color: 'var(--foreground)' }}>
          LIFE ECHOS
        </h1>
      </header>

      {/* Main Content - Timeline */}
      <main className="flex-1 px-8 pb-8">
        <div className="space-y-8">
          {Object.entries(groupedNotes).map(([dateString, notes]) => (
            <div key={dateString} className="relative">
              {/* Date Divider */}
              <div className="flex items-center mb-6">
                <div className="flex-1 h-px bg-gray-300"></div>
                <div className="px-4 py-2 rounded-full border border-gray-300" style={{ backgroundColor: 'var(--card)' }}>
                  <p className="font-canva-sans text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    {new Date(dateString).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Notes for this day */}
              <div className="space-y-4 ml-4">
                {notes.map((note) => {
                  const { time } = formatNoteTimestamp(note.timestamp);
                  return (
                    <div
                      key={note.id}
                      className="rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
                      style={{ 
                        backgroundColor: 'var(--card)', 
                        border: '1px solid var(--border)' 
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-canva-sans text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                            {note.title || 'Voice Note'}
                          </h3>
                          <p className="font-canva-sans text-base text-gray-600 leading-relaxed">
                            {note.text}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3 ml-4">
                          <p className="font-canva-sans text-sm text-gray-500">
                            {time}
                          </p>
                          <button
                            onClick={() => handlePlayAudio(note.id)}
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                            style={{ 
                              backgroundColor: 'var(--primary-blue)',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {voiceNotes.length === 0 && (
            <div className="text-center py-12">
              <p className="font-canva-sans text-lg text-gray-500 mb-4">No voice notes yet</p>
              <p className="font-canva-sans text-base text-gray-400">Start recording with any voice-enabled page to see your notes here</p>
            </div>
          )}
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
