// Custom hooks for the application
import { useState, useEffect, useCallback } from 'react';
import { Pin, GeocodingResponse, User } from '@/types';
import { APP_CONFIG, ERROR_MESSAGES } from '@/config';

/**
 * Hook for managing viewport type
 */
export function useViewport() {
  const [viewport, setViewport] = useState<'desktop' | 'mobile-landscape' | 'mobile-portrait'>('desktop');

  useEffect(() => {
    const updateViewport = () => {
      const { innerWidth, innerHeight } = window;
      
      if (innerWidth >= 1024) {
        setViewport('desktop');
      } else if (innerWidth > innerHeight) {
        setViewport('mobile-landscape');
      } else {
        setViewport('mobile-portrait');
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return viewport;
}

/**
 * Hook for geocoding coordinates to address
 */
export function useGeocoding() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${APP_CONFIG.geocoding.baseUrl}?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          method: 'GET',
          headers: {
            'User-Agent': 'MapPinBoard/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data: GeocodingResponse = await response.json();
      return data.display_name || 'Unknown location';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.geocodingFailed;
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { reverseGeocode, isLoading, error };
}

/**
 * Hook for managing local storage with automatic sync
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

/**
 * Hook for managing pins with persistence
 */
export function usePins() {
  const [pins, setPins] = useLocalStorage<Pin[]>('map-pin-board-pins', []);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  const addPin = useCallback((pin: Omit<Pin, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPin: Pin = {
      ...pin,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setPins(prev => [...prev, newPin]);
    return newPin;
  }, [setPins]);

  const removePin = useCallback((id: string) => {
    setPins(prev => prev.filter(pin => pin.id !== id));
    if (selectedPin?.id === id) {
      setSelectedPin(null);
    }
  }, [setPins, selectedPin]);

  const updatePin = useCallback((id: string, updates: Partial<Pin>) => {
    setPins(prev => prev.map(pin => 
      pin.id === id 
        ? { ...pin, ...updates, updatedAt: new Date().toISOString() }
        : pin
    ));
  }, [setPins]);

  return {
    pins,
    selectedPin,
    setSelectedPin,
    addPin,
    removePin,
    updatePin,
  };
}

/**
 * Hook for managing authentication state
 */
export function useAuth() {
  const [user, setUser] = useLocalStorage<User | null>('map-pin-board-user', null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any email/password
    const user = { id: '1', email, name: email.split('@')[0] };
    setUser(user);
    setIsLoading(false);
    
    return { success: true, user };
  }, [setUser]);

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
}
