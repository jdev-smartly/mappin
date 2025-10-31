import React from 'react';
import { cn } from '@/utils';
import { useViewport } from '@/hooks';

export interface ResponsiveFlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: {
    mobile: 'row' | 'col';
    tablet: 'row' | 'col';
    desktop: 'row' | 'col';
  };
  gap?: 'sm' | 'md' | 'lg';
}

export const ResponsiveFlex: React.FC<ResponsiveFlexProps> = ({
  children,
  className,
  direction = { mobile: 'col', tablet: 'row', desktop: 'row' },
  gap = 'md',
}) => {
  const viewport = useViewport();
  
  const getFlexDirection = () => {
    if (viewport === 'desktop') return direction.desktop === 'row' ? 'flex-row' : 'flex-col';
    if (viewport === 'mobile-landscape') return direction.tablet === 'row' ? 'flex-row' : 'flex-col';
    return direction.mobile === 'row' ? 'flex-row' : 'flex-col';
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div
      className={cn(
        'flex',
        getFlexDirection(),
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

