// Zustand store for global state management
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
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
  addPin: (pin: Omit<Pin, 'id' | 'createdAt' | 'updatedAt'>) => void;
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

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, _get) => ({
        // Initial state
        map: {
          center: [51.505, -0.09],
          zoom: 13,
          pins: [],
          selectedPin: null,
          isLoading: false,
          error: null,
        },
        
        auth: {
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        },
        
        // Map actions
        setMapCenter: (center) =>
          set(
            (state) => ({
              map: { ...state.map, center },
            }),
            false,
            'setMapCenter'
          ),
        
        setMapZoom: (zoom) =>
          set(
            (state) => ({
              map: { ...state.map, zoom },
            }),
            false,
            'setMapZoom'
          ),
        
        addPin: (pinData) =>
          set(
            (state) => {
              const newPin: Pin = {
                ...pinData,
                id: generateId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              
              return {
                map: {
                  ...state.map,
                  pins: [...state.map.pins, newPin],
                },
              };
            },
            false,
            'addPin'
          ),
        
        removePin: (id) =>
          set(
            (state) => ({
              map: {
                ...state.map,
                pins: state.map.pins.filter((pin) => pin.id !== id),
                selectedPin: state.map.selectedPin?.id === id ? null : state.map.selectedPin,
              },
            }),
            false,
            'removePin'
          ),
        
        updatePin: (id, updates) =>
          set(
            (state) => ({
              map: {
                ...state.map,
                pins: state.map.pins.map((pin) =>
                  pin.id === id
                    ? { ...pin, ...updates, updatedAt: new Date() }
                    : pin
                ),
              },
            }),
            false,
            'updatePin'
          ),
        
        selectPin: (pin) =>
          set(
            (state) => ({
              map: { ...state.map, selectedPin: pin },
            }),
            false,
            'selectPin'
          ),
        
        setMapLoading: (isLoading) =>
          set(
            (state) => ({
              map: { ...state.map, isLoading },
            }),
            false,
            'setMapLoading'
          ),
        
        setMapError: (error) =>
          set(
            (state) => ({
              map: { ...state.map, error },
            }),
            false,
            'setMapError'
          ),
        
        // Auth actions
        login: async (email, _password) => {
          set(
            (state) => ({
              auth: { ...state.auth, isLoading: true, error: null },
            }),
            false,
            'login/start'
          );
          
          try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            // For demo purposes, accept any email/password
            const user: User = {
              id: generateId(),
              email,
              name: email.split('@')[0],
            };
            
            set(
              (state) => ({
                auth: {
                  ...state.auth,
                  user,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                },
              }),
              false,
              'login/success'
            );
            
            return { success: true, user };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            
            set(
              (state) => ({
                auth: {
                  ...state.auth,
                  isLoading: false,
                  error: errorMessage,
                },
              }),
              false,
              'login/error'
            );
            
            return { success: false };
          }
        },
        
        logout: () =>
          set(
            (state) => ({
              auth: {
                ...state.auth,
                user: null,
                isAuthenticated: false,
                error: null,
              },
            }),
            false,
            'logout'
          ),
        
        setAuthLoading: (isLoading) =>
          set(
            (state) => ({
              auth: { ...state.auth, isLoading },
            }),
            false,
            'setAuthLoading'
          ),
        
        setAuthError: (error) =>
          set(
            (state) => ({
              auth: { ...state.auth, error },
            }),
            false,
            'setAuthError'
          ),
      }),
      {
        name: 'map-pin-board-storage',
        partialize: (state) => ({
          map: {
            pins: state.map.pins,
            center: state.map.center,
            zoom: state.map.zoom,
          },
          auth: {
            user: state.auth.user,
            isAuthenticated: state.auth.isAuthenticated,
          },
        }),
      }
    ),
    {
      name: 'map-pin-board-store',
    }
  )
);
