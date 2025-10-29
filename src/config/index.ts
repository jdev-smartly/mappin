// Application configuration
export const APP_CONFIG = {
  map: {
    defaultCenter: [51.505, -0.09] as [number, number], // London coordinates
    defaultZoom: 13,
    maxZoom: 18,
    minZoom: 2,
  },
  geocoding: {
    baseUrl: 'https://nominatim.openstreetmap.org/reverse',
    timeout: 5000,
  },
  storage: {
    pinsKey: 'wobi:pins',
    userKey: 'wobi:user',
  },
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
  },
} as const;

// API endpoints
export const API_ENDPOINTS = {
  geocoding: 'https://nominatim.openstreetmap.org/reverse',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  pins: 'wobi:pins',
  user: 'wobi:user',
  settings: 'wobi:settings',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  geocodingFailed: 'Failed to get address for this location',
  pinCreationFailed: 'Failed to create pin',
  pinDeletionFailed: 'Failed to delete pin',
  networkError: 'Network error. Please check your connection.',
  unknownError: 'An unknown error occurred',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  pinCreated: 'Pin created successfully',
  pinDeleted: 'Pin deleted successfully',
  pinUpdated: 'Pin updated successfully',
} as const;
