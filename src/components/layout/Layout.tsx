import React from 'react';
import { cn } from '@/utils';
import { Header, HeaderProps } from './Header';
import { Main, MainProps } from './Main';
import { Footer, FooterProps } from './Footer';

export interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  headerProps?: HeaderProps;
  mainProps?: MainProps;
  footer?: React.ReactNode;
  footerProps?: FooterProps;
  /**
   * Layout structure type:
   * - 'full' - Full page layout with header, main, and footer
   * - 'minimal' - Minimal layout without header/footer (just wrapper)
   */
  variant?: 'full' | 'minimal';
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  header,
  headerProps,
  mainProps,
  footer,
  footerProps,
  variant = 'full',
}) => {
  if (variant === 'minimal') {
    return (
      <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col', className)}>
      {header && (
        <Header {...headerProps}>
          {header}
        </Header>
      )}
      <Main {...mainProps}>
        {children}
      </Main>
      {footer && (
        <Footer {...footerProps}>
          {footer}
        </Footer>
      )}
    </div>
  );
};

