export interface VoiceNote {
  id: string;
  text: string;
  timestamp: number;
  title?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  translations?: {
    [languageCode: string]: {
      text: string;
      timestamp: number;
    };
  };
}

export interface VoiceNoteStorage {
  saveVoiceNote: (text: string, options?: { skipLocation?: boolean }) => Promise<VoiceNote>;
  saveVoiceNoteSync: (text: string) => VoiceNote;
  getVoiceNotes: () => VoiceNote[];
  deleteVoiceNote: (id: string) => void;
  clearAllNotes: () => void;
  updateVoiceNoteTranslation: (noteId: string, languageCode: string, translatedText: string) => void;
}
