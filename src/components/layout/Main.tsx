import React from 'react';
import { cn } from '@/utils';

export interface MainProps {
  children: React.ReactNode;
  className?: string;
}

export const Main: React.FC<MainProps> = ({ children, className }) => {
  return (
    <main className={cn('flex-1 overflow-auto', className)}>
      {children}
    </main>
  );
};

