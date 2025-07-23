'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [brightness, setBrightness] = useState(75);
  const [adaptiveBrightness, setAdaptiveBrightness] = useState(true);
  const [eyeComfort, setEyeComfort] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBrightness = localStorage.getItem('brightness');
      const savedAdaptive = localStorage.getItem('adaptiveBrightness');
      const savedEyeComfort = localStorage.getItem('eyeComfort');
      
      if (savedBrightness) setBrightness(parseInt(savedBrightness));
      if (savedAdaptive) setAdaptiveBrightness(savedAdaptive === 'true');
      if (savedEyeComfort) setEyeComfort(savedEyeComfort === 'true');
    }
  }, []);

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    localStorage.setItem('brightness', value.toString());
  };

  const handleAdaptiveToggle = () => {
    const newValue = !adaptiveBrightness;
    setAdaptiveBrightness(newValue);
    localStorage.setItem('adaptiveBrightness', newValue.toString());
  };

  const handleEyeComfortToggle = () => {
    const newValue = !eyeComfort;
    setEyeComfort(newValue);
    localStorage.setItem('eyeComfort', newValue.toString());
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className="relative w-12 h-6 rounded-full transition-colors duration-200"
      style={{ 
        backgroundColor: enabled ? '#3B6EFF' : '#6B7280' 
      }}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col max-w-[864px] mx-auto" 
         style={{ backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF' }}>
      {/* Header */}
      <header className="pt-16 pb-8 px-8">
        <div className="flex items-center mb-4">
          <Link 
            href="/settings"
            className="mr-4 p-2 rounded-lg transition-colors duration-200"
            style={{ 
              backgroundColor: theme === 'dark' ? '#2A2A2A' : '#F5F5F5',
              color: theme === 'dark' ? '#FFFFFF' : '#000000'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </Link>
          <h1 className="font-league-spartan text-4xl font-bold" 
              style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>
            Appearance
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 pb-8">
        <div className="space-y-8">
          {/* Theme Mode Selection */}
          <div>
            <h2 className="font-canva-sans text-xl font-medium mb-6" 
                style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>
              Theme Mode
            </h2>
            <div className="flex space-x-4 mb-8">
              {/* Light Mode Card */}
              <div className="flex-1">
                <button
                  onClick={() => setTheme('light')}
                  className="w-full p-4 rounded-lg border-2 transition-all duration-200"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: theme === 'light' ? '#3B6EFF' : '#E5E7EB',
                    transform: theme === 'light' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div className="h-24 rounded-md bg-gray-100 mb-3 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                  <p className="font-canva-sans text-sm text-gray-800">Light Mode</p>
                </button>
                <div className="flex justify-center mt-3">
                  <div 
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: '#3B6EFF' }}
                  >
                    {theme === 'light' && (
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3B6EFF' }}></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dark Mode Card */}
              <div className="flex-1">
                <button
                  onClick={() => setTheme('dark')}
                  className="w-full p-4 rounded-lg border-2 transition-all duration-200"
                  style={{
                    backgroundColor: '#121212',
                    borderColor: theme === 'dark' ? '#3B6EFF' : '#374151',
                    transform: theme === 'dark' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div className="h-24 rounded-md bg-gray-800 mb-3 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-600 rounded"></div>
                  </div>
                  <p className="font-canva-sans text-sm text-gray-200">Dark Mode</p>
                </button>
                <div className="flex justify-center mt-3">
                  <div 
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: '#3B6EFF' }}
                  >
                    {theme === 'dark' && (
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3B6EFF' }}></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Brightness Control */}
          <div className="p-6 rounded-lg" 
               style={{ 
                 backgroundColor: theme === 'dark' ? '#2A2A2A' : '#F9F9F9',
                 border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`
               }}>
            <h3 className="font-canva-sans text-lg font-medium mb-4" 
                style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>
              Brightness
            </h3>
            <div className="flex items-center space-x-4">
              {/* Sun Icon (Low) */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                   style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}>
                <circle cx="12" cy="12" r="4"/>
                <path d="m12 2 0 2"/>
                <path d="m12 20 0 2"/>
                <path d="m4.93 4.93 1.41 1.41"/>
                <path d="m17.66 17.66 1.41 1.41"/>
                <path d="m2 12 2 0"/>
                <path d="m20 12 2 0"/>
                <path d="m6.34 17.66-1.41 1.41"/>
                <path d="m19.07 4.93-1.41 1.41"/>
              </svg>
              
              {/* Slider */}
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brightness}
                  onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3B6EFF 0%, #3B6EFF ${brightness}%, ${theme === 'dark' ? '#4B5563' : '#D1D5DB'} ${brightness}%, ${theme === 'dark' ? '#4B5563' : '#D1D5DB'} 100%)`
                  }}
                />
                <style jsx>{`
                  input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #3B6EFF;
                    cursor: pointer;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  }
                  input[type="range"]::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #3B6EFF;
                    cursor: pointer;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  }
                `}</style>
              </div>
              
              {/* Sun Icon (High) */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                   style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}>
                <circle cx="12" cy="12" r="4"/>
                <path d="m12 2 0 2"/>
                <path d="m12 20 0 2"/>
                <path d="m4.93 4.93 1.41 1.41"/>
                <path d="m17.66 17.66 1.41 1.41"/>
                <path d="m2 12 2 0"/>
                <path d="m20 12 2 0"/>
                <path d="m6.34 17.66-1.41 1.41"/>
                <path d="m19.07 4.93-1.41 1.41"/>
              </svg>
            </div>
          </div>

          {/* Adaptive Brightness */}
          <div className="p-6 rounded-lg" 
               style={{ 
                 backgroundColor: theme === 'dark' ? '#2A2A2A' : '#F9F9F9',
                 border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`
               }}>
            <div className="flex justify-between items-center">
              <span className="font-canva-sans text-base" 
                    style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>
                Adaptive Brightness
              </span>
              <ToggleSwitch enabled={adaptiveBrightness} onToggle={handleAdaptiveToggle} />
            </div>
          </div>

          {/* Eye Comfort */}
          <div className="p-6 rounded-lg" 
               style={{ 
                 backgroundColor: theme === 'dark' ? '#2A2A2A' : '#F9F9F9',
                 border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`
               }}>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-canva-sans text-base block" 
                      style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>
                  Eye Comfort
                </span>
                <span className="font-canva-sans text-sm" 
                      style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}>
                  Reduces blue light for eye strain reduction
                </span>
              </div>
              <ToggleSwitch enabled={eyeComfort} onToggle={handleEyeComfortToggle} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
