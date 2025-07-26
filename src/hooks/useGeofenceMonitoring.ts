'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CarPin, GeofenceEvent } from '../types/CarPin';
import { carPinStorage } from '../utils/carPinStorage';
import { voiceResponseService } from '../utils/voiceResponseService';

interface GeofenceMonitoringOptions {
  onCarPinReturn?: () => void;
  voiceResponseEnabled?: boolean;
}

export const useGeofenceMonitoring = (options: GeofenceMonitoringOptions = {}) => {
  const { onCarPinReturn, voiceResponseEnabled = true } = options;
  
  const [carPin, setCarPin] = useState<CarPin | null>(null);
  const [currentDistance, setCurrentDistance] = useState<number | null>(null);
  const [isWithinGeofence, setIsWithinGeofence] = useState<boolean>(false);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  
  const watchIdRef = useRef<number | null>(null);
  const wasWithinGeofenceRef = useRef<boolean>(false);

  const startMonitoring = useCallback(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }

    const activeCarPin = carPinStorage.getCarPin();
    if (!activeCarPin) {
      console.log('No active car pin found');
      return;
    }

    setCarPin(activeCarPin);
    setIsMonitoring(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const distance = carPinStorage.calculateDistance(
          activeCarPin.latitude,
          activeCarPin.longitude,
          latitude,
          longitude
        );

        setCurrentDistance(distance);
        const withinGeofence = distance <= activeCarPin.geofenceRadius;
        setIsWithinGeofence(withinGeofence);

        if (!wasWithinGeofenceRef.current && withinGeofence) {
          carPinStorage.logGeofenceEvent({
            type: 'enter',
            timestamp: Date.now(),
            distance
          });

          if (voiceResponseEnabled) {
            const responses = [
              'Welcome back to your car.',
              "You're back at your parked location."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            voiceResponseService.speak(randomResponse);
          }

          carPinStorage.removeCarPin();
          setCarPin(null);
          setIsMonitoring(false);
          onCarPinReturn?.();

          if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
          }
        } else if (wasWithinGeofenceRef.current && !withinGeofence) {
          carPinStorage.logGeofenceEvent({
            type: 'exit',
            timestamp: Date.now(),
            distance
          });
        }

        wasWithinGeofenceRef.current = withinGeofence;
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  }, [onCarPinReturn, voiceResponseEnabled]);

  const stopMonitoring = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsMonitoring(false);
  }, []);

  useEffect(() => {
    const activeCarPin = carPinStorage.getCarPin();
    if (activeCarPin) {
      startMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [startMonitoring, stopMonitoring]);

  return {
    carPin,
    currentDistance,
    isWithinGeofence,
    isMonitoring,
    startMonitoring,
    stopMonitoring
  };
};
