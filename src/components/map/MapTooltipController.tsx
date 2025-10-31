import React from 'react';
import { useMap } from 'react-leaflet';
import { Pin } from '@/types';

export interface MapTooltipControllerProps {
  hoveredPin: Pin | null;
  onPositionUpdate: (position: { x: number; y: number } | null) => void;
}

export const MapTooltipController: React.FC<MapTooltipControllerProps> = ({
  hoveredPin,
  onPositionUpdate,
}) => {
  const map = useMap();

  const updateTooltipPosition = React.useCallback(() => {
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

  React.useEffect(() => {
    updateTooltipPosition();
  }, [updateTooltipPosition]);

  React.useEffect(() => {
    if (hoveredPin && map) {
      // Add event listeners for map movement and zoom
      const handleMapMove = () => updateTooltipPosition();

      map.on('move', handleMapMove);
      map.on('zoom', handleMapMove);
      map.on('resize', handleMapMove);

      return () => {
        map.off('move', handleMapMove);
        map.off('zoom', handleMapMove);
        map.off('resize', handleMapMove);
      };
    }
  }, [hoveredPin, map, updateTooltipPosition]);

  return null;
};

