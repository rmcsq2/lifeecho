'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface VoiceTrainingSample {
  environment: string;
  file: string;
  timestamp: string;
}

export default function VoiceTrainer() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentEnvironment, setCurrentEnvironment] = useState<string | null>(null);
  const [samples, setSamples] = useState<VoiceTrainingSample[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const environments = [
    { id: 'outdoors', label: 'Outdoors' },
    { id: 'home', label: 'At home' },
    { id: 'car', label: 'In a car' },
    { id: 'noisy', label: 'In a noisy place' }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSamples = localStorage.getItem('voiceTrainingSamples');
      if (savedSamples) {
        setSamples(JSON.parse(savedSamples));
      }
    }
  }, []);

  const startRecording = async (environment: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const newSample: VoiceTrainingSample = {
          environment,
          file: audioUrl,
          timestamp: new Date().toISOString()
        };

        const updatedSamples = [...samples, newSample];
        setSamples(updatedSamples);
        localStorage.setItem('voiceTrainingSamples', JSON.stringify(updatedSamples));
        
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        setCurrentEnvironment(null);
        setRecordingTime(0);
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };

      setCurrentEnvironment(environment);
      setIsRecording(true);
      setRecordingTime(0);
      mediaRecorder.start();

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 2) {
            stopRecording();
            return 3;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const getSampleCount = (environment: string) => {
    return samples.filter(sample => sample.environment === environment).length;
  };

  const getEnvironmentStatus = (environment: string) => {
    const count = getSampleCount(environment);
    if (count >= 3) return 'complete';
    if (count > 0) return 'partial';
    return 'pending';
  };

  return (
    <div className="min-h-screen flex flex-col max-w-[864px] mx-auto" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <header className="pt-16 pb-8 px-8">
        <div className="flex items-center mb-4">
          <Link 
            href="/settings"
            className="mr-4 p-2 rounded-lg transition-colors duration-200"
            style={{ backgroundColor: '#E5E7EB', color: '#000000' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </Link>
        </div>
        
        <div className="text-center">
          <h1 className="font-league-spartan text-4xl font-bold text-black mb-2">
            LIFE ECHOS
          </h1>
          <h2 className="font-canva-sans text-xl font-medium" style={{ color: '#4E4B4B' }}>
            TRAINING
          </h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 pb-8 flex flex-col items-center">
        {/* Voice Wave Icon */}
        <div className={`w-32 h-32 relative mb-8 transition-all duration-300 ${
          isRecording ? 'animate-pulse scale-110' : ''
        }`}>
          <Image
            src="/logo.png"
            alt="Voice Wave Logo"
            fill
            className="object-contain"
            priority
          />
          {isRecording && (
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping"></div>
          )}
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="mb-6 text-center">
            <p className="font-canva-sans text-lg font-medium text-black mb-2">
              Recording for {currentEnvironment}...
            </p>
            <p className="font-canva-sans text-base" style={{ color: '#4E4B4B' }}>
              {recordingTime}/3 seconds
            </p>
          </div>
        )}

        {/* Instructional Text */}
        {!isRecording && (
          <div className="mb-8 text-center">
            <p className="font-canva-sans text-lg mb-6" style={{ color: '#4E4B4B' }}>
              Tap the button and record your voice in different situations:
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {environments.map((env) => {
                const status = getEnvironmentStatus(env.id);
                const count = getSampleCount(env.id);
                
                return (
                  <div key={env.id} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'complete' ? 'bg-green-500' : 
                      status === 'partial' ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="font-canva-sans text-base" style={{ color: '#4E4B4B' }}>
                      {env.label} ({count}/3)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Environment Selection */}
        {!isRecording && (
          <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-md">
            {environments.map((env) => {
              const status = getEnvironmentStatus(env.id);
              const count = getSampleCount(env.id);
              const isComplete = count >= 3;
              
              return (
                <button
                  key={env.id}
                  onClick={() => !isComplete && startRecording(env.id)}
                  disabled={isComplete}
                  className={`p-4 rounded-lg font-canva-sans text-base font-medium transition-all duration-200 ${
                    isComplete 
                      ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                      : 'bg-white text-black hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span>{env.label}</span>
                    <span className="text-sm">
                      {isComplete ? '✓ Complete' : `${count}/3 samples`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Record Button */}
        {isRecording && (
          <button
            onClick={stopRecording}
            className="px-8 py-3 rounded-lg font-canva-sans text-xl font-medium text-white transition-colors duration-200"
            style={{ backgroundColor: '#DC2626' }}
          >
            Stop Recording
          </button>
        )}

        {/* Progress Summary */}
        {!isRecording && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm w-full max-w-md">
            <h3 className="font-canva-sans text-lg font-medium text-black mb-4 text-center">
              Training Progress
            </h3>
            <div className="space-y-3">
              {environments.map((env) => {
                const count = getSampleCount(env.id);
                const progress = (count / 3) * 100;
                
                return (
                  <div key={env.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-canva-sans text-sm" style={{ color: '#4E4B4B' }}>
                        {env.label}
                      </span>
                      <span className="font-canva-sans text-sm" style={{ color: '#4E4B4B' }}>
                        {count}/3
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${progress}%`,
                          backgroundColor: progress === 100 ? '#10B981' : '#3B6EFF'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {samples.length >= 12 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="font-canva-sans text-sm text-green-700 text-center">
                  🎉 Voice training complete! Your voice recognition accuracy should be improved.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
