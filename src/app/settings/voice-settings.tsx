'use client';

import React, { useState, useEffect } from 'react';

export default function VoiceSettings() {
  const [customTriggerWord, setCustomTriggerWord] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('customTriggerWord');
    if (saved) {
      setCustomTriggerWord(saved);
    }
  }, []);

  const handleSaveTriggerWord = () => {
    if (customTriggerWord.trim()) {
      localStorage.setItem('customTriggerWord', customTriggerWord.trim().toLowerCase());
      alert('Custom trigger word saved!');
    }
  };

  const handleResetTriggerWord = () => {
    localStorage.removeItem('customTriggerWord');
    setCustomTriggerWord('');
    alert('Reset to default "echo" trigger word');
  };

  return (
    <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} className="rounded-lg shadow-sm p-6">
      <h2 className="font-canva-sans text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
        Custom Trigger Word
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block font-canva-sans text-base mb-2" style={{ color: 'var(--muted-foreground)' }}>
            Your Custom Wake Word (default: &quot;echo&quot;)
          </label>
          <input
            type="text"
            value={customTriggerWord}
            onChange={(e) => setCustomTriggerWord(e.target.value)}
            placeholder="Enter custom trigger word"
            className="w-full px-3 py-2 rounded-lg font-canva-sans text-base focus:outline-none focus:ring-2 focus:ring-ring"
            style={{ 
              backgroundColor: 'var(--input)', 
              border: '1px solid var(--border)',
              color: 'var(--foreground)'
            }}
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSaveTriggerWord}
            className="font-canva-sans text-base px-4 py-2 rounded-lg transition-colors duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: 'var(--primary-blue)', 
              color: 'var(--primary-foreground)' 
            }}
          >
            Save
          </button>
          <button
            onClick={handleResetTriggerWord}
            className="font-canva-sans text-base px-4 py-2 rounded-lg transition-colors duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: 'var(--muted)', 
              color: 'var(--muted-foreground)' 
            }}
          >
            Reset to Default
          </button>
        </div>
        <p className="font-canva-sans text-sm text-gray-600">
          Your custom trigger word will activate voice recording across all pages. Choose something unique and easy to say.
        </p>
      </div>
    </div>
  );
}
