'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AppSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    // Listening Preferences
    listeningMode: 'wake-word', // 'manual', 'wake-word', 'ambient'
    wakeWordSensitivity: 50,
    voiceNavigation: true,
    translatorMode: false,
    pinGeoTag: true,
    aiTone: 'calm', // 'calm', 'motivational', 'analytical'
    
    // Premium AI & Ask Echo
    premiumAI: true,
    askEcho: true
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSliderChange = (key: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      console.log('Delete account confirmed');
    }
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className="relative w-12 h-6 rounded-full transition-colors duration-200"
      style={{ 
        backgroundColor: enabled ? '#3B6EFF' : '#E5E7EB' 
      }}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  const RadioButton = ({ selected, onSelect, label }: { selected: boolean; onSelect: () => void; label: string }) => (
    <button
      onClick={onSelect}
      className="flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 hover:bg-gray-50"
    >
      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
           style={{ borderColor: selected ? '#3B6EFF' : '#E5E7EB' }}>
        {selected && (
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3B6EFF' }} />
        )}
      </div>
      <span className="font-canva-sans text-base" style={{ color: '#4E4B4B' }}>
        {label}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col max-w-[864px] mx-auto" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <header className="pt-16 pb-8 px-8">
        <div className="flex items-center justify-between mb-4">
          <Link 
            href="/home"
            className="p-2 rounded-lg transition-colors duration-200"
            style={{ backgroundColor: '#E5E7EB', color: '#000000' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          </Link>
          <div className="w-10"></div>
        </div>
        
        <div className="text-center">
          <h1 className="font-league-spartan text-4xl font-bold mb-2" style={{ color: '#000000' }}>
            LIFE ECHOS
          </h1>
          <h2 className="font-canva-sans text-lg font-medium uppercase tracking-wide" style={{ color: '#4E4B4B' }}>
            APP SETTINGS
          </h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 pb-8">
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-canva-sans text-xl font-bold mb-4" style={{ color: '#000000' }}>
              Account Settings
            </h3>
            <div className="space-y-4">
              <Link 
                href="/profile"
                className="flex justify-between items-center p-3 rounded-lg transition-colors duration-200 hover:bg-gray-50"
              >
                <span className="font-canva-sans text-base" style={{ color: '#4E4B4B' }}>
                  Edit Profile (Name, Email, Password)
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B6EFF" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </Link>
              
              <Link 
                href="/settings/appearance"
                className="flex justify-between items-center p-3 rounded-lg transition-colors duration-200 hover:bg-gray-50"
              >
                <span className="font-canva-sans text-base" style={{ color: '#4E4B4B' }}>
                  Browser Display - Light/Dark
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B6EFF" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </Link>
              
              <button
                onClick={handleDeleteAccount}
                className="flex justify-between items-center p-3 rounded-lg transition-colors duration-200 hover:bg-red-50 w-full text-left"
              >
                <span className="font-canva-sans text-base" style={{ color: '#DC2626' }}>
                  Delete Account
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Listening Preferences */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-canva-sans text-xl font-bold mb-4" style={{ color: '#000000' }}>
              Listening Preferences
            </h3>
            
            <div className="space-y-6">
              {/* Listening Mode Options */}
              <div>
                <h4 className="font-canva-sans text-base font-medium mb-3" style={{ color: '#4E4B4B' }}>
                  Listening Mode Options
                </h4>
                <div className="space-y-2">
                  <RadioButton
                    selected={settings.listeningMode === 'manual'}
                    onSelect={() => handleSelectChange('listeningMode', 'manual')}
                    label="Manual Activation"
                  />
                  <RadioButton
                    selected={settings.listeningMode === 'wake-word'}
                    onSelect={() => handleSelectChange('listeningMode', 'wake-word')}
                    label='Wake Word ("Echo" / "Life Echo")'
                  />
                  <RadioButton
                    selected={settings.listeningMode === 'ambient'}
                    onSelect={() => handleSelectChange('listeningMode', 'ambient')}
                    label="Intermittent Ambient Mode"
                  />
                  {settings.listeningMode === 'ambient' && (
                    <div className="ml-8 mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="font-canva-sans text-sm" style={{ color: '#92400E' }}>
                        ⚠️ Disclaimer: Ambient mode may consume more battery and data.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Train My Voice */}
              <div>
                <Link 
                  href="/voice-trainer"
                  className="flex justify-between items-center p-3 rounded-lg transition-colors duration-200 hover:bg-gray-50"
                >
                  <div>
                    <span className="font-canva-sans text-base font-medium" style={{ color: '#4E4B4B' }}>
                      Train My Voice (Normal / Whisper / Loud)
                    </span>
                    <p className="font-canva-sans text-sm" style={{ color: '#9CA3AF' }}>
                      Improve recognition accuracy
                    </p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B6EFF" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6"/>
                  </svg>
                </Link>
              </div>

              {/* Wake Word Sensitivity */}
              <div>
                <h4 className="font-canva-sans text-base font-medium mb-3" style={{ color: '#4E4B4B' }}>
                  Wake Word Sensitivity
                </h4>
                <div className="px-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.wakeWordSensitivity}
                    onChange={(e) => handleSliderChange('wakeWordSensitivity', parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3B6EFF 0%, #3B6EFF ${settings.wakeWordSensitivity}%, #E5E7EB ${settings.wakeWordSensitivity}%, #E5E7EB 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm mt-1">
                    <span className="font-canva-sans" style={{ color: '#9CA3AF' }}>Low</span>
                    <span className="font-canva-sans" style={{ color: '#4E4B4B' }}>{settings.wakeWordSensitivity}%</span>
                    <span className="font-canva-sans" style={{ color: '#9CA3AF' }}>High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Navigation & AI */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-canva-sans text-xl font-bold mb-4" style={{ color: '#000000' }}>
              Voice Navigation & AI
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base" style={{ color: '#4E4B4B' }}>Enable Voice Navigation</span>
                <ToggleSwitch 
                  enabled={settings.voiceNavigation} 
                  onToggle={() => handleToggle('voiceNavigation')} 
                />
              </div>

              <Link 
                href="/ask-echo"
                className="flex justify-between items-center p-3 rounded-lg transition-colors duration-200 hover:bg-gray-50"
              >
                <span className="font-canva-sans text-base" style={{ color: '#4E4B4B' }}>
                  Premium AI & Ask Echo
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B6EFF" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </Link>

              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base" style={{ color: '#4E4B4B' }}>Translator Mode</span>
                <ToggleSwitch 
                  enabled={settings.translatorMode} 
                  onToggle={() => handleToggle('translatorMode')} 
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base" style={{ color: '#4E4B4B' }}>Pin (GeoTag) anything</span>
                <ToggleSwitch 
                  enabled={settings.pinGeoTag} 
                  onToggle={() => handleToggle('pinGeoTag')} 
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base" style={{ color: '#4E4B4B' }}>AI Tone Preference</span>
                <select
                  value={settings.aiTone}
                  onChange={(e) => handleSelectChange('aiTone', e.target.value)}
                  className="font-canva-sans text-base rounded-lg px-3 py-2 border"
                  style={{ 
                    color: '#000000', 
                    backgroundColor: '#FFFFFF', 
                    borderColor: '#E5E7EB' 
                  }}
                >
                  <option value="calm">Calm</option>
                  <option value="motivational">Motivational</option>
                  <option value="analytical">Analytical</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
