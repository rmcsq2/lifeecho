'use client';

import React, { useState } from 'react';
import VoiceSettings from './voice-settings';
import ThemeToggle from '@/components/ThemeToggle';

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
      className="relative w-12 h-6 rounded-full transition-colors duration-200"
      style={{ 
        backgroundColor: enabled ? 'var(--primary-blue)' : 'var(--muted)' 
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
    <div className="min-h-screen flex flex-col max-w-[864px] mx-auto" style={{ backgroundColor: 'var(--secondary)' }}>
      {/* Header */}
      <header className="pt-16 pb-8">
        <h1 className="font-league-spartan text-4xl font-bold text-center" style={{ color: 'var(--foreground)' }}>
          Settings
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 pb-8">
        <div className="space-y-8">
          {/* Account Section */}
          <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} className="rounded-lg shadow-sm p-6">
            <h2 className="font-canva-sans text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Account
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base" style={{ color: 'var(--muted-foreground)' }}>Push Notifications</span>
                <ToggleSwitch 
                  enabled={settings.notifications} 
                  onToggle={() => handleToggle('notifications')} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base" style={{ color: 'var(--muted-foreground)' }}>Email Updates</span>
                <ToggleSwitch 
                  enabled={settings.emailUpdates} 
                  onToggle={() => handleToggle('emailUpdates')} 
                />
              </div>
            </div>
          </div>

          {/* Cloud & Sync Section */}
          <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} className="rounded-lg shadow-sm p-6">
            <h2 className="font-canva-sans text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Cloud & Sync
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base" style={{ color: 'var(--muted-foreground)' }}>Auto Sync</span>
                <ToggleSwitch 
                  enabled={settings.autoSync} 
                  onToggle={() => handleToggle('autoSync')} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base" style={{ color: 'var(--muted-foreground)' }}>WiFi Only</span>
                <ToggleSwitch 
                  enabled={settings.wifiOnly} 
                  onToggle={() => handleToggle('wifiOnly')} 
                />
              </div>
            </div>
          </div>

          {/* Listening Preferences Section */}
          <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} className="rounded-lg shadow-sm p-6">
            <h2 className="font-canva-sans text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Listening Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base" style={{ color: 'var(--muted-foreground)' }}>Wake Word Detection</span>
                <ToggleSwitch 
                  enabled={settings.wakeWord} 
                  onToggle={() => handleToggle('wakeWord')} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base" style={{ color: 'var(--muted-foreground)' }}>Background Listening</span>
                <ToggleSwitch 
                  enabled={settings.backgroundListening} 
                  onToggle={() => handleToggle('backgroundListening')} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base" style={{ color: 'var(--muted-foreground)' }}>Voice Sensitivity</span>
                <select
                  value={settings.voiceSensitivity}
                  onChange={(e) => handleSelectChange('voiceSensitivity', e.target.value)}
                  className="font-canva-sans text-base rounded-lg px-3 py-1"
                  style={{ 
                    color: 'var(--foreground)', 
                    backgroundColor: 'var(--input)', 
                    border: '1px solid var(--border)' 
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Voice Navigation Section */}
          <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} className="rounded-lg shadow-sm p-6">
            <h2 className="font-canva-sans text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Voice Navigation
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base" style={{ color: 'var(--muted-foreground)' }}>Voice Commands</span>
                <ToggleSwitch 
                  enabled={settings.voiceCommands} 
                  onToggle={() => handleToggle('voiceCommands')} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base" style={{ color: 'var(--muted-foreground)' }}>Quick Actions</span>
                <ToggleSwitch 
                  enabled={settings.quickActions} 
                  onToggle={() => handleToggle('quickActions')} 
                />
              </div>
            </div>
          </div>

          {/* Voice Settings Section */}
          <VoiceSettings />

          {/* Theme Settings Section */}
          <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} className="rounded-lg shadow-sm p-6">
            <h2 className="font-canva-sans text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Appearance
            </h2>
            <div className="flex justify-between items-center">
              <span className="font-canva-sans text-base" style={{ color: 'var(--muted-foreground)' }}>Dark Theme</span>
              <ThemeToggle />
            </div>
          </div>

          {/* Premium AI & Ask Echo Section */}
          <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} className="rounded-lg shadow-sm p-6">
            <h2 className="font-canva-sans text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Premium AI & Ask Echo
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base" style={{ color: 'var(--muted-foreground)' }}>AI Responses</span>
                <ToggleSwitch 
                  enabled={settings.aiResponses} 
                  onToggle={() => handleToggle('aiResponses')} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base" style={{ color: 'var(--muted-foreground)' }}>Smart Suggestions</span>
                <ToggleSwitch 
                  enabled={settings.smartSuggestions} 
                  onToggle={() => handleToggle('smartSuggestions')} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-canva-sans text-base" style={{ color: 'var(--muted-foreground)' }}>Advanced Analytics</span>
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
