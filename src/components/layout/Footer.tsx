import React from 'react';
import { cn } from '@/utils';

export interface FooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ children, className }) => {
  return (
    <footer
      className={cn(
        'bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {children}
    </footer>
  );
};

