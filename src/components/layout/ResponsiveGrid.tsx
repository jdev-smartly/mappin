import React from 'react';
import { cn } from '@/utils';
import { useViewport } from '@/hooks';

export interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

const GRID_COLUMN_CLASS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

const resolveGridCols = (count: number) => GRID_COLUMN_CLASS[count] ?? GRID_COLUMN_CLASS[1];

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
}) => {
  const viewport = useViewport();
  
  const getGridCols = () => {
    if (viewport === 'desktop') return resolveGridCols(columns.desktop);
    if (viewport === 'mobile-landscape') return resolveGridCols(columns.tablet);
    return resolveGridCols(columns.mobile);
  };

  return (
    <div
      className={cn(
        'grid gap-4 sm:gap-6',
        getGridCols(),
        className
      )}
    >
      {children}
    </div>
  );
};

