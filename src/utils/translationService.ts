interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}

interface TranslationWithSpeech extends TranslationResult {
  speak: (options?: SpeechOptions) => Promise<void>;
  speakSlowly: () => Promise<void>;
  speakWordByWord: () => Promise<void>;
}

export const translationService = {
  async translateText(text: string, targetLanguage: string): Promise<TranslationResult> {
    try {
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`);
      const data = await response.json();
      
      return {
        translatedText: data[0][0][0],
        sourceLanguage: data[2],
        targetLanguage: targetLanguage
      };
    } catch (error) {
      console.error('Translation failed:', error);
      throw new Error('Translation service unavailable');
    }
  },

  async translateWithSpeech(text: string, targetLanguage: string): Promise<TranslationWithSpeech> {
    const translation = await this.translateText(text, targetLanguage);
    
    return {
      ...translation,
      speak: (options: SpeechOptions = {}) => this.speakText(translation.translatedText, targetLanguage, options),
      speakSlowly: () => this.speakText(translation.translatedText, targetLanguage, { rate: 0.5 }),
      speakWordByWord: () => this.speakWordByWord(translation.translatedText, targetLanguage)
    };
  },

  async speakText(text: string, language: string, options: SpeechOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = this.getLanguageLocale(language);
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      const voices = speechSynthesis.getVoices();
      const targetVoice = voices.find(voice => 
        voice.lang.startsWith(utterance.lang) || 
        voice.lang.startsWith(language)
      );
      
      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis failed: ${event.error}`));

      speechSynthesis.speak(utterance);
    });
  },

  async speakWordByWord(text: string, language: string, pauseDuration: number = 1000): Promise<void> {
    const words = text.split(' ');
    
    for (const word of words) {
      await this.speakText(word.trim(), language);
      await new Promise(resolve => setTimeout(resolve, pauseDuration));
    }
  },

  getLanguageLocale(languageCode: string): string {
    const localeMap: { [key: string]: string } = {
      'es': 'es-ES',
      'fr': 'fr-FR', 
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-PT',
      'ru': 'ru-RU',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'zh': 'zh-CN',
      'ar': 'ar-SA'
    };
    
    return localeMap[languageCode] || 'en-US';
  },

  getAvailableVoices(languageCode?: string): SpeechSynthesisVoice[] {
    if (!('speechSynthesis' in window)) {
      return [];
    }

    const voices = speechSynthesis.getVoices();
    
    if (languageCode) {
      const locale = this.getLanguageLocale(languageCode);
      return voices.filter(voice => 
        voice.lang.startsWith(locale) || 
        voice.lang.startsWith(languageCode)
      );
    }
    
    return voices;
  },

  isSpeechSynthesisSupported(): boolean {
    return 'speechSynthesis' in window;
  },

  getSupportedLanguages(): { [key: string]: string } {
    return {
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic'
    };
  },

  getLanguageCode(languageName: string): string | null {
    const languages = this.getSupportedLanguages();
    const normalizedName = languageName.toLowerCase();
    
    for (const [code, name] of Object.entries(languages)) {
      if ((name as string).toLowerCase() === normalizedName || code === normalizedName) {
        return code;
      }
    }
    
    return null;
  },

  getSpeechSettings(): { enabled: boolean; defaultLanguage: string; rate: number } {
    if (typeof window === 'undefined') {
      return { enabled: true, defaultLanguage: 'es', rate: 1 };
    }
    
    const settings = localStorage.getItem('speechTranslationSettings');
    if (settings) {
      return JSON.parse(settings);
    }
    
    return { enabled: true, defaultLanguage: 'es', rate: 1 };
  },

  setSpeechSettings(settings: { enabled?: boolean; defaultLanguage?: string; rate?: number }): void {
    if (typeof window === 'undefined') return;
    
    const currentSettings = this.getSpeechSettings();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem('speechTranslationSettings', JSON.stringify(newSettings));
  }
};
