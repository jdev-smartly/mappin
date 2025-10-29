// Map page component
import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { useGeocoding } from '@/hooks';
import { Pin } from '@/types';
// Removed AnimatedPinMarker import
import { AnimatedPinListItem } from '@/components/AnimatedPinListItem';
import { LoadingShimmer } from '@/components/LoadingShimmer';
import { ThemeToggle } from '@/components/ThemeToggle';
import 'leaflet/dist/leaflet.css';
import mapPinSvg from '@/assets/images/MapPin.svg?raw';

// Create Leaflet icon from MapPin.svg (sanitize filters/clip-paths for data URL safety)
const createPinIcon = () => {
  const sanitizeSvg = (raw: string) => {
    return raw
      .replace(/<defs[\s\S]*?<\/defs>/g, '')
      .replace(/\sfilter="url\([^)]*\)"/g, '')
      .replace(/\sclip-path="url\([^)]*\)"/g, '');
  };

  const cleanedSvg = sanitizeSvg(mapPinSvg);
  const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(cleanedSvg)}`;

  return new Icon({
    iconUrl: svgDataUrl,
    iconSize: [30, 44],
    iconAnchor: [15, 44],
    popupAnchor: [0, -44],
  });
};

interface MapEventsProps {
  onMapClick: (lat: number, lng: number) => void;
}

const MapEvents: React.FC<MapEventsProps> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
};

// Empty state component for when no pins exist
const EmptyState: React.FC<{ title?: string; description?: string }> = ({ 
  title = "No Result Found", 
  description = "Your map pin list will show in here." 
}) => {
  return (
    <motion.div 
      className="w-full h-auto flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Magnifying glass icon */}
      <motion.div 
        className="mb-5"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z" fill="#89898A"/>
        </svg>
      </motion.div>
      
      {/* Title */}
      <motion.h3 
        className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2" 
        style={{ height: '22px' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {title}
      </motion.h3>
      
      {/* Description */}
      <motion.p 
        className="text-sm text-gray-500 dark:text-gray-400 text-center" 
        style={{ height: '17px' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

// Component to access map instance and calculate tooltip position
const MapTooltipController: React.FC<{ 
  hoveredPin: Pin | null; 
  onPositionUpdate: (position: { x: number; y: number } | null) => void;
}> = ({ hoveredPin, onPositionUpdate }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (hoveredPin && map) {
      const point = map.latLngToContainerPoint([hoveredPin.latitude, hoveredPin.longitude]);
      const mapContainer = map.getContainer();
      const mapRect = mapContainer.getBoundingClientRect();
      
      // Tooltip dimensions
      const tooltipWidth = 186;
      const tooltipHeight = 66;
      const pinSize = 44; // Height of the pin icon
      
      // Calculate base position (above the pin)
      let x = mapRect.left + point.x - (tooltipWidth / 2);
      let y = mapRect.top + point.y - tooltipHeight - pinSize - 10; // 10px gap
      
      // Screen boundaries
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Adjust horizontal position if tooltip goes off-screen
      if (x < 10) {
        x = 10; // Keep 10px margin from left edge
      } else if (x + tooltipWidth > screenWidth - 10) {
        x = screenWidth - tooltipWidth - 10; // Keep 10px margin from right edge
      }
      
      // Adjust vertical position if tooltip goes off-screen
      if (y < 10) {
        // If not enough space above, place below the pin
        y = mapRect.top + point.y + pinSize + 10;
        
        // If still off-screen below, place to the side
        if (y + tooltipHeight > screenHeight - 10) {
          // Place to the right of the pin
          x = mapRect.left + point.x + pinSize + 10;
          y = mapRect.top + point.y - (tooltipHeight / 2);
          
          // Adjust if goes off right edge
          if (x + tooltipWidth > screenWidth - 10) {
            // Place to the left of the pin
            x = mapRect.left + point.x - tooltipWidth - pinSize - 10;
          }
        }
      }
      
      onPositionUpdate({ x, y });
    } else {
      onPositionUpdate(null);
    }
  }, [hoveredPin, map, onPositionUpdate]);
  
  return null;
};

// Tooltip component for showing pin details on hover
const PinTooltip: React.FC<{ pin: Pin; position: { x: number; y: number } }> = ({ pin, position }) => {
  return (
    <motion.div
      className="absolute z-50 flex flex-col items-start p-2 gap-1 w-[186px] h-[66px] bg-white dark:bg-gray-800 rounded-lg shadow-md"
      style={{
        left: position.x,
        top: position.y,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1)',
      }}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.15 }}
    >
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate w-full">
        {pin.address || 'Loading address...'}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-full">
        {pin.address === 'Loading address...' ? (
          <LoadingShimmer width="120px" height="12px" />
        ) : (
          `${pin.latitude.toFixed(4)}, ${pin.longitude.toFixed(4)}`
        )}
      </p>
    </motion.div>
  );
};

export const MapPage: React.FC = () => {
  const {
    map,
    addPin,
    removePin,
    updatePin,
    selectPin,
    clearAllPins,
    logout,
  } = useAppStore();
  
  const pins = map.pins;

  const { reverseGeocode } = useGeocoding();
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [hoveredPin, setHoveredPin] = useState<Pin | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [newPinId, setNewPinId] = useState<string | null>(null);

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    if (isAddingPin) return;
    
    setIsAddingPin(true);
    
    try {
      // Generate ID beforehand
      const pinId = Date.now().toString();
      setNewPinId(pinId);
      
      // Add pin immediately with coordinates
      const pinData = {
        latitude: lat,
        longitude: lng,
        address: 'Loading address...',
      };
      
      const returnedId = addPin(pinData, pinId);

      // Get address in background and update pin
      try {
        const address = await reverseGeocode(lat, lng);
        updatePin(returnedId, { address: address || 'Address not found' });
      } catch (geocodeError) {
        console.error('Geocoding failed:', geocodeError);
        updatePin(returnedId, { address: 'Address not found' });
      }
      
    } catch (error) {
      console.error('Error adding pin:', error);
    } finally {
      setIsAddingPin(false);
      // Clear new pin flag after animation completes
      setTimeout(() => setNewPinId(null), 300);
    }
  }, [addPin, updatePin, isAddingPin, reverseGeocode]);

  const handleRemovePin = useCallback((pinId: string) => {
    // Clear hovered pin if it's the one being removed
    if (hoveredPin && hoveredPin.id === pinId) {
      setHoveredPin(null);
    }
    removePin(pinId);
  }, [removePin, hoveredPin]);

  const handleTooltipPositionUpdate = useCallback((position: { x: number; y: number } | null) => {
    setTooltipPosition(position);
  }, []);

  // Handle pin drag end
  const handlePinDragEnd = useCallback(async (pinId: string, e: any) => {
    const { lat, lng } = e.target.getLatLng();
    
    // Update pin coordinates immediately
    updatePin(pinId, { 
      latitude: lat, 
      longitude: lng, 
      address: 'Updating address...' 
    });

    // Reverse geocode the new location
    try {
      const address = await reverseGeocode(lat, lng);
      updatePin(pinId, { address: address || 'Address not found' });
    } catch (error) {
      console.error('Geocoding failed for dragged pin:', error);
      updatePin(pinId, { address: 'Address not found' });
    }
  }, [updatePin, reverseGeocode]);

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Full Screen Map */}
      <div className="absolute inset-0 z-0" style={{ width: '100vw', height: '100vh' }}>
        <MapContainer
          center={[map.center[0], map.center[1]]}
          zoom={map.zoom}
          className="h-full w-full"
          zoomControl={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapEvents onMapClick={handleMapClick} />
          <MapTooltipController 
            hoveredPin={hoveredPin} 
            onPositionUpdate={handleTooltipPositionUpdate} 
          />
          
          {pins.map((pin: Pin) => (
            <Marker
              key={pin.id}
              position={[pin.latitude, pin.longitude]}
              icon={createPinIcon()}
              draggable={true}
              eventHandlers={{
                click: () => selectPin(pin),
                dragend: (e) => handlePinDragEnd(pin.id, e),
              }}
            >
              <Popup>
                <div className="p-2">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {pin.address || 'Loading address...'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {pin.latitude.toFixed(4)}, {pin.longitude.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

        {/* Top Header Bar */}
        <motion.div 
          className="absolute top-0 left-0 right-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 flex items-center justify-between py-3 px-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 5L9 2L15 5L21.303 2.2987C21.5569 2.18992 21.8508 2.30749 21.9596 2.56131C21.9862 2.62355 22 2.69056 22 2.75827V19L15 22L9 19L2.69696 21.7013C2.44314 21.8101 2.14921 21.6925 2.04043 21.4387C2.01375 21.3765 2 21.3094 2 21.2417V5ZM16 19.3955L20 17.6812V5.03308L16 6.74736V19.3955ZM14 19.2639V6.73607L10 4.73607V17.2639L14 19.2639ZM8 17.2526V4.60451L4 6.31879V18.9669L8 17.2526Z" fill="currentColor" className="text-gray-900 dark:text-gray-100"/>
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Map Pinboard</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
              </svg>
              Logout
            </motion.button>
          </div>
        </motion.div>

      {/* Left Sidebar Overlay */}
      <motion.div 
        className="absolute top-24 left-6 bottom-6 z-20 w-80"
        initial={{ x: -320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
            <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg">
            <div className="h-15 border-b border-gray-300 dark:border-gray-600 pt-5 pb-3 px-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Pin Lists ({pins.length})
                </h3>
                {pins.length > 0 && (
                  <motion.button
                    onClick={clearAllPins}
                    className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Clear all pins"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    Clear All
                  </motion.button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {pins.length === 0 ? (
                <EmptyState 
                  title="No Result Found"
                  description="Your map pin list will show in here."
                />
              ) : (
                <>
                  {pins.map((pin: Pin, index: number) => (
                    <AnimatedPinListItem
                      key={pin.id}
                      pin={pin}
                      index={index}
                      onRemove={handleRemovePin}
                      onMouseEnter={setHoveredPin}
                      onMouseLeave={() => setHoveredPin(null)}
                      isNewPin={pin.id === newPinId}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredPin && tooltipPosition && (
          <PinTooltip 
            pin={hoveredPin} 
            position={tooltipPosition} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};