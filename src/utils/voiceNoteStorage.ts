import { VoiceNote } from '../types/VoiceNote';

const STORAGE_KEY = 'lifeecho-voice-notes';

export const voiceNoteStorage = {
  saveVoiceNote: async (text: string, options?: { skipLocation?: boolean }): Promise<VoiceNote> => {
    let locationData = {};
    
    if (!options?.skipLocation && navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            enableHighAccuracy: false
          });
        });
        
        locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      } catch (error) {
        console.log('Location capture failed:', error);
      }
    }

    const note: VoiceNote = {
      id: Date.now().toString(),
      text: text.trim(),
      timestamp: Date.now(),
      title: generateTitle(text),
      ...locationData
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

  saveVoiceNoteSync: (text: string): VoiceNote => {
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

  updateVoiceNoteTranslation: (noteId: string, languageCode: string, translatedText: string): void => {
    const notes = voiceNoteStorage.getVoiceNotes();
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          translations: {
            ...note.translations,
            [languageCode]: {
              text: translatedText,
              timestamp: Date.now()
            }
          }
        };
      }
      return note;
    });
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Failed to update voice note translation:', error);
    }
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
  },

  searchVoiceNotes: (searchTerm: string, searchType: 'last' | 'all' = 'all'): VoiceNote[] => {
    const notes = voiceNoteStorage.getVoiceNotes();
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchingNotes = notes.filter(note => {
      const textMatch = note.text.toLowerCase().includes(searchTermLower);
      const titleMatch = note.title?.toLowerCase().includes(searchTermLower);
      return textMatch || titleMatch;
    });
    
    if (searchType === 'last') {
      return matchingNotes.slice(0, 1); // Return only the most recent match
    }
    
    return matchingNotes; // Return all matches, already sorted by timestamp (most recent first)
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
