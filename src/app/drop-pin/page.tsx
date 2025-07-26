'use client';

import React, { useState, useEffect } from 'react';
import { CarPin } from '../../types/CarPin';
import { carPinStorage } from '../../utils/carPinStorage';

export default function DropPin() {
  const [note, setNote] = useState('');
  const [pinDropped, setPinDropped] = useState(false);
  const [carPin, setCarPin] = useState<CarPin | null>(null);
  const [currentDistance, setCurrentDistance] = useState<number | null>(null);

  useEffect(() => {
    const activeCarPin = carPinStorage.getCarPin();
    setCarPin(activeCarPin);

    if (activeCarPin && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const distance = carPinStorage.calculateDistance(
            activeCarPin.latitude,
            activeCarPin.longitude,
            position.coords.latitude,
            position.coords.longitude
          );
          setCurrentDistance(distance);
        },
        (error) => console.error('Failed to get current location:', error)
      );
    }
  }, []);

  const handleDropPin = () => {
    setPinDropped(true);
    console.log('Pin dropped with note:', note);
    setTimeout(() => setPinDropped(false), 2000);
  };

  const handleRemoveCarPin = () => {
    carPinStorage.removeCarPin();
    setCarPin(null);
    setCurrentDistance(null);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-[864px] mx-auto" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="pt-16 pb-8">
        <h1 className="font-league-spartan text-4xl font-bold text-left" style={{ color: 'var(--foreground)' }}>
          LIFE ECHOS
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-8">
        {/* Map View - 70% of screen */}
        <div className="bg-gray-200 rounded-lg mb-8 flex-1 min-h-[400px] flex items-center justify-center relative overflow-hidden">
          {/* Simulated Map */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
            <div className="absolute top-1/4 left-1/3 w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: '#ef4444' }}></div>
            <div className="absolute top-1/2 right-1/4 w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: 'var(--primary-blue)' }}></div>
            <div className="absolute bottom-1/3 left-1/2 w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: '#22c55e' }}></div>
          </div>
          
          {/* Current Location Indicator */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-4 border-white shadow-lg animate-pulse" style={{ backgroundColor: 'var(--primary-blue)' }}></div>
            <p className="font-canva-sans text-sm mt-2 px-3 py-1 rounded-full shadow-sm" style={{ backgroundColor: 'var(--card)', color: 'var(--muted-foreground)' }}>
              Current Location
            </p>
          </div>
          
          {pinDropped && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
              <div className="rounded-lg p-6 shadow-xl" style={{ backgroundColor: 'var(--card)' }}>
                <p className="font-canva-sans text-lg text-green-600 font-medium">
                  📍 Pin Dropped Successfully!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Optional Note Field */}
        <div className="mb-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add an optional note for this location..."
            className="w-[80%] px-4 py-3 rounded-lg border border-gray-300 font-canva-sans text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Car Pin Status */}
        {carPin && (
          <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-canva-sans text-lg font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              🚗 Active Car Pin
            </h3>
            <p className="font-canva-sans text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
              Dropped: {new Date(carPin.createdAt).toLocaleString()}
            </p>
            <p className="font-canva-sans text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
              Geofence: {Math.round(carPin.geofenceRadius * 3.28084)} feet
            </p>
            {currentDistance !== null && (
              <p className="font-canva-sans text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
                Current distance: {Math.round(currentDistance * 3.28084)} feet
              </p>
            )}
            <button
              onClick={handleRemoveCarPin}
              className="px-4 py-2 rounded-lg font-canva-sans text-sm font-medium text-white transition-colors duration-200"
              style={{ backgroundColor: '#ef4444' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            >
              Remove Car Pin
            </button>
          </div>
        )}

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={handleDropPin}
            disabled={pinDropped}
            className="w-full py-4 px-6 rounded-lg font-canva-sans text-xl font-medium transition-all duration-200 text-white cursor-pointer"
            style={{
              backgroundColor: pinDropped ? '#22c55e' : 'var(--primary-blue)',
              cursor: pinDropped ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => !pinDropped && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseLeave={(e) => !pinDropped && (e.currentTarget.style.backgroundColor = 'var(--primary-blue)')}
          >
            {pinDropped ? '📍 Pin Dropped!' : 'Drop Pin Here'}
          </button>
        </div>
      </main>
    </div>
  );
}
