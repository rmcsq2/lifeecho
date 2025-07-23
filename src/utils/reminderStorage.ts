import { Reminder } from '../types/Reminder';

const STORAGE_KEY = 'lifeecho-reminders';

export const reminderStorage = {
  saveReminder: (text: string, type: 'reminder' | 'task', timestamp?: number): Reminder => {
    const reminder: Reminder = {
      id: Date.now().toString(),
      type,
      text: text.trim(),
      timestamp,
      completed: false,
      createdAt: Date.now()
    };

    const existingReminders = reminderStorage.getReminders();
    const updatedReminders = [reminder, ...existingReminders];
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReminders));
    } catch (error) {
      console.error('Failed to save reminder:', error);
    }
    
    return reminder;
  },

  getReminders: (): Reminder[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const reminders = JSON.parse(stored) as Reminder[];
      return reminders.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error('Failed to load reminders:', error);
      return [];
    }
  },

  toggleReminder: (id: string): void => {
    const reminders = reminderStorage.getReminders();
    const updatedReminders = reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    );
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReminders));
    } catch (error) {
      console.error('Failed to toggle reminder:', error);
    }
  },

  deleteReminder: (id: string): void => {
    const reminders = reminderStorage.getReminders();
    const filteredReminders = reminders.filter(reminder => reminder.id !== id);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredReminders));
    } catch (error) {
      console.error('Failed to delete reminder:', error);
    }
  },

  clearAllReminders: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear reminders:', error);
    }
  }
};

export function parseReminderDateTime(text: string): { parsedText: string; timestamp?: number } {
  const now = new Date();
  const lowerText = text.toLowerCase();
  
  const timeMatch = lowerText.match(/at (\d{1,2}):?(\d{0,2})\s*(am|pm)/i);
  
  let targetDate = new Date(now);
  let parsedText = text;
  
  if (lowerText.includes('tomorrow')) {
    targetDate.setDate(now.getDate() + 1);
    parsedText = text.replace(/tomorrow/gi, '').trim();
  } else if (lowerText.includes('today')) {
    parsedText = text.replace(/today/gi, '').trim();
  } else if (lowerText.includes('friday')) {
    const daysUntilFriday = (5 - now.getDay() + 7) % 7;
    targetDate.setDate(now.getDate() + (daysUntilFriday === 0 ? 7 : daysUntilFriday));
    parsedText = text.replace(/friday/gi, '').trim();
  }
  
  if (timeMatch) {
    const hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const isPM = timeMatch[3].toLowerCase() === 'pm';
    
    let hour24 = hours;
    if (isPM && hours !== 12) hour24 += 12;
    if (!isPM && hours === 12) hour24 = 0;
    
    targetDate.setHours(hour24, minutes, 0, 0);
    parsedText = parsedText.replace(/at \d{1,2}:?\d{0,2}\s*(am|pm)/gi, '').trim();
  }
  
  parsedText = parsedText.replace(/^to\s+/i, '').replace(/\s+/g, ' ').trim();
  
  return {
    parsedText,
    timestamp: timeMatch || lowerText.includes('tomorrow') || lowerText.includes('friday') ? targetDate.getTime() : undefined
  };
}

export function formatReminderTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
  
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const time = timeFormatter.format(date);
  
  if (isToday) return `Today, ${time}`;
  if (isTomorrow) return `Tomorrow, ${time}`;
  
  const dayFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'long'
  });
  
  return `${dayFormatter.format(date)}, ${time}`;
}
