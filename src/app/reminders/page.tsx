'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { Reminder } from '../../types/Reminder';
import { reminderStorage, parseReminderDateTime, formatReminderTime } from '../../utils/reminderStorage';

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isActivated, setIsActivated] = useState(false);
  const [triggerWord, setTriggerWord] = useState('echo');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTriggerWord(localStorage.getItem('customTriggerWord') || 'echo');
      loadReminders();
    }
  }, []);

  const loadReminders = () => {
    const loadedReminders = reminderStorage.getReminders();
    setReminders(loadedReminders);
  };

  const { 
    isListening, 
    isSupported, 
    error, 
    startListening, 
    stopListening,
    resetTrigger 
  } = useVoiceRecognition({
    triggerWord: triggerWord,
    onTriggerDetected: () => {
      setIsActivated(true);
      console.log('Reminders voice activated!');
    },
    onReminderDetected: (text) => {
      const { parsedText, timestamp } = parseReminderDateTime(text);
      const savedReminder = reminderStorage.saveReminder(parsedText, 'reminder', timestamp);
      console.log('Reminder created:', savedReminder);
      loadReminders();
      setIsActivated(false);
      resetTrigger();
    },
    onTaskDetected: (text) => {
      const { parsedText } = parseReminderDateTime(text);
      const savedTask = reminderStorage.saveReminder(parsedText, 'task');
      console.log('Task created:', savedTask);
      loadReminders();
      setIsActivated(false);
      resetTrigger();
    },
    onStopDetected: () => {
      setIsActivated(false);
      console.log('Reminders voice stopped');
    }
  });

  useEffect(() => {
    if (isSupported) {
      startListening();
    }
  }, [isSupported, startListening]);

  const toggleReminder = (id: string) => {
    reminderStorage.toggleReminder(id);
    loadReminders();
  };

  const scheduledReminders = reminders.filter(r => r.type === 'reminder' && r.timestamp);
  const tasks = reminders.filter(r => r.type === 'task');

  return (
    <div className="min-h-screen flex flex-col max-w-[864px] mx-auto" style={{ backgroundColor: 'var(--secondary)' }}>
      {/* Header Section */}
      <header className="pt-16 pb-8 px-8">
        <div className="flex items-center mb-4">
          <h1 className="font-league-spartan text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
            LIFE ECHOS
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/home" className="w-6 h-6 flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-600 rounded-sm"></div>
          </Link>
          <h2 className="font-canva-sans text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            Reminder & Tasks
          </h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 pb-20">
        {/* Voice Status */}
        {isActivated && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--accent)', border: '1px solid var(--border)' }}>
            <p className="font-canva-sans text-base text-center" style={{ color: 'var(--primary-blue)' }}>
              🎤 Say "Echo, remind me..." or "Echo remember..."
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="font-canva-sans text-sm text-center mb-3 text-red-600">
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

        {/* Scheduled Reminders Section */}
        <div className="mb-8">
          <h3 className="font-canva-sans text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Scheduled Reminders
          </h3>
          <div className="space-y-4">
            {scheduledReminders.length > 0 ? (
              scheduledReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`rounded-lg shadow-sm p-6 w-[90%] transition-all duration-200 ${
                    reminder.completed ? 'opacity-60' : 'hover:shadow-md'
                  }`}
                  style={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)' 
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200"
                      style={{
                        backgroundColor: reminder.completed ? 'var(--success)' : 'transparent',
                        borderColor: reminder.completed ? 'var(--success)' : 'var(--border)'
                      }}
                      onMouseEnter={(e) => !reminder.completed && (e.currentTarget.style.borderColor = 'var(--primary-blue)')}
                      onMouseLeave={(e) => !reminder.completed && (e.currentTarget.style.borderColor = 'var(--border)')}
                    >
                      {reminder.completed && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-canva-sans text-xl font-bold ${
                          reminder.completed ? 'line-through' : ''
                        }`}
                            style={{ 
                              color: reminder.completed ? 'var(--muted-foreground)' : 'var(--foreground)' 
                            }}>
                          {reminder.text}
                        </h4>
                        {reminder.timestamp && (
                          <p className="font-canva-sans text-sm font-medium" style={{ color: 'var(--primary-blue)' }}>
                            {formatReminderTime(reminder.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="font-canva-sans text-base text-gray-500 text-center py-8">
                No scheduled reminders yet. Say "Echo, remind me..." to create one.
              </p>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mb-8">
          <h3 className="font-canva-sans text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Tasks
          </h3>
          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`rounded-lg shadow-sm p-6 w-[90%] transition-all duration-200 ${
                    task.completed ? 'opacity-60' : 'hover:shadow-md'
                  }`}
                  style={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)' 
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => toggleReminder(task.id)}
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200"
                      style={{
                        backgroundColor: task.completed ? 'var(--success)' : 'transparent',
                        borderColor: task.completed ? 'var(--success)' : 'var(--border)'
                      }}
                      onMouseEnter={(e) => !task.completed && (e.currentTarget.style.borderColor = 'var(--primary-blue)')}
                      onMouseLeave={(e) => !task.completed && (e.currentTarget.style.borderColor = 'var(--border)')}
                    >
                      {task.completed && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </button>

                    <div className="flex-1">
                      <h4 className={`font-canva-sans text-xl font-bold ${
                        task.completed ? 'line-through' : ''
                      }`}
                          style={{ 
                            color: task.completed ? 'var(--muted-foreground)' : 'var(--foreground)' 
                          }}>
                        {task.text}
                      </h4>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="font-canva-sans text-base text-gray-500 text-center py-8">
                No tasks yet. Say "Echo remember..." to create one.
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Voice Wave Logo - Bottom Right */}
      <div className="fixed bottom-8 right-8">
        <div className={`w-16 h-16 relative transition-all duration-300 ${
          isListening ? 'animate-pulse' : ''
        }`}>
          <Image
            src="/logo.png"
            alt="Voice Wave Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
