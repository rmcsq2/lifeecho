'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Notes() {
  const [notes] = useState([
    {
      id: 1,
      title: 'Morning Thoughts',
      preview: 'Today feels like a fresh start. The weather is beautiful and I have so many ideas...',
      date: '2025-07-22',
      time: '08:30 AM'
    },
    {
      id: 2,
      title: 'Project Ideas',
      preview: 'Working on the new app design. Need to focus on user experience and make sure...',
      date: '2025-07-21',
      time: '02:15 PM'
    },
    {
      id: 3,
      title: 'Weekend Plans',
      preview: 'Thinking about visiting the park this weekend. Maybe bring a book and...',
      date: '2025-07-20',
      time: '06:45 PM'
    }
  ]);

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
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg shadow-sm p-6 w-[90%] hover:shadow-md transition-shadow duration-200 cursor-pointer"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-canva-sans text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {note.title}
                </h3>
                <div className="text-right">
                  <p className="font-canva-sans text-sm text-gray-500">{note.date}</p>
                  <p className="font-canva-sans text-sm text-gray-500">{note.time}</p>
                </div>
              </div>
              <p className="font-canva-sans text-base text-gray-600 leading-relaxed">
                {note.preview}
              </p>
            </div>
          ))}
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
