import React from 'react';
import { motion } from 'framer-motion';
import { Pin } from '@/types';
import { LoadingShimmer } from '@/components/LoadingShimmer';

export interface PinTooltipProps {
  pin: Pin;
  position: { x: number; y: number };
}

export const PinTooltip: React.FC<PinTooltipProps> = ({ pin, position }) => {
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

