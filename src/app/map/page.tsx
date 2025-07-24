'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { VoiceNote } from '../../types/VoiceNote';
import { voiceNoteStorage, formatNoteTimestamp } from '../../utils/voiceNoteStorage';

export default function MapView() {
  const [geoTaggedNotes, setGeoTaggedNotes] = useState<VoiceNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<VoiceNote | null>(null);

  useEffect(() => {
    const notes = voiceNoteStorage.getVoiceNotes();
    const notesWithLocation = notes.filter(note => note.latitude && note.longitude);
    setGeoTaggedNotes(notesWithLocation);
  }, []);

  return (
    <div className="min-h-screen flex flex-col max-w-[864px] mx-auto" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <header className="pt-8 pb-6 px-8">
        <div className="flex items-start justify-between mb-4">
          <Link href="/home" className="w-8 h-8 bg-black rounded-sm"></Link>
          
          <div className="flex-1 text-center">
            <h1 className="font-league-spartan text-4xl font-bold text-black mb-2">
              LIFE ECHOS
            </h1>
            <h2 className="font-league-spartan text-xl font-medium" style={{ color: '#4E4B4B' }}>
              GEO-TAGGED ENTRIES
            </h2>
          </div>
          
          <div className="w-8"></div>
        </div>
      </header>

      {/* Map View */}
      <main className="flex-1 px-8">
        <div className="bg-white rounded-lg mb-6 min-h-[400px] relative overflow-hidden border border-gray-200">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
            {geoTaggedNotes.map((note, index) => (
              <button
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="absolute w-6 h-6 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center"
                style={{ 
                  backgroundColor: '#ef4444',
                  left: `${20 + (index * 15) % 60}%`,
                  top: `${20 + (index * 20) % 60}%`
                }}
              >
                <span className="text-white text-xs">📍</span>
              </button>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 bg-white rounded-lg p-2 shadow-sm">
            <p className="font-canva-sans text-xs text-gray-600">
              📍 {geoTaggedNotes.length} geo-tagged entries
            </p>
          </div>
        </div>

        {selectedNote && (
          <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
            <div className="flex items-center mb-3">
              <span className="text-red-500 mr-2">📍</span>
              <h3 className="font-canva-sans text-lg font-bold text-black">
                {selectedNote.title || 'Voice Note'}
              </h3>
            </div>
            <p className="font-canva-sans text-base text-gray-700 mb-3">
              {selectedNote.text}
            </p>
            <div className="text-sm text-gray-500">
              <p>Location: {selectedNote.latitude?.toFixed(4)}, {selectedNote.longitude?.toFixed(4)}</p>
              <p>Date: {formatNoteTimestamp(selectedNote.timestamp).date} at {formatNoteTimestamp(selectedNote.timestamp).time}</p>
            </div>
            
            {selectedNote.translations && Object.keys(selectedNote.translations).length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-canva-sans text-sm font-medium text-gray-700 mb-2">🌐 Translations:</h4>
                {Object.entries(selectedNote.translations).map(([lang, translation]) => (
                  <div key={lang} className="mb-2">
                    <p className="font-canva-sans text-xs text-gray-500 uppercase">{lang}</p>
                    <p className="font-canva-sans text-sm text-gray-700">{(translation as {text: string}).text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {geoTaggedNotes.length === 0 && (
          <div className="text-center py-12">
            <p className="font-canva-sans text-lg text-gray-500 mb-4">No geo-tagged entries yet</p>
            <p className="font-canva-sans text-base text-gray-400">Create voice notes to see them appear on the map</p>
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
          href="/map"
          className="flex flex-col items-center space-y-1"
        >
          <div className="w-8 h-8 bg-red-500 rounded-sm"></div>
          <span className="font-canva-sans text-sm" style={{ color: '#4E4B4B' }}>Map</span>
        </Link>
      </footer>
    </div>
  );
}
