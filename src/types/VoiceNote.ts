export interface VoiceNote {
  id: string;
  text: string;
  timestamp: number;
  title?: string;
}

export interface VoiceNoteStorage {
  saveVoiceNote: (text: string) => VoiceNote;
  getVoiceNotes: () => VoiceNote[];
  deleteVoiceNote: (id: string) => void;
  clearAllNotes: () => void;
}
