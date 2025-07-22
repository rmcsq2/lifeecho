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
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="font-canva-sans text-xl font-bold text-gray-900 mb-4">
        Custom Trigger Word
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block font-canva-sans text-base text-gray-700 mb-2">
            Your Custom Wake Word (default: "echo")
          </label>
          <input
            type="text"
            value={customTriggerWord}
            onChange={(e) => setCustomTriggerWord(e.target.value)}
            placeholder="Enter custom trigger word"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-canva-sans text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSaveTriggerWord}
            className="bg-blue-500 hover:bg-blue-600 text-white font-canva-sans text-base px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Save
          </button>
          <button
            onClick={handleResetTriggerWord}
            className="bg-gray-500 hover:bg-gray-600 text-white font-canva-sans text-base px-4 py-2 rounded-lg transition-colors duration-200"
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
