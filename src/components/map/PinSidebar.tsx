import React from 'react';
import { motion } from 'framer-motion';
import { Pin } from '@/types';
import { EmptyState } from './EmptyState';
import { AnimatedPinListItem } from '@/components/AnimatedPinListItem';

export interface PinSidebarProps {
  pins: Pin[];
  selectedPin: Pin | null;
  viewport: 'desktop' | 'mobile-landscape' | 'mobile-portrait';
  baseHeight: number;
  dragOffset: number;
  isDragging: boolean;
  newPinId: string | null;
  onDragStart: (e: React.TouchEvent | React.MouseEvent) => void;
  onRemovePin: (pinId: string) => void;
  onMouseEnter: (pin: Pin) => void;
  onMouseLeave: () => void;
  onSelect: (pin: Pin) => void;
  onClearAll: () => void;
}

export const PinSidebar: React.FC<PinSidebarProps> = ({
  pins,
  selectedPin,
  viewport,
  baseHeight,
  dragOffset,
  isDragging,
  newPinId,
  onDragStart,
  onRemovePin,
  onMouseEnter,
  onMouseLeave,
  onSelect,
  onClearAll,
}) => {
  return (
    <motion.div
      className={`absolute z-20 ${
        viewport === 'mobile-portrait'
          ? 'left-0 right-0 bottom-0 w-full'
          : 'left-[24px] bottom-0 w-[360px] h-[344px] lg:top-24 lg:left-6 lg:bottom-6 lg:w-80 lg:h-auto'
      }`}
      style={
        viewport === 'mobile-portrait'
          ? {
              height: baseHeight + Math.max(0, -dragOffset),
              transition: isDragging ? 'none' : 'height 0.3s ease-out',
            }
          : {}
      }
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div
        className={`h-full flex flex-col bg-white dark:bg-gray-800 ${
          viewport === 'mobile-portrait'
            ? 'rounded-t-[16px] lg:rounded-lg'
            : 'rounded-t-[10px] rounded-b-none lg:rounded-lg'
        }`}
      >
        <div
          className={`border-b border-gray-300 dark:border-gray-600 pt-5 pb-3 px-4 ${
            viewport === 'mobile-portrait'
              ? 'pt-3 cursor-grab active:cursor-grabbing select-none'
              : 'pt-5'
          }`}
          style={viewport === 'mobile-portrait' ? { touchAction: 'none' } : {}}
          onTouchStart={viewport === 'mobile-portrait' ? onDragStart : undefined}
          onMouseDown={viewport === 'mobile-portrait' ? onDragStart : undefined}
        >
          {/* Drag handle for mobile portrait */}
          {viewport === 'mobile-portrait' && (
            <div className="flex justify-center mb-2">
              <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Pin Lists ({pins.length})
            </h3>
            {pins.length > 0 && (
              <motion.button
                onClick={onClearAll}
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
                  onRemove={onRemovePin}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  onSelect={onSelect}
                  isSelected={selectedPin?.id === pin.id}
                  isNewPin={pin.id === newPinId}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

