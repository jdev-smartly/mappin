// Map page component
import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useAppStore } from '@/store';
import { useGeocoding } from '@/hooks';
import { Pin } from '@/types';
import { formatDate } from '@/utils';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Convert decimal degrees to DMS format
const toDMS = (decimal: number, isLatitude: boolean): string => {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  
  const direction = isLatitude 
    ? (decimal >= 0 ? 'N' : 'S')
    : (decimal >= 0 ? 'E' : 'W');
  
  return `${degrees}°${minutes}'${seconds.toFixed(1)}"${direction}`;
};

// Create custom icon for Leaflet (singleton)
const customIcon = (() => {
  const svgString = `
    <svg width="30" height="44" viewBox="0 0 30 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_dd_11_1957)">
        <path d="M3 14C3 7.37258 8.37258 2 15 2C21.6274 2 27 7.37258 27 14C27 20.6274 21.6274 26 15 26C8.37258 26 3 20.6274 3 14Z" fill="#202020"/>
        <g clip-path="url(#clip0_11_1957)">
          <path d="M18.9775 17.3525L15 21.3299L11.0225 17.3525C8.82582 15.1558 8.82582 11.5942 11.0225 9.39753C13.2192 7.20082 16.7808 7.20082 18.9775 9.39753C21.1742 11.5942 21.1742 15.1558 18.9775 17.3525ZM15 15.875C16.3807 15.875 17.5 14.7557 17.5 13.375C17.5 11.9943 16.3807 10.875 15 10.875C13.6193 10.875 12.5 11.9943 12.5 13.375C12.5 14.7557 13.6193 15.875 15 15.875ZM15 14.625C14.3096 14.625 13.75 14.0654 13.75 13.375C13.75 12.6846 14.3096 12.125 15 12.125C15.6904 12.125 16.25 12.6846 16.25 13.375C16.25 14.0654 15.6904 14.625 15 14.625Z" fill="white"/>
        </g>
        <path d="M13.5 38C13.5 38.8284 14.1716 39.5 15 39.5C15.8284 39.5 16.5 38.8284 16.5 38H13.5ZM15 26H13.5V38H15H16.5V26H15Z" fill="#202020"/>
      </g>
      <defs>
        <filter id="filter0_dd_11_1957" x="0" y="0" width="30" height="43.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="1.5"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_11_1957"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"/>
          <feBlend mode="normal" in2="effect1_dropShadow_11_1957" result="effect2_dropShadow_11_1957"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_11_1957" result="shape"/>
        </filter>
        <clipPath id="clip0_11_1957">
          <rect width="15" height="15" fill="white" transform="translate(7.5 6.5)"/>
        </clipPath>
      </defs>
    </svg>
  `;
  
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgBlob);
  
  return new Icon({
    iconUrl: svgUrl,
    iconSize: [30, 44],
    iconAnchor: [15, 44],
    popupAnchor: [0, -44],
  });
})();

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
    <div className="w-full h-auto flex flex-col items-center justify-center py-16">
      {/* Magnifying glass icon */}
      <div className="mb-5">
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z" fill="#89898A"/>
        </svg>
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ height: '22px' }}>
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-gray-500 text-center" style={{ height: '17px' }}>
        {description}
      </p>
    </div>
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
    <div
      className="absolute z-50 flex flex-col items-start p-2 gap-1 w-[186px] h-[66px] bg-white rounded-lg shadow-md"
      style={{
        left: position.x,
        top: position.y,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <p className="text-sm font-medium text-gray-900 truncate w-full">
        {pin.address || 'Loading address...'}
      </p>
      <p className="text-xs text-gray-500 truncate w-full">
        {`${toDMS(pin.latitude, true)} ${toDMS(pin.longitude, false)}`}
      </p>
    </div>
  );
};

export const MapPage: React.FC = () => {
  const {
    map,
    addPin,
    removePin,
    updatePin,
    selectPin,
  } = useAppStore();
  
  const pins = map.pins;

  const { reverseGeocode } = useGeocoding();
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [hoveredPin, setHoveredPin] = useState<Pin | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    if (isAddingPin) return;
    
    setIsAddingPin(true);
    
    try {
      // Generate ID beforehand
      const pinId = Date.now().toString();
      
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
                      icon={customIcon}
                      draggable={true}
                      eventHandlers={{
                        click: () => selectPin(pin),
                        dragend: (e) => handlePinDragEnd(pin.id, e),
                      }}
                    >
              <Popup>
                <div className="p-2">
                  <p className="font-medium text-gray-900">
                    {pin.address || 'Loading address...'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {`${toDMS(pin.latitude, true)} ${toDMS(pin.longitude, false)}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Added: {formatDate(new Date(pin.createdAt))}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

        {/* Top Header Bar */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 flex items-center justify-center py-3">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 5L9 2L15 5L21.303 2.2987C21.5569 2.18992 21.8508 2.30749 21.9596 2.56131C21.9862 2.62355 22 2.69056 22 2.75827V19L15 22L9 19L2.69696 21.7013C2.44314 21.8101 2.14921 21.6925 2.04043 21.4387C2.01375 21.3765 2 21.3094 2 21.2417V5ZM16 19.3955L20 17.6812V5.03308L16 6.74736V19.3955ZM14 19.2639V6.73607L10 4.73607V17.2639L14 19.2639ZM8 17.2526V4.60451L4 6.31879V18.9669L8 17.2526Z" fill="#202020"/>
            </svg>
            <h1 className="text-2xl font-bold text-gray-900">Map Pinboard</h1>
          </div>
        </div>

      {/* Left Sidebar Overlay */}
      <div className="absolute top-24 left-6 bottom-6 z-20 w-80">
            <div className="h-full flex flex-col bg-white rounded-lg">
            <div className="h-15 border-b border-gray-300 pt-5 pb-3 px-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Pin Lists ({pins.length})
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {pins.length === 0 ? (
                <EmptyState 
                  title="No Result Found"
                  description="Your map pin list will show in here."
                />
              ) : (
                <div>
                  {pins.map((pin: Pin, index: number) => (
                    <div
                      key={pin.id}
                      className="h-[86px] flex items-center gap-3 hover:bg-gray-50 transition-colors p-3 border-b border-gray-100"
                      onMouseEnter={() => setHoveredPin(pin)}
                      onMouseLeave={() => setHoveredPin(null)}
                    >
                      {/* Avatar */}
                      <div className="w-[38px] h-[38px] border rounded-full flex-none flex items-center justify-center bg-[#E9E9EB]/60">
                        <span className="text-sm font-medium text-blue-500">{index + 1}</span>
                      </div>
                      
                      {/* Middle Content */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {pin.address || 'Loading address...'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {`${toDMS(pin.latitude, true)} ${toDMS(pin.longitude, false)}`}
                        </p>
                      </div>
                      
                      {/* Icon Button */}
                      <button
                        onClick={() => handleRemovePin(pin.id)}
                        className="w-[40px] h-[40px] bg-white border border-[#D8D8DA] rounded-full flex items-center justify-center flex-none hover:bg-gray-50 transition-colors"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z" fill="#F73B3B"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
      </div>

      {/* Tooltip */}
      {hoveredPin && tooltipPosition && (
        <PinTooltip 
          pin={hoveredPin} 
          position={tooltipPosition} 
        />
      )}
    </div>
  );
};