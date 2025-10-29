// React Context store for global state management
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Pin, User, MapState, AuthState } from '@/types';
import { generateId } from '@/utils';

interface AppState {
  // Map state
  map: MapState;
  
  // Auth state
  auth: AuthState;
  
  // Actions
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  addPin: (pin: Omit<Pin, 'id' | 'createdAt' | 'updatedAt'>, customId?: string) => string;
  removePin: (id: string) => void;
  updatePin: (id: string, updates: Partial<Pin>) => void;
  selectPin: (pin: Pin | null) => void;
  setMapLoading: (loading: boolean) => void;
  setMapError: (error: string | null) => void;
  
  // Auth actions
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>;
  logout: () => void;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Map state
  const [map, setMap] = useState<MapState>({
    center: [51.505, -0.09],
    zoom: 13,
    pins: [],
    selectedPin: null,
    isLoading: false,
    error: null,
  });
  
  // Auth state
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  // Map actions
  const setMapCenter = useCallback((center: [number, number]) => {
    setMap(prev => ({ ...prev, center }));
  }, []);

  const setMapZoom = useCallback((zoom: number) => {
    setMap(prev => ({ ...prev, zoom }));
  }, []);

  const addPin = useCallback((pinData: Omit<Pin, 'id' | 'createdAt' | 'updatedAt'>, customId?: string) => {
    const pinId = customId || generateId();
    const newPin: Pin = {
      ...pinData,
      id: pinId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setMap(prev => ({
      ...prev,
      pins: [...prev.pins, newPin],
    }));
    
    return pinId;
  }, []);

  const removePin = useCallback((id: string) => {
    setMap(prev => ({
      ...prev,
      pins: prev.pins.filter((pin) => pin.id !== id),
      selectedPin: prev.selectedPin?.id === id ? null : prev.selectedPin,
    }));
  }, []);

  const updatePin = useCallback((id: string, updates: Partial<Pin>) => {
    setMap(prev => ({
      ...prev,
      pins: prev.pins.map((pin) =>
        pin.id === id
          ? { ...pin, ...updates, updatedAt: new Date().toISOString() }
          : pin
      ),
    }));
  }, []);

  const selectPin = useCallback((pin: Pin | null) => {
    setMap(prev => ({ ...prev, selectedPin: pin }));
  }, []);

  const setMapLoading = useCallback((isLoading: boolean) => {
    setMap(prev => ({ ...prev, isLoading }));
  }, []);

  const setMapError = useCallback((error: string | null) => {
    setMap(prev => ({ ...prev, error }));
  }, []);

  // Auth actions
  const login = useCallback(async (email: string, password: string) => {
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check credentials
      if (email === 'test@gmail.com' && password === 'password123') {
        const user: User = {
          id: generateId(),
          email,
          name: email.split('@')[0],
        };
        
        setAuth(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }));
        
        return { success: true, user };
      } else {
        // Invalid credentials - don't update auth state to prevent remounting
        return { success: false };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      setAuth(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      return { success: false };
    }
  }, []);

  const logout = useCallback(() => {
    setAuth(prev => ({
      ...prev,
      user: null,
      isAuthenticated: false,
      error: null,
    }));
  }, []);

  const setAuthLoading = useCallback((isLoading: boolean) => {
    setAuth(prev => ({ ...prev, isLoading }));
  }, []);

  const setAuthError = useCallback((error: string | null) => {
    setAuth(prev => ({ ...prev, error }));
  }, []);

  const value: AppState = {
    map,
    auth,
    setMapCenter,
    setMapZoom,
    addPin,
    removePin,
    updatePin,
    selectPin,
    setMapLoading,
    setMapError,
    login,
    logout,
    setAuthLoading,
    setAuthError,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = (): AppState => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
