export interface CarPin {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  geofenceRadius: number; // in meters
  isActive: boolean;
  createdAt: number;
}

export interface GeofenceEvent {
  type: 'enter' | 'exit';
  timestamp: number;
  distance: number;
}
