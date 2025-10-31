import { Icon } from 'leaflet';
import mapPinSvg from '@/assets/images/MapPin.svg?raw';

/**
 * Creates a Leaflet icon from MapPin.svg
 * Sanitizes filters/clip-paths for data URL safety
 */
export const createPinIcon = () => {
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

