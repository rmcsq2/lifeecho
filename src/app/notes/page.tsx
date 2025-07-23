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

  return (
    <div className="min-h-screen flex flex-col max-w-[864px] mx-auto" style={{ backgroundColor: 'var(--secondary)' }}>
      {/* Header */}
      <header className="pt-16 pb-8 px-8">
        <h1 className="font-league-spartan text-4xl font-bold text-left" style={{ color: 'var(--foreground)' }}>
          Your Notes
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8">
        {/* Scrollable Notes List */}
        <div className="space-y-4 mb-8">
          {voiceNotes.length > 0 ? (
            voiceNotes.map((note) => {
              const { date, time } = formatNoteTimestamp(note.timestamp);
              return (
                <div
                  key={note.id}
                  className="rounded-lg shadow-sm p-6 w-[90%] hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-canva-sans text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                      {note.title || 'Voice Note'}
                    </h3>
                    <div className="text-right">
                      <p className="font-canva-sans text-sm text-gray-500">{date}</p>
                      <p className="font-canva-sans text-sm text-gray-500">{time}</p>
                    </div>
                  </div>
                  <p className="font-canva-sans text-base text-gray-600 leading-relaxed">
                    {note.text}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <p className="font-canva-sans text-lg text-gray-500 mb-4">No voice notes yet</p>
              <p className="font-canva-sans text-base text-gray-400">Start recording with the Voice Journal to see your notes here</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer Button */}
      <footer className="p-8">
        <Link href="/voice-journal">
          <button className="w-full font-canva-sans text-lg font-medium py-4 px-6 rounded-lg transition-colors duration-200"
                  style={{ 
                    backgroundColor: 'var(--primary-blue)', 
                    color: 'var(--primary-foreground)' 
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            + New Note
          </button>
        </Link>
      </footer>
    </div>
  );
}
