// Animated list item component for the pin sidebar
import React from 'react';
import { motion } from 'framer-motion';
import { Pin } from '@/types';

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

interface AnimatedPinListItemProps {
  pin: Pin;
  index: number;
  onRemove: (pinId: string) => void;
  onMouseEnter: (pin: Pin) => void;
  onMouseLeave: () => void;
  onSelect?: (pin: Pin) => void;
  isSelected?: boolean;
  isNewPin?: boolean;
}

export const AnimatedPinListItem: React.FC<AnimatedPinListItemProps> = ({
  pin,
  index,
  onRemove,
  onMouseEnter,
  onMouseLeave,
  onSelect,
  isSelected = false,
  isNewPin = false,
}) => {
  return (
    <motion.div
      layout
      initial={{ 
        height: 0, 
        opacity: 0,
        backgroundColor: isNewPin ? 'rgba(59, 130, 246, 0.12)' : 'rgba(0, 0, 0, 0)'
      }}
      animate={{ 
        height: 'auto', 
        opacity: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)'
      }}
      exit={{ 
        height: 0, 
        opacity: 0,
        scale: 0.95
      }}
      transition={{ 
        duration: 0.2,
        backgroundColor: { duration: 0.9 }
      }}
      className="overflow-hidden border-b border-gray-100 dark:border-gray-700"
    >
      <motion.div
        className={`h-[86px] flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors p-3 cursor-pointer ${
          isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
        }`}
        onMouseEnter={() => onMouseEnter(pin)}
        onMouseLeave={onMouseLeave}
        onClick={() => onSelect?.(pin)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.1 }}
      >
        {/* Avatar */}
        <motion.div 
          className="w-[38px] h-[38px] border rounded-full flex-none flex items-center justify-center bg-[#E9E9EB]/60 dark:bg-gray-600/60"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.1 }}
        >
          <span className="text-sm font-medium text-blue-500 dark:text-blue-400">{index + 1}</span>
        </motion.div>
        
        {/* Middle Content */}
        <div className="flex-1 min-w-0">
          <motion.p 
            className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate"
            initial={isNewPin ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            {pin.address || 'Loading address...'}
          </motion.p>
          <motion.p 
            className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate"
            initial={isNewPin ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.2 }}
          >
            {`${toDMS(pin.latitude, true)} ${toDMS(pin.longitude, false)}`}
          </motion.p>
        </div>
        
        {/* Icon Button */}
        <motion.button
          onClick={() => onRemove(pin.id)}
          className="w-[40px] h-[40px] bg-white dark:bg-gray-700 border border-[#D8D8DA] dark:border-gray-600 rounded-full flex items-center justify-center flex-none hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z" fill="#F73B3B"/>
          </svg>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
