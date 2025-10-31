import React from 'react';
import { useMapEvents } from 'react-leaflet';

export interface MapEventsProps {
  onMapClick: (lat: number, lng: number) => void;
}

export const MapEvents: React.FC<MapEventsProps> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
};

