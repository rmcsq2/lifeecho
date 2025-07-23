import { VoiceNote } from '../types/VoiceNote';

const STORAGE_KEY = 'lifeecho-voice-notes';

export const voiceNoteStorage = {
  saveVoiceNote: (text: string): VoiceNote => {
    const note: VoiceNote = {
      id: Date.now().toString(),
      text: text.trim(),
      timestamp: Date.now(),
      title: generateTitle(text)
    };

    const existingNotes = voiceNoteStorage.getVoiceNotes();
    const updatedNotes = [note, ...existingNotes];
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Failed to save voice note:', error);
    }
    
    return note;
  },

  getVoiceNotes: (): VoiceNote[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const notes = JSON.parse(stored) as VoiceNote[];
      return notes.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to load voice notes:', error);
      return [];
    }
  },

  deleteVoiceNote: (id: string): void => {
    const notes = voiceNoteStorage.getVoiceNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
    } catch (error) {
      console.error('Failed to delete voice note:', error);
    }
  },

  clearAllNotes: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear voice notes:', error);
    }
  }
};

function generateTitle(text: string): string {
  const words = text.trim().split(' ');
  const maxWords = 4;
  const title = words.slice(0, maxWords).join(' ');
  return title.length > 30 ? title.substring(0, 30) + '...' : title;
}

export function formatNoteTimestamp(timestamp: number): { date: string; time: string } {
  const date = new Date(timestamp);
  
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  return {
    date: dateFormatter.format(date),
    time: timeFormatter.format(date)
  };
}
