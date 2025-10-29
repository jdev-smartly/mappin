// React Context store for global state management
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Pin, User, MapState, AuthState, ThemeState } from '@/types';
import { generateId } from '@/utils';

// localStorage keys for persisting data
const MAP_STORAGE_KEY = 'wobi:map';
const AUTH_STORAGE_KEY = 'wobi:auth';
const THEME_STORAGE_KEY = 'wobi:theme';

// Helper functions for localStorage
const saveMapToStorage = (map: MapState) => {
  try {
    const mapData = {
      center: map.center,
      zoom: map.zoom,
      pins: map.pins,
    };
    localStorage.setItem(MAP_STORAGE_KEY, JSON.stringify(mapData));
  } catch (error) {
    console.error('Failed to save map to localStorage:', error);
  }
};

const loadMapFromStorage = (): Partial<MapState> => {
  try {
    const stored = localStorage.getItem(MAP_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load map from localStorage:', error);
    return {};
  }
};

const saveAuthToStorage = (auth: AuthState) => {
  try {
    const authData = {
      user: auth.user,
      isAuthenticated: auth.isAuthenticated,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error('Failed to save auth to localStorage:', error);
  }
};

const loadAuthFromStorage = (): Partial<AuthState> => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load auth from localStorage:', error);
    return {};
  }
};

const saveThemeToStorage = (theme: ThemeState) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
  }
};

const loadThemeFromStorage = (): Partial<ThemeState> => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load theme from localStorage:', error);
    return {};
  }
};

interface AppState {
  // Map state
  map: MapState;
  
  // Auth state
  auth: AuthState;
  
  // Theme state
  theme: ThemeState;
  
  // Actions
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  addPin: (pin: Omit<Pin, 'id' | 'createdAt' | 'updatedAt'>, customId?: string) => string;
  removePin: (id: string) => void;
  updatePin: (id: string, updates: Partial<Pin>) => void;
  selectPin: (pin: Pin | null) => void;
  clearAllPins: () => void;
  setMapLoading: (loading: boolean) => void;
  setMapError: (error: string | null) => void;
  
  // Auth actions
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>;
  logout: () => void;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  
  // Theme actions
  toggleTheme: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Initialize map state from localStorage or defaults
  const [map, setMap] = useState<MapState>(() => {
    const storedMap = loadMapFromStorage();
    return {
      center: storedMap.center || [51.505, -0.09],
      zoom: storedMap.zoom || 13,
      pins: storedMap.pins || [],
      selectedPin: null,
      isLoading: false,
      error: null,
    };
  });
  
  // Auth state
  const [auth, setAuth] = useState<AuthState>(() => {
    const storedAuth = loadAuthFromStorage();
    return {
      user: storedAuth.user || null,
      isAuthenticated: storedAuth.isAuthenticated || false,
      isLoading: false,
      error: null,
    };
  });

  // Theme state
  const [theme, setTheme] = useState<ThemeState>(() => {
    const storedTheme = loadThemeFromStorage();
    return {
      isDark: storedTheme.isDark || false,
    };
  });

  // Save map state to localStorage whenever it changes
  useEffect(() => {
    saveMapToStorage(map);
  }, [map]);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    saveAuthToStorage(auth);
  }, [auth]);

  // Save theme state to localStorage whenever it changes
  useEffect(() => {
    saveThemeToStorage(theme);
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    if (theme.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme.isDark]);

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

  const clearAllPins = useCallback(() => {
    setMap(prev => ({ ...prev, pins: [], selectedPin: null }));
    // Also clear localStorage
    try {
      localStorage.removeItem(MAP_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
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
    // Clear auth from localStorage
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const setAuthLoading = useCallback((isLoading: boolean) => {
    setAuth(prev => ({ ...prev, isLoading }));
  }, []);

  const setAuthError = useCallback((error: string | null) => {
    setAuth(prev => ({ ...prev, error }));
  }, []);

  // Theme actions
  const toggleTheme = useCallback(() => {
    setTheme(prev => ({ ...prev, isDark: !prev.isDark }));
  }, []);

  const value: AppState = {
    map,
    auth,
    theme,
    setMapCenter,
    setMapZoom,
    addPin,
    removePin,
    updatePin,
    selectPin,
    clearAllPins,
    setMapLoading,
    setMapError,
    login,
    logout,
    setAuthLoading,
    setAuthError,
    toggleTheme,
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
