// Type definitions for the application
export interface Pin {
  id: string;
  latitude: number;
  longitude: number;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface MapState {
  center: [number, number];
  zoom: number;
  pins: Pin[];
  selectedPin: Pin | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface GeocodingResponse {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    house_number?: string;
    road?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export type Viewport = 'desktop' | 'mobile-landscape' | 'mobile-portrait';

export interface AppConfig {
  map: {
    defaultCenter: [number, number];
    defaultZoom: number;
    maxZoom: number;
    minZoom: number;
  };
  geocoding: {
    baseUrl: string;
    timeout: number;
  };
  storage: {
    pinsKey: string;
    userKey: string;
  };
}
