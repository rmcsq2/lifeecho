interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
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
  }
};
