'use client';

import React, { useState } from 'react';

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
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-[864px] mx-auto">
      {/* Header */}
      <header className="pt-16 pb-8 px-8">
        <h1 className="font-league-spartan text-4xl font-bold text-left text-gray-900">
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
                <div className="px-4 py-2 bg-white rounded-full border border-gray-300">
                  <p className="font-canva-sans text-sm font-medium text-gray-700">
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
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-canva-sans text-xl font-bold text-gray-900 mb-2">
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
                            className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
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
    </div>
  );
}
