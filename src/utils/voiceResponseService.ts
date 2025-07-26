export interface VoiceResponseOptions {
  enabled?: boolean;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
}

export const voiceResponseService = {
  speak: (text: string, options: VoiceResponseOptions = {}): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported');
        resolve();
        return;
      }

      const {
        enabled = true,
        rate = 1,
        pitch = 1,
        volume = 0.8,
        voice = null
      } = options;

      if (!enabled) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      if (voice) {
        const voices = speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.name === voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        reject(event);
      };

      speechSynthesis.speak(utterance);
    });
  },

  getVoices: (): SpeechSynthesisVoice[] => {
    if (!('speechSynthesis' in window)) {
      return [];
    }
    return speechSynthesis.getVoices();
  },

  isSupported: (): boolean => {
    return 'speechSynthesis' in window;
  }
};
