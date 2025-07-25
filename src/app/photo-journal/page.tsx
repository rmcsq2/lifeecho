'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { voiceNoteStorage } from '../../utils/voiceNoteStorage';

export default function PhotoJournal() {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [triggerWord, setTriggerWord] = useState('echo');
  const [dictatedNotes, setDictatedNotes] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number, address?: string} | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTriggerWord(localStorage.getItem('customTriggerWord') || 'echo');
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          
          if ('geocoder' in window) {
          }
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    
    const constraints = [
      { video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } },
      { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } },
      { video: { facingMode: 'environment' } },
      { video: { width: { ideal: 1280 }, height: { ideal: 720 } } },
      { video: true }
    ];

    for (const constraint of constraints) {
      try {
        console.log('Trying camera constraint:', constraint);
        const stream = await navigator.mediaDevices.getUserMedia(constraint);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCapturing(true);
        return;
      } catch (error) {
        console.log('Camera constraint failed:', constraint, error);
        continue;
      }
    }
    
    handleCameraError(new Error('No camera available'));
  };

  const handleCameraError = (error: Error | DOMException) => {
    console.error('Camera access failed:', error);
    
    if (error.name === 'NotAllowedError') {
      setCameraError('Camera access denied. Please allow camera access in your browser settings and try again.');
    } else if (error.name === 'NotFoundError') {
      setCameraError('No camera found. Please ensure your device has a camera and try again.');
    } else if (error.name === 'NotReadableError') {
      setCameraError('Camera is being used by another application. Please close other camera apps and try again.');
    } else if (error.name === 'OverconstrainedError') {
      setCameraError('Camera constraints not supported. Trying with basic settings...');
      setTimeout(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
            setIsCapturing(true);
            setCameraError(null);
          })
          .catch(() => setCameraError('Camera not available on this device.'));
      }, 1000);
    } else {
      setCameraError('Camera not available. Please check your device settings and try again.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const photoDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedPhoto(photoDataUrl);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        setIsCapturing(false);
        
        console.log('Photo captured! Say notes for this photo.');
      }
    }
  };

  const handleTakePhoto = () => {
    if (isCapturing) {
      capturePhoto();
    } else {
      startCamera();
    }
  };

  const { 
    isListening, 
    transcript, 
    isSupported, 
    error, 
    startListening, 
    stopListening 
  } = useVoiceRecognition({
    triggerWord: triggerWord,
    onTriggerDetected: () => {
      console.log('Photo Journal voice activated!');
    },
    onTranscript: (text, isFinal) => {
      if (isFinal && text.trim()) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('take picture') || lowerText.includes('take photo')) {
          handleTakePhoto();
        } else {
          setDictatedNotes(prev => prev ? `${prev} ${text}` : text);
        }
      }
    },
    onAutoSave: (text) => {
      console.log('Auto-saving photo journal notes after 5 seconds of silence:', text);
      if (text.trim()) {
        const savedNote = voiceNoteStorage.saveVoiceNote(text);
        console.log('Photo journal note saved:', savedNote);
      }
      setDictatedNotes('');
    },
    onSubmitDetected: (finalText) => {
      if (finalText.trim()) {
        const savedNote = voiceNoteStorage.saveVoiceNote(finalText);
        console.log('Photo journal note submitted:', savedNote);
        setDictatedNotes('');
      }
    },
    onStopDetected: () => {
      setDictatedNotes('');
      console.log('Photo journal voice stopped by voice command');
    },
    autoSaveDelay: 5000
  });

  useEffect(() => {
    if (isSupported) {
      startListening();
    }
  }, [isSupported, startListening]);

  return (
    <div className="min-h-screen flex flex-col max-w-[864px] mx-auto" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Header Area */}
      <header className="pt-8 pb-6 px-8">
        <div className="flex items-start justify-between mb-4">
          {/* Home Icon - replaced with captured photo thumbnail or camera icon */}
          <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
            {capturedPhoto ? (
              <div className="w-full h-full rounded-sm overflow-hidden">
                <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            )}
          </div>
          
          {/* Title Section */}
          <div className="flex-1 text-center">
            <h1 className="font-league-spartan text-4xl font-bold text-black mb-2">
              LIFE ECHOS
            </h1>
            <h2 className="font-league-spartan text-xl font-medium" style={{ color: '#4E4B4B' }}>
              PHOTO AND TAG
            </h2>
          </div>
          
          {/* Spacer for alignment */}
          <div className="w-8"></div>
        </div>
        
        {/* Voice Activation Section */}
        <div className="flex items-center justify-between mt-8">
          <p className="font-canva-sans text-lg font-medium" style={{ color: '#4E4B4B' }}>
            Say &apos;Echo&apos; Take Notes
          </p>
          
          {/* Voice Wave Logo */}
          <div className={`w-16 h-16 relative transition-all duration-300 ${
            isListening ? 'animate-pulse' : ''
          }`}>
            <Image
              src="/logo.png"
              alt="Voice Wave Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8">
        {/* Photo Section */}
        <div className="mb-6">
          <div 
            className="w-full bg-white rounded-lg overflow-hidden cursor-pointer relative"
            style={{ aspectRatio: '16/9', minHeight: '200px' }}
            onClick={handleTakePhoto}
          >
            {isCapturing ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      capturePhoto();
                    }}
                    className="w-16 h-16 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center"
                  >
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#3B6EFF' }}></div>
                  </button>
                </div>
              </>
            ) : capturedPhoto ? (
              <img src={capturedPhoto} alt="Captured photo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#3B6EFF' }}>
                    <div className="w-8 h-8 bg-white rounded-sm"></div>
                  </div>
                  <p className="font-canva-sans text-lg font-medium text-gray-600 mb-2">
                    Tap to take photo or say &quot;Echo take picture&quot;
                  </p>
                  {cameraError && (
                    <p className="font-canva-sans text-sm text-red-500">
                      Camera access required for photos
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <p className="font-canva-sans text-base text-black leading-relaxed">
            {transcript || dictatedNotes || ''}
          </p>
        </div>

        {/* Map & Location Tag */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: '#E63946' }}>
                <div className="w-6 h-6 bg-white" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
              </div>
              <p className="font-canva-sans text-sm text-gray-600">
                {currentLocation ? 
                  `Location: ${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}` :
                  'Getting location...'
                }
              </p>
              {currentLocation?.address && (
                <p className="font-canva-sans text-xs text-gray-500 mt-1">
                  {currentLocation.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Camera Error Display */}
        {cameraError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="font-canva-sans text-sm text-red-600 text-center mb-3">
              📷 {cameraError}
            </p>
            <button
              onClick={startCamera}
              className="w-full py-2 px-4 rounded-lg font-canva-sans text-sm font-medium transition-colors duration-200 text-white"
              style={{ backgroundColor: 'var(--primary-blue)' }}
            >
              Try Camera Again
            </button>
          </div>
        )}

        {/* Voice Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="font-canva-sans text-sm text-red-600 text-center mb-3">
              🎤 {error}
            </p>
            {(error.includes('Microphone') || error.includes('microphone')) && (
              <button
                onClick={startListening}
                className="w-full py-2 px-4 rounded-lg font-canva-sans text-sm font-medium transition-colors duration-200 text-white"
                style={{ backgroundColor: 'var(--primary-blue)' }}
              >
                Try Voice Again
              </button>
            )}
          </div>
        )}

        {/* Browser Support Warning */}
        {!isSupported && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="font-canva-sans text-sm text-yellow-700">
              Voice recognition not supported. Try Chrome or Edge.
            </p>
          </div>
        )}

        {/* Device Not Found Helper */}
        {error === 'Requested device not found' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="font-canva-sans text-sm text-yellow-700 mb-3">
              Voice features will work when a microphone is available. The camera functionality still works normally.
            </p>
          </div>
        )}
      </main>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
