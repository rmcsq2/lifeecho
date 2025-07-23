'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

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
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
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

declare var SpeechRecognition: {
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
}

export const useVoiceRecognition = (options: VoiceRecognitionOptions = {}) => {
  const {
    triggerWord = 'echo',
    continuous = true,
    interimResults = true,
    onTranscript,
    onTriggerDetected,
    onStopDetected,
    onSubmitDetected
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isWaitingForTrigger = useRef(true);
  const shouldContinueListening = useRef(true);
  const persistentTranscript = useRef('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        if (continuous && shouldContinueListening.current) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.log('Recognition restart failed:', e);
            }
          }, 100);
        }
      };
      
      recognition.onerror = (event) => {
        setError(event.error);
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
          const submitCommands = [
            `${triggerWord.toLowerCase()} submit`,
            `${triggerWord.toLowerCase()}submit`,
            'echo submit',
            'echosubmit'
          ];
          
          const hasSubmitCommand = submitCommands.some(cmd => fullTranscript.includes(cmd));
          
          if (hasSubmitCommand) {
            const finalText = persistentTranscript.current.trim();
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
          
          if (finalTranscript) {
            persistentTranscript.current += (persistentTranscript.current ? ' ' : '') + finalTranscript;
          }
          
          const displayTranscript = persistentTranscript.current + (interimTranscript ? ' ' + interimTranscript : '');
          setTranscript(displayTranscript);
          onTranscript?.(displayTranscript, !!finalTranscript);
        }
      };
      
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [triggerWord, continuous, interimResults, onTranscript, onTriggerDetected, onStopDetected]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition not available');
      return;
    }
    
    try {
      isWaitingForTrigger.current = true;
      shouldContinueListening.current = true;
      setTranscript('');
      persistentTranscript.current = '';
      setError(null);
      recognitionRef.current.start();
    } catch (e) {
      setError('Failed to start speech recognition');
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      shouldContinueListening.current = false;
      recognitionRef.current.stop();
      isWaitingForTrigger.current = true;
      setTranscript('');
      persistentTranscript.current = '';
    }
  }, []);

  const resetTrigger = useCallback(() => {
    isWaitingForTrigger.current = true;
    shouldContinueListening.current = true;
    setTranscript('');
    persistentTranscript.current = '';
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTrigger,
    isWaitingForTrigger: isWaitingForTrigger.current
  };
};
