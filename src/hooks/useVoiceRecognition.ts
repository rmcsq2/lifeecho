'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getSpeechRecognitionConfig } from '../utils/browserDetection';

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare const SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

interface VoiceRecognitionOptions {
  triggerWord?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onTriggerDetected?: () => void;
  onStopDetected?: () => void;
  onSubmitDetected?: (finalTranscript: string) => void;
  onAutoSave?: (transcript: string) => void;
  onReminderDetected?: (text: string) => void;
  onTaskDetected?: (text: string) => void;
  onTranslationDetected?: (text: string, targetLanguage: string) => void;
  onSpeechRateDetected?: (rate: 'slower' | 'faster' | 'normal') => void;
  onWordByWordDetected?: () => void;
  onSearchDetected?: (searchTerm: string, searchType: 'last' | 'all') => void;
  onCarPinDetected?: () => void;
  autoSaveDelay?: number;
}

export const useVoiceRecognition = (options: VoiceRecognitionOptions = {}) => {
  const {
    triggerWord = 'echo',
    continuous = true,
    interimResults = true,
    onTranscript,
    onTriggerDetected,
    onStopDetected,
    onSubmitDetected,
    onAutoSave,
    onReminderDetected,
    onTaskDetected,
    onTranslationDetected,
    onSpeechRateDetected,
    onWordByWordDetected,
    onSearchDetected,
    onCarPinDetected,
    autoSaveDelay = 5000
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isWaitingForTrigger = useRef(true);
  const shouldContinueListening = useRef(true);
  const persistentTranscript = useRef('');
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const config = getSpeechRecognitionConfig();
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      try {
        console.log('=== INITIALIZING SpeechRecognition ===');
        console.log('Mobile browser detected:', config.isMobile);
        const recognition = new SpeechRecognition();
        recognition.continuous = config.continuous && continuous;
        recognition.interimResults = interimResults;
        recognition.lang = 'en-US';
        
        if (config.isMobile) {
          console.log('Applied mobile-specific recognition settings');
        }
        
        console.log('SpeechRecognition initialized successfully');
      
      recognition.onstart = () => {
        console.log('=== SpeechRecognition STARTED ===');
        console.log('Recognition started successfully');
        setIsListening(true);
        setIsPaused(false);
        setError(null);
        if (!isWaitingForTrigger.current) {
          resetPauseTimer();
        }
      };

      recognition.addEventListener('audiostart', () => {
        console.log('=== AUDIO START EVENT ===');
        console.log('User agent started capturing audio');
        if (config.isMobile) {
          try {
            if (typeof window !== 'undefined' && window.AudioContext) {
              console.log('Mobile audio capture started - monitoring for feedback');
            }
          } catch (e) {
            console.log('Audio context management failed:', e);
          }
        }
      });

      recognition.addEventListener('audioend', () => {
        console.log('=== AUDIO END EVENT ===');
        console.log('User agent finished capturing audio');
      });

      recognition.addEventListener('soundstart', () => {
        console.log('=== SOUND START EVENT ===');
        console.log('Sound detected (recognizable speech or not)');
      });

      recognition.addEventListener('soundend', () => {
        console.log('=== SOUND END EVENT ===');
        console.log('Sound stopped being detected');
      });

      recognition.addEventListener('speechstart', () => {
        console.log('=== SPEECH START EVENT ===');
        console.log('Speech recognized by service detected');
      });

      recognition.addEventListener('speechend', () => {
        console.log('=== SPEECH END EVENT ===');
        console.log('Speech recognition service stopped detecting speech');
        if (!isWaitingForTrigger.current) {
          resetPauseTimer();
        }
      });
      
      recognition.onend = () => {
        console.log('=== SpeechRecognition ENDED ===');
        console.log('Recognition ended - shouldContinueListening:', shouldContinueListening.current);
        console.log('Recognition ended - continuous:', recognition.continuous);
        console.log('Recognition ended - isPaused:', isPaused);
        setIsListening(false);
        
        if (!isPaused) {
          setIsPaused(true);
        }
        
        clearPauseTimer();
        
        if (recognition.continuous && shouldContinueListening.current) {
          console.log(`Attempting to restart recognition in ${config.restartDelay}ms...`);
          setTimeout(() => {
            try {
              if (recognitionRef.current && shouldContinueListening.current) {
                console.log('Restarting recognition...');
                recognition.start();
              } else {
                console.log('Skipping restart - conditions not met');
              }
            } catch (e) {
              console.log('=== RESTART ERROR ===');
              console.log('Recognition restart failed:', e);
              if (e instanceof Error) {
                if (config.isMobile) {
                  setError('Voice recognition stopped. Tap to try again.');
                  shouldContinueListening.current = false;
                } else {
                  setError(`Failed to restart voice recognition: ${e.message}`);
                }
              }
            }
          }, config.restartDelay);
        }
      };
      
      recognition.onerror = (event) => {
        console.log('=== SpeechRecognition ERROR DETECTED ===');
        console.log('Error type:', event.error);
        console.log('Error event:', event);
        console.log('Current state - isListening:', isListening);
        console.log('Current state - shouldContinueListening:', shouldContinueListening.current);
        console.log('Current state - isWaitingForTrigger:', isWaitingForTrigger.current);
        console.log('Mobile browser:', config.isMobile);
        console.log('==========================================');
        
        if (event.error === 'aborted') {
          console.log('ABORT ERROR: Voice recognition was aborted - investigating cause');
          if (config.isMobile) {
            setError('Voice recognition stopped. Mobile browsers have limited support. Try speaking closer to the microphone.');
            shouldContinueListening.current = false;
          } else {
            setError('Voice recognition was aborted. Please try again.');
          }
        } else if (event.error === 'audio-capture') {
          setError('Audio capture failed. Please check your microphone.');
        } else if (event.error === 'network') {
          if (config.isMobile) {
            setError('Network error. Mobile browsers have limited voice recognition support.');
          } else {
            setError('Network error occurred during voice recognition.');
          }
        } else if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access and refresh the page.');
          shouldContinueListening.current = false;
        } else if (event.error === 'service-not-allowed') {
          setError('Speech recognition service not allowed.');
          shouldContinueListening.current = false;
        } else if (event.error === 'bad-grammar') {
          setError('Speech recognition grammar error.');
        } else if (event.error === 'language-not-supported') {
          setError('Language not supported for speech recognition.');
        } else {
          setError(`Voice recognition error: ${event.error}`);
        }
        
        setIsListening(false);
      };
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript.toLowerCase().trim();
          
          if (result.isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        const fullTranscript = finalTranscript || interimTranscript;
        
        if (isWaitingForTrigger.current && fullTranscript.includes(triggerWord.toLowerCase())) {
          isWaitingForTrigger.current = false;
          onTriggerDetected?.();
          setTranscript('');
          return;
        }
        
        if (!isWaitingForTrigger.current) {
          resetPauseTimer();
          
          const reminderCommands = [
            'echo remind',
            'echoremind',
            `${triggerWord.toLowerCase()} remind`,
            `${triggerWord.toLowerCase()}remind`
          ];
          
          const taskCommands = [
            'echo remember',
            'echoremember',
            `${triggerWord.toLowerCase()} remember`,
            `${triggerWord.toLowerCase()}remember`
          ];
          
          const hasReminderCommand = reminderCommands.some(cmd => fullTranscript.includes(cmd));
          const hasTaskCommand = taskCommands.some(cmd => fullTranscript.includes(cmd));
          
          if (hasReminderCommand || hasTaskCommand) {
            let cleanText = fullTranscript;
            
            const triggerPatterns = [
              new RegExp(`\\b${triggerWord.toLowerCase()}\\b,?\\s*`, 'gi'),
              new RegExp(`\\becho\\b,?\\s*`, 'gi')
            ];
            
            triggerPatterns.forEach(pattern => {
              cleanText = cleanText.replace(pattern, '').trim();
            });
            
            reminderCommands.concat(taskCommands).forEach(cmd => {
              cleanText = cleanText.replace(new RegExp(cmd, 'gi'), '').trim();
            });
            
            cleanText = cleanText.replace(/^(me\s+)?to\s+/i, '').trim();
            
            if (cleanText) {
              if (hasReminderCommand) {
                onReminderDetected?.(cleanText);
              } else {
                onTaskDetected?.(cleanText);
              }
            }
            
            shouldContinueListening.current = false;
            isWaitingForTrigger.current = true;
            onStopDetected?.();
            setTranscript('');
            persistentTranscript.current = '';
            recognition.stop();
            return;
          }
          
          const submitCommands = [
            `${triggerWord.toLowerCase()} submit`,
            `${triggerWord.toLowerCase()}submit`,
            'echo submit',
            'echosubmit'
          ];
          
          const hasSubmitCommand = submitCommands.some(cmd => fullTranscript.includes(cmd));
          
          if (hasSubmitCommand) {
            let finalText = persistentTranscript.current.trim();
            
            const triggerPatterns = [
              new RegExp(`\\b${triggerWord.toLowerCase()}\\b,?\\s*`, 'gi'),
              new RegExp(`\\becho\\b,?\\s*`, 'gi')
            ];
            
            triggerPatterns.forEach(pattern => {
              finalText = finalText.replace(pattern, '').trim();
            });
            
            if (finalText) {
              onSubmitDetected?.(finalText);
            }
            shouldContinueListening.current = false;
            isWaitingForTrigger.current = true;
            onStopDetected?.();
            setTranscript('');
            persistentTranscript.current = '';
            recognition.stop();
            return;
          }
          
          const stopCommands = [
            `${triggerWord.toLowerCase()} stop`,
            `${triggerWord.toLowerCase()}stop`,
            'echo stop',
            'echostop'
          ];
          
          const hasStopCommand = stopCommands.some(cmd => fullTranscript.includes(cmd));
          
          if (hasStopCommand) {
            shouldContinueListening.current = false;
            isWaitingForTrigger.current = true;
            onStopDetected?.();
            setTranscript('');
            persistentTranscript.current = '';
            recognition.stop();
            return;
          }
          
          const translationCommands = [
            'echo translate',
            'echotranslate',
            `${triggerWord.toLowerCase()} translate`,
            `${triggerWord.toLowerCase()}translate`
          ];
          
          const hasTranslationCommand = translationCommands.some(cmd => fullTranscript.includes(cmd));
          
          if (hasTranslationCommand) {
            const languageMatch = fullTranscript.match(/translate.*?to\s+(\w+)/i) || 
                                fullTranscript.match(/translate.*?(\w+)$/i);
            
            if (languageMatch) {
              const targetLanguage = languageMatch[1].toLowerCase();
              let textToTranslate = persistentTranscript.current.trim();
              
              const triggerPatterns = [
                new RegExp(`\\b${triggerWord.toLowerCase()}\\b,?\\s*`, 'gi'),
                new RegExp(`\\becho\\b,?\\s*`, 'gi')
              ];
              
              triggerPatterns.forEach(pattern => {
                textToTranslate = textToTranslate.replace(pattern, '').trim();
              });
              
              if (textToTranslate && onTranslationDetected) {
                onTranslationDetected(textToTranslate, targetLanguage);
              }
            }
            
            shouldContinueListening.current = false;
            isWaitingForTrigger.current = true;
            onStopDetected?.();
            setTranscript('');
            persistentTranscript.current = '';
            recognition.stop();
            return;
          }

          const speechRateCommands = [
            'say that slower',
            'speak slower',
            'repeat slower',
            'say slower',
            'slower please'
          ];
          
          const hasSpeechRateCommand = speechRateCommands.some(cmd => fullTranscript.includes(cmd));
          
          if (hasSpeechRateCommand && onSpeechRateDetected) {
            onSpeechRateDetected('slower');
            
            shouldContinueListening.current = false;
            isWaitingForTrigger.current = true;
            onStopDetected?.();
            setTranscript('');
            persistentTranscript.current = '';
            recognition.stop();
            return;
          }

          const wordByWordCommands = [
            'repeat word by word',
            'say word by word',
            'word by word',
            'repeat slowly',
            'practice mode'
          ];
          
          const hasWordByWordCommand = wordByWordCommands.some(cmd => fullTranscript.includes(cmd));
          
          if (hasWordByWordCommand && onWordByWordDetected) {
            onWordByWordDetected();
            
            shouldContinueListening.current = false;
            isWaitingForTrigger.current = true;
            onStopDetected?.();
            setTranscript('');
            persistentTranscript.current = '';
            recognition.stop();
            return;
          }

          const carPinCommands = [
            'echo drop a pin for my car',
            'echo drop car pin',
            'echo drop pin for my car',
            `${triggerWord.toLowerCase()} drop a pin for my car`,
            `${triggerWord.toLowerCase()} drop car pin`,
            `${triggerWord.toLowerCase()} drop pin for my car`
          ];
          
          const hasCarPinCommand = carPinCommands.some(cmd => fullTranscript.includes(cmd));
          
          if (hasCarPinCommand && onCarPinDetected) {
            onCarPinDetected();
            
            shouldContinueListening.current = false;
            isWaitingForTrigger.current = true;
            onStopDetected?.();
            setTranscript('');
            persistentTranscript.current = '';
            recognition.stop();
            return;
          }

          const searchCommands = [
            'echo find',
            'echofind',
            `${triggerWord.toLowerCase()} find`,
            `${triggerWord.toLowerCase()}find`,
            'echo bring up',
            'echobring up',
            `${triggerWord.toLowerCase()} bring up`,
            `${triggerWord.toLowerCase()}bring up`
          ];
          
          const hasSearchCommand = searchCommands.some(cmd => fullTranscript.includes(cmd));
          
          if (hasSearchCommand && onSearchDetected) {
            let searchQuery = fullTranscript;
            
            const triggerPatterns = [
              new RegExp(`\\b${triggerWord.toLowerCase()}\\b,?\\s*`, 'gi'),
              new RegExp(`\\becho\\b,?\\s*`, 'gi')
            ];
            
            triggerPatterns.forEach(pattern => {
              searchQuery = searchQuery.replace(pattern, '').trim();
            });
            
            searchQuery = searchQuery.replace(/\b(find|bring up)\b/gi, '').trim();
            
            const searchPatterns = [
              /(?:the last time i spoke about|last time i mentioned|last mention of)\s+(.+)/i,
              /(?:all notes where i talked about|all mentions of|everything about)\s+(.+)/i,
              /(?:spoke about|talked about|mentioned)\s+(.+)/i,
              /(.+)/i // fallback to capture remaining text
            ];
            
            let searchTerm = '';
            let searchType = 'all'; // 'last' or 'all'
            
            for (const pattern of searchPatterns) {
              const match = searchQuery.match(pattern);
              if (match && match[1]) {
                searchTerm = match[1].trim();
                if (pattern.source.includes('last time')) {
                  searchType = 'last';
                }
                break;
              }
            }
            
            if (searchTerm) {
              onSearchDetected(searchTerm, searchType as 'last' | 'all');
            }
            
            shouldContinueListening.current = false;
            isWaitingForTrigger.current = true;
            onStopDetected?.();
            setTranscript('');
            persistentTranscript.current = '';
            recognition.stop();
            return;
          }
          
          if (finalTranscript) {
            let cleanFinalTranscript = finalTranscript;
            const triggerPatterns = [
              new RegExp(`\\b${triggerWord.toLowerCase()}\\b,?\\s*`, 'gi'),
              new RegExp(`\\becho\\b,?\\s*`, 'gi')
            ];
            
            triggerPatterns.forEach(pattern => {
              cleanFinalTranscript = cleanFinalTranscript.replace(pattern, '').trim();
            });
            
            if (cleanFinalTranscript) {
              persistentTranscript.current += (persistentTranscript.current ? ' ' : '') + cleanFinalTranscript;
              
              if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
              }
              
              if (onAutoSave && persistentTranscript.current.trim()) {
                autoSaveTimeoutRef.current = setTimeout(() => {
                  onAutoSave(persistentTranscript.current.trim());
                }, autoSaveDelay);
              }
            }
          }
          
          let cleanInterimTranscript = interimTranscript;
          const triggerPatterns = [
            new RegExp(`\\b${triggerWord.toLowerCase()}\\b,?\\s*`, 'gi'),
            new RegExp(`\\becho\\b,?\\s*`, 'gi')
          ];
          
          triggerPatterns.forEach(pattern => {
            cleanInterimTranscript = cleanInterimTranscript.replace(pattern, '').trim();
          });
          
          const displayTranscript = persistentTranscript.current + (cleanInterimTranscript ? ' ' + cleanInterimTranscript : '');
          setTranscript(displayTranscript);
          onTranscript?.(displayTranscript, !!finalTranscript);
        }
      };
      
        recognitionRef.current = recognition;
      } catch (initError) {
        console.log('=== RECOGNITION INITIALIZATION ERROR ===');
        console.log('Failed to initialize SpeechRecognition:', initError);
        setIsSupported(false);
        if (initError instanceof Error) {
          setError(`Speech recognition initialization failed: ${initError.message}`);
        } else {
          setError('Speech recognition initialization failed');
        }
      }
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          console.log('=== CLEANING UP SpeechRecognition ===');
          recognitionRef.current.stop();
        } catch (cleanupError) {
          console.log('Error during recognition cleanup:', cleanupError);
        }
      }
    };
  }, [triggerWord, continuous, interimResults, onTranscript, onTriggerDetected, onStopDetected]);

  const startListening = useCallback(async () => {
    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition not available');
      return;
    }
    
    const config = getSpeechRecognitionConfig();
    
    try {
      const audioConstraints = config.isMobile 
        ? { 
            audio: { 
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: false,
              sampleRate: 16000
            } 
          }
        : { audio: true };
      
      await navigator.mediaDevices.getUserMedia(audioConstraints);
      
      isWaitingForTrigger.current = true;
      shouldContinueListening.current = true;
      setTranscript('');
      persistentTranscript.current = '';
      setError(null);
      
      try {
        console.log('=== ATTEMPTING TO START RECOGNITION ===');
        console.log('Recognition state before start:', {
          isListening: isListening,
          shouldContinueListening: shouldContinueListening.current,
          isWaitingForTrigger: isWaitingForTrigger.current,
          recognitionExists: !!recognitionRef.current,
          isMobile: config.isMobile
        });
        
        if (isListening) {
          console.log('Recognition already running, stopping first to prevent abort error');
          recognitionRef.current.stop();
          await new Promise(resolve => setTimeout(resolve, config.retryDelay));
        }
        
        recognitionRef.current.start();
        console.log('Recognition start() called successfully');
      } catch (startError) {
        console.log('=== START ERROR ===');
        console.log('Recognition start failed:', startError);
        
        if (startError instanceof Error) {
          if (startError.message.includes('already started') || startError.message.includes('aborted')) {
            console.log('Detected recognition already started or aborted, attempting restart');
            try {
              recognitionRef.current.stop();
              await new Promise(resolve => setTimeout(resolve, config.retryDelay));
              recognitionRef.current.start();
              console.log('Recognition restarted successfully after abort/already-started error');
            } catch (retryError) {
              console.log('Retry after abort failed:', retryError);
              if (config.isMobile) {
                setError('Voice recognition unavailable. Mobile browsers have limited support. Try refreshing the page.');
              } else {
                setError('Voice recognition was aborted. Please try again.');
              }
            }
          } else {
            setError(`Failed to start voice recognition: ${startError.message}`);
          }
        } else {
          setError('Failed to start voice recognition. Please try again.');
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        if (e.name === 'NotAllowedError') {
          setError('Microphone access denied. Please allow microphone access and refresh the page.');
        } else if (e.name === 'NotFoundError') {
          setError('No microphone found. Please connect a microphone and try again.');
        } else if (e.name === 'NotReadableError') {
          setError('Microphone is being used by another application. Please close other apps and try again.');
        } else if (e.name === 'OverconstrainedError') {
          setError('Microphone constraints not supported. Please try a different microphone.');
        } else {
          setError(`Microphone error: ${e.message}`);
        }
      } else {
        setError('Failed to access microphone. Please check your device settings.');
      }
    }
  }, [isSupported]);

  const resetPauseTimer = useCallback(() => {
    clearPauseTimer();
    setIsPaused(false);
    
    pauseTimerRef.current = setTimeout(() => {
      console.log('=== PAUSE TIMER TRIGGERED ===');
      console.log('15 seconds of silence detected, pausing and stopping recognition');
      setIsPaused(true);
      if (recognitionRef.current && shouldContinueListening.current) {
        shouldContinueListening.current = false;
        recognitionRef.current.stop();
      }
    }, 15000); // 15 seconds of silence like React Native example
  }, []);

  const clearPauseTimer = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      shouldContinueListening.current = false;
      recognitionRef.current.stop();
      isWaitingForTrigger.current = true;
      setTranscript('');
      persistentTranscript.current = '';
      setIsPaused(false);
      
      clearPauseTimer();
      
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
        autoSaveTimeoutRef.current = null;
      }
    }
  }, [clearPauseTimer]);

  const resetTrigger = useCallback(() => {
    isWaitingForTrigger.current = true;
    shouldContinueListening.current = true;
    setTranscript('');
    persistentTranscript.current = '';
    setIsPaused(false);
    
    clearPauseTimer();
    
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
    }
  }, [clearPauseTimer]);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    isPaused,
    startListening,
    stopListening,
    resetTrigger,
    retryMicrophone: startListening,
    isWaitingForTrigger: isWaitingForTrigger.current
  };
};
