import React from 'react';
import { cn } from '@/utils';

export interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ children, className }) => {
  return (
    <header
      className={cn(
        'bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {children}
    </header>
  );
};

