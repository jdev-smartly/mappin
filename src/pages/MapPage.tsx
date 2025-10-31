// Map page component
import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { DragEndEvent } from 'leaflet';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { geocodingService } from '@/services';
import { useViewport } from '@/hooks';
import { Pin } from '@/types';
import {
  MapEvents,
  MapTooltipController,
  PinTooltip,
  MapTopBar,
  PinSidebar,
  createPinIcon,
} from '@/components/map';
import 'leaflet/dist/leaflet.css';

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
  
  const selectedPin = map.selectedPin;
  const pins = map.pins;
  const viewport = useViewport();
  
  // Mobile portrait drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragStartOffset, setDragStartOffset] = useState(0);
  const [maxExpansion, setMaxExpansion] = useState(240);

  const baseHeight = pins.length > 0 ? 320 : 240;
  const topBarHeight = 46;
  const desiredGap = 24;
  const totalTopGap = topBarHeight + desiredGap;

  // Use geocoding service directly instead of hook
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [hoveredPin, setHoveredPin] = useState<Pin | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [newPinId, setNewPinId] = useState<string | null>(null);
  const [isSelectedFromList, setIsSelectedFromList] = useState(false);
  const pinIcon = React.useMemo(createPinIcon, []);

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    if (isAddingPin) return;
    
    // If a pin is selected from list, clear selection instead of adding new pin
    if (selectedPin && isSelectedFromList) {
      selectPin(null);
      setIsSelectedFromList(false);
      setHoveredPin(null);
      setTooltipPosition(null);
      return;
    }
    
    setIsAddingPin(true);
    setIsSelectedFromList(false); // Reset selection state when adding new pin
    
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
        const address = await geocodingService.reverseGeocode(lat, lng);
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
  }, [addPin, updatePin, isAddingPin, selectedPin, isSelectedFromList, selectPin]);

  const handleRemovePin = useCallback((pinId: string) => {
    // Always clear tooltip when deleting any pin
    setHoveredPin(null);
    setTooltipPosition(null);
    
    removePin(pinId);
    
  }, [removePin]);

  const handleTooltipPositionUpdate = useCallback((position: { x: number; y: number } | null) => {
    setTooltipPosition(position);
  }, []);

  const handlePinSelect = useCallback((pin: Pin) => {
    selectPin(pin);
    setIsSelectedFromList(true);
  }, [selectPin]);

  // Mobile portrait drag handlers - using global listeners for smooth dragging
  React.useEffect(() => {
    if (viewport !== 'mobile-portrait') {
      setMaxExpansion(240);
      return;
    }

    const updateExpansion = () => {
      const available = window.innerHeight - totalTopGap - baseHeight;
      setMaxExpansion(Math.max(0, available));
    };

    updateExpansion();
    window.addEventListener('resize', updateExpansion);

    return () => window.removeEventListener('resize', updateExpansion);
  }, [viewport, baseHeight, totalTopGap]);

  React.useEffect(() => {
    setDragOffset(prev => Math.max(-maxExpansion, Math.min(0, prev)));
  }, [maxExpansion]);

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMoveGlobal = (e: TouchEvent | MouseEvent) => {
      if (viewport !== 'mobile-portrait') return;
      if ('touches' in e && e.touches.length > 0) {
        e.preventDefault();
      }
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const deltaY = clientY - dragStartY;
      const rawOffset = dragStartOffset + deltaY;
      const newOffset = Math.max(Math.min(rawOffset, 0), -maxExpansion);
      setDragOffset(newOffset);
    };

    const handleEndGlobal = () => {
      setIsDragging(false);
      setDragOffset(prev => (prev < -80 ? -maxExpansion : 0));
    };

    window.addEventListener('touchmove', handleMoveGlobal, { passive: false });
    window.addEventListener('touchend', handleEndGlobal);
    window.addEventListener('mousemove', handleMoveGlobal);
    window.addEventListener('mouseup', handleEndGlobal);

    return () => {
      window.removeEventListener('touchmove', handleMoveGlobal);
      window.removeEventListener('touchend', handleEndGlobal);
      window.removeEventListener('mousemove', handleMoveGlobal);
      window.removeEventListener('mouseup', handleEndGlobal);
    };
  }, [isDragging, dragStartY, dragStartOffset, viewport, maxExpansion]);

  React.useEffect(() => {
    if (viewport !== 'mobile-portrait') {
      setIsDragging(false);
      setDragOffset(0);
    }
  }, [viewport]);

  const handleDragStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (viewport !== 'mobile-portrait') return;
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setDragStartY(clientY);
    setDragStartOffset(dragOffset);
  }, [viewport, dragOffset]);

  // Handle pin drag end
  const handlePinDragEnd = useCallback(async (pinId: string, event: DragEndEvent) => {
    const { lat, lng } = event.target.getLatLng();
    
    // Update pin coordinates immediately
    updatePin(pinId, { 
      latitude: lat, 
      longitude: lng, 
      address: 'Updating address...' 
    });

    // Reverse geocode the new location
    try {
      const address = await geocodingService.reverseGeocode(lat, lng);
      updatePin(pinId, { address: address || 'Address not found' });
    } catch (error) {
      console.error('Geocoding failed for dragged pin:', error);
      updatePin(pinId, { address: 'Address not found' });
    }
  }, [updatePin]);

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
              icon={pinIcon}
              draggable={true}
              opacity={(() => {
                const opacity = selectedPin && isSelectedFromList ? (selectedPin.id === pin.id ? 1 : 0.3) : 1;
                return opacity;
              })()}
              eventHandlers={{
                click: () => {
                  selectPin(pin);
                  setIsSelectedFromList(false);
                },
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
      <MapTopBar onLogout={logout} />

      {/* Left Sidebar Overlay */}
      <PinSidebar
        pins={pins}
        selectedPin={selectedPin}
        viewport={viewport}
        baseHeight={baseHeight}
        dragOffset={dragOffset}
        isDragging={isDragging}
        newPinId={newPinId}
        onDragStart={handleDragStart}
        onRemovePin={handleRemovePin}
        onMouseEnter={setHoveredPin}
        onMouseLeave={() => setHoveredPin(null)}
        onSelect={handlePinSelect}
        onClearAll={clearAllPins}
      />

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