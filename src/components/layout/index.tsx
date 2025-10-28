// Layout components
import React from 'react';
import { cn } from '@/utils';
import { useViewport } from '@/hooks';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {children}
    </div>
  );
};

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  maxWidth = 'xl',
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8',
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
};

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ children, className }) => {
  return (
    <header
      className={cn(
        'bg-white shadow-sm border-b border-gray-200',
        className
      )}
    >
      {children}
    </header>
  );
};

interface MainProps {
  children: React.ReactNode;
  className?: string;
}

export const Main: React.FC<MainProps> = ({ children, className }) => {
  return (
    <main className={cn('flex-1', className)}>
      {children}
    </main>
  );
};

interface FooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ children, className }) => {
  return (
    <footer
      className={cn(
        'bg-white border-t border-gray-200',
        className
      )}
    >
      {children}
    </footer>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
}) => {
  const viewport = useViewport();
  
  const getGridCols = () => {
    if (viewport === 'desktop') return `grid-cols-${columns.desktop}`;
    if (viewport === 'mobile-landscape') return `grid-cols-${columns.tablet}`;
    return `grid-cols-${columns.mobile}`;
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

interface ResponsiveFlexProps {
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
