import { CarPin, GeofenceEvent } from '../types/CarPin';

const CAR_PIN_STORAGE_KEY = 'lifeecho-car-pin';
const GEOFENCE_EVENTS_KEY = 'lifeecho-geofence-events';

export const carPinStorage = {
  saveCarPin: async (geofenceRadius: number = 3.048): Promise<CarPin | null> => {
    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported');
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 0
        });
      });

      carPinStorage.removeCarPin();

      const carPin: CarPin = {
        id: `car-pin-${Date.now()}`,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: Date.now(),
        geofenceRadius,
        isActive: true,
        createdAt: Date.now()
      };

      localStorage.setItem(CAR_PIN_STORAGE_KEY, JSON.stringify(carPin));
      return carPin;
    } catch (error) {
      console.error('Failed to get location for car pin:', error);
      return null;
    }
  },

  getCarPin: (): CarPin | null => {
    try {
      const stored = localStorage.getItem(CAR_PIN_STORAGE_KEY);
      if (!stored) return null;
      
      const carPin = JSON.parse(stored) as CarPin;
      return carPin.isActive ? carPin : null;
    } catch (error) {
      console.error('Failed to load car pin:', error);
      return null;
    }
  },

  removeCarPin: (): void => {
    try {
      localStorage.removeItem(CAR_PIN_STORAGE_KEY);
      localStorage.removeItem(GEOFENCE_EVENTS_KEY);
    } catch (error) {
      console.error('Failed to remove car pin:', error);
    }
  },

  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  },

  isWithinGeofence: (carPin: CarPin, currentLat: number, currentLon: number): boolean => {
    const distance = carPinStorage.calculateDistance(
      carPin.latitude, carPin.longitude,
      currentLat, currentLon
    );
    return distance <= carPin.geofenceRadius;
  },

  logGeofenceEvent: (event: GeofenceEvent): void => {
    try {
      const events = carPinStorage.getGeofenceEvents();
      events.push(event);
      
      const recentEvents = events.slice(-10);
      localStorage.setItem(GEOFENCE_EVENTS_KEY, JSON.stringify(recentEvents));
    } catch (error) {
      console.error('Failed to log geofence event:', error);
    }
  },

  getGeofenceEvents: (): GeofenceEvent[] => {
    try {
      const stored = localStorage.getItem(GEOFENCE_EVENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load geofence events:', error);
      return [];
    }
  }
};
