'use client';

import React, { useState } from 'react';
import VoiceSettings from './voice-settings';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    
    autoSync: true,
    wifiOnly: true,
    
    wakeWord: true,
    backgroundListening: false,
    voiceSensitivity: 'medium',
    
    voiceCommands: true,
    quickActions: true,
    
    aiResponses: true,
    smartSuggestions: true,
    advancedAnalytics: false
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

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
        enabled ? 'bg-blue-500' : 'bg-gray-300'
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-[864px] mx-auto">
      {/* Header */}
      <header className="pt-16 pb-8">
        <h1 className="font-league-spartan text-4xl font-bold text-center text-gray-900">
          Settings
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 pb-8">
        <div className="space-y-8">
          {/* Account Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="font-canva-sans text-xl font-bold text-gray-900 mb-4">
              Account
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base text-gray-700">Push Notifications</span>
                <ToggleSwitch 
                  enabled={settings.notifications} 
                  onToggle={() => handleToggle('notifications')} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base text-gray-700">Email Updates</span>
                <ToggleSwitch 
                  enabled={settings.emailUpdates} 
                  onToggle={() => handleToggle('emailUpdates')} 
                />
              </div>
            </div>
          </div>

          {/* Cloud & Sync Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="font-canva-sans text-xl font-bold text-gray-900 mb-4">
              Cloud & Sync
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base text-gray-700">Auto Sync</span>
                <ToggleSwitch 
                  enabled={settings.autoSync} 
                  onToggle={() => handleToggle('autoSync')} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base text-gray-700">WiFi Only</span>
                <ToggleSwitch 
                  enabled={settings.wifiOnly} 
                  onToggle={() => handleToggle('wifiOnly')} 
                />
              </div>
            </div>
          </div>

          {/* Listening Preferences Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="font-canva-sans text-xl font-bold text-gray-900 mb-4">
              Listening Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base text-gray-700">Wake Word Detection</span>
                <ToggleSwitch 
                  enabled={settings.wakeWord} 
                  onToggle={() => handleToggle('wakeWord')} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base text-gray-700">Background Listening</span>
                <ToggleSwitch 
                  enabled={settings.backgroundListening} 
                  onToggle={() => handleToggle('backgroundListening')} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base text-gray-700">Voice Sensitivity</span>
                <select
                  value={settings.voiceSensitivity}
                  onChange={(e) => handleSelectChange('voiceSensitivity', e.target.value)}
                  className="font-canva-sans text-base text-gray-700 bg-gray-100 border border-gray-300 rounded-lg px-3 py-1"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Voice Navigation Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="font-canva-sans text-xl font-bold text-gray-900 mb-4">
              Voice Navigation
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base text-gray-700">Voice Commands</span>
                <ToggleSwitch 
                  enabled={settings.voiceCommands} 
                  onToggle={() => handleToggle('voiceCommands')} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base text-gray-700">Quick Actions</span>
                <ToggleSwitch 
                  enabled={settings.quickActions} 
                  onToggle={() => handleToggle('quickActions')} 
                />
              </div>
            </div>
          </div>

          {/* Voice Settings Section */}
          <VoiceSettings />

          {/* Premium AI & Ask Echo Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="font-canva-sans text-xl font-bold text-gray-900 mb-4">
              Premium AI & Ask Echo
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base text-gray-700">AI Responses</span>
                <ToggleSwitch 
                  enabled={settings.aiResponses} 
                  onToggle={() => handleToggle('aiResponses')} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base text-gray-700">Smart Suggestions</span>
                <ToggleSwitch 
                  enabled={settings.smartSuggestions} 
                  onToggle={() => handleToggle('smartSuggestions')} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base text-gray-700">Advanced Analytics</span>
                <ToggleSwitch 
                  enabled={settings.advancedAnalytics} 
                  onToggle={() => handleToggle('advancedAnalytics')} 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
