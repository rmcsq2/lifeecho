'use client';

import React, { useState } from 'react';

export default function Reminders() {
  const [reminders] = useState([
    {
      id: 1,
      title: 'Team Meeting',
      time: '2:00 PM Today',
      description: 'Weekly project sync with the development team',
      completed: false
    },
    {
      id: 2,
      title: 'Call Mom',
      time: '6:00 PM Today',
      description: 'Check in and catch up on family news',
      completed: false
    },
    {
      id: 3,
      title: 'Grocery Shopping',
      time: 'Tomorrow 10:00 AM',
      description: 'Pick up ingredients for weekend cooking',
      completed: true
    },
    {
      id: 4,
      title: 'Doctor Appointment',
      time: 'Friday 3:30 PM',
      description: 'Annual checkup with Dr. Smith',
      completed: false
    }
  ]);

  const [showVoiceCommand, setShowVoiceCommand] = useState(false);

  const handleAddReminder = () => {
    console.log('Add reminder clicked');
  };

  const handleVoiceCommand = () => {
    setShowVoiceCommand(true);
    setTimeout(() => setShowVoiceCommand(false), 3000);
  };

  const toggleReminder = (id: number) => {
    console.log('Toggle reminder:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-[864px] mx-auto">
      {/* Header */}
      <header className="pt-16 pb-8">
        <h1 className="font-league-spartan text-4xl font-bold text-center text-gray-900">
          Reminders
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8">
        {/* Voice Command Option */}
        <div className="mb-8">
          <button
            onClick={handleVoiceCommand}
            className={`w-full p-4 rounded-lg border-2 border-dashed transition-all duration-200 ${
              showVoiceCommand
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <p className="font-canva-sans text-base text-gray-600 text-center">
              {showVoiceCommand 
                ? '🎤 Listening... "Echo, remind me at..."'
                : '💬 Echo, remind me at...'
              }
            </p>
          </button>
        </div>

        {/* Reminders List */}
        <div className="space-y-4 mb-8">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-[90%] transition-all duration-200 ${
                reminder.completed ? 'opacity-60' : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                    reminder.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {reminder.completed && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-canva-sans text-xl font-bold ${
                      reminder.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {reminder.title}
                    </h3>
                    <p className="font-canva-sans text-sm text-blue-600 font-medium">
                      {reminder.time}
                    </p>
                  </div>
                  <p className={`font-canva-sans text-base leading-relaxed ${
                    reminder.completed ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {reminder.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Reminder Button */}
      <footer className="p-8">
        <button
          onClick={handleAddReminder}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-canva-sans text-lg font-medium py-4 px-6 rounded-lg transition-colors duration-200"
        >
          + Add Reminder
        </button>
      </footer>
    </div>
  );
}
