'use client';

import React, { useState } from 'react';

export default function PhotoJournal() {
  const [photos] = useState([
    {
      id: 1,
      src: '/api/placeholder/200/200',
      title: 'Morning Coffee',
      date: '2025-07-22',
      caption: 'Perfect start to the day'
    },
    {
      id: 2,
      src: '/api/placeholder/200/200',
      title: 'Sunset View',
      date: '2025-07-21',
      caption: 'Beautiful evening colors'
    },
    {
      id: 3,
      src: '/api/placeholder/200/200',
      title: 'Project Work',
      date: '2025-07-21',
      caption: 'Making progress on the design'
    },
    {
      id: 4,
      src: '/api/placeholder/200/200',
      title: 'Weekend Walk',
      date: '2025-07-20',
      caption: 'Exploring the neighborhood'
    }
  ]);

  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = () => {
    setIsCapturing(true);
    console.log('Capturing photo...');
    setTimeout(() => {
      setIsCapturing(false);
      console.log('Photo captured! Say a title for this photo.');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[864px] mx-auto">
      {/* Header */}
      <header className="pt-16 pb-8">
        <h1 className="font-league-spartan text-4xl font-bold text-center text-gray-900">
          Photo Journal
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8">
        {/* Photo Gallery - 2 Column Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-gray-100 aspect-square rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              {/* Placeholder for photo */}
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-sm"></div>
                  </div>
                  <p className="font-canva-sans text-sm font-medium text-gray-700">
                    {photo.title}
                  </p>
                  <p className="font-canva-sans text-xs text-gray-500">
                    {photo.date}
                  </p>
                </div>
                
                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                  <p className="font-canva-sans text-xs">
                    {photo.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Voice Caption Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="font-canva-sans text-base text-blue-800 text-center">
            💡 Say a title after the photo is taken
          </p>
        </div>
      </main>

      {/* Capture Button - Fixed at bottom center */}
      <footer className="p-8 flex justify-center">
        <button
          onClick={handleCapture}
          disabled={isCapturing}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            isCapturing
              ? 'bg-red-500 scale-110 animate-pulse cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
          }`}
        >
          <div className={`w-12 h-12 rounded-full ${
            isCapturing ? 'bg-white animate-pulse' : 'bg-white'
          }`}>
            <div className={`w-full h-full rounded-full flex items-center justify-center ${
              isCapturing ? 'bg-red-500' : 'bg-blue-500'
            }`}>
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
          </div>
        </button>
      </footer>
    </div>
  );
}
