'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function NoteHistory() {
  const [history] = useState([
    {
      id: 1,
      date: '2025-07-22',
      notes: [
        {
          id: 101,
          title: 'Morning Reflection',
          snippet: 'Started the day with gratitude and positive energy...',
          time: '08:30 AM',
          hasAudio: true
        },
        {
          id: 102,
          title: 'Project Update',
          snippet: 'Made significant progress on the new feature implementation...',
          time: '02:15 PM',
          hasAudio: true
        }
      ]
    },
    {
      id: 2,
      date: '2025-07-21',
      notes: [
        {
          id: 201,
          title: 'Weekend Planning',
          snippet: 'Thinking about activities for the upcoming weekend...',
          time: '06:45 PM',
          hasAudio: false
        }
      ]
    },
    {
      id: 3,
      date: '2025-07-20',
      notes: [
        {
          id: 301,
          title: 'Creative Ideas',
          snippet: 'Had some interesting thoughts about the design direction...',
          time: '11:20 AM',
          hasAudio: true
        },
        {
          id: 302,
          title: 'Meeting Notes',
          snippet: 'Key takeaways from today\'s team meeting...',
          time: '03:30 PM',
          hasAudio: false
        }
      ]
    }
  ]);

  const handlePlayAudio = (noteId: number) => {
    console.log('Playing audio for note:', noteId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen flex flex-col max-w-[864px] mx-auto" style={{ backgroundColor: 'var(--secondary)' }}>
      {/* Header */}
      <header className="pt-16 pb-8 px-8">
        <h1 className="font-league-spartan text-4xl font-bold text-left" style={{ color: 'var(--foreground)' }}>
          Note History
        </h1>
      </header>

      {/* Main Content - Timeline */}
      <main className="flex-1 px-8 pb-8">
        <div className="space-y-8">
          {history.map((day) => (
            <div key={day.id} className="relative">
              {/* Date Divider */}
              <div className="flex items-center mb-6">
                <div className="flex-1 h-px bg-gray-300"></div>
                <div className="px-4 py-2 rounded-full border border-gray-300" style={{ backgroundColor: 'var(--card)' }}>
                  <p className="font-canva-sans text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    {formatDate(day.date)}
                  </p>
                </div>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Notes for this day */}
              <div className="space-y-4 ml-4">
                {day.notes.map((note) => (
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
                          {note.title}
                        </h3>
                        <p className="font-canva-sans text-base text-gray-600 leading-relaxed">
                          {note.snippet}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3 ml-4">
                        <p className="font-canva-sans text-sm text-gray-500">
                          {note.time}
                        </p>
                        {note.hasAudio && (
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
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
