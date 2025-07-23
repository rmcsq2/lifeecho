export interface Reminder {
  id: string;
  type: 'reminder' | 'task';
  text: string;
  timestamp?: number; // Only for reminders, not tasks
  completed: boolean;
  createdAt: number;
}

export interface ReminderStorage {
  saveReminder: (text: string, type: 'reminder' | 'task', timestamp?: number) => Reminder;
  getReminders: () => Reminder[];
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  clearAllReminders: () => void;
}
