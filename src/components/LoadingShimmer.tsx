// Loading shimmer component for skeleton loading states
import React from 'react';
import { motion } from 'framer-motion';

interface LoadingShimmerProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const LoadingShimmer: React.FC<LoadingShimmerProps> = ({
  width = '100%',
  height = '16px',
  className = '',
}) => {
  return (
    <motion.div
      className={`bg-gray-200 rounded animate-pulse ${className}`}
      style={{ width, height }}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// Specific shimmer components for common use cases
export const AddressShimmer: React.FC = () => (
  <LoadingShimmer width="160px" height="14px" className="mb-1" />
);

export const CoordinatesShimmer: React.FC = () => (
  <LoadingShimmer width="120px" height="12px" />
);

export const PinListShimmer: React.FC = () => (
  <div className="p-3">
    <div className="flex items-center gap-3">
      <LoadingShimmer width="38px" height="38px" className="rounded-full" />
      <div className="flex-1">
        <AddressShimmer />
        <CoordinatesShimmer />
      </div>
      <LoadingShimmer width="40px" height="40px" className="rounded-full" />
    </div>
  </div>
);
